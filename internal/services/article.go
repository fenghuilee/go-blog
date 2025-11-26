package services

import (
	"errors"
	"go-blog/internal/database"
	"go-blog/internal/models"
)

// ArticleListQuery 文章列表查询参数
type ArticleListQuery struct {
	Page       int    `form:"page"`
	PageSize   int    `form:"page_size"`
	CategoryID *uint  `form:"category_id"`
	TagID      *uint  `form:"tag_id"`
	Status     string `form:"status"`
	ShowAll    bool   `form:"show_all"` // 是否显示所有状态（包括草稿）
}

// ArticleListResponse 文章列表响应
type ArticleListResponse struct {
	Total    int64            `json:"total"`
	Page     int              `json:"page"`
	PageSize int              `json:"page_size"`
	List     []models.Article `json:"list"`
}

// CreateArticleRequest 创建文章请求
type CreateArticleRequest struct {
	Title       string `json:"title" binding:"required"`
	Content     string `json:"content" binding:"required"`
	Summary     string `json:"summary"`
	CategoryIDs []uint `json:"category_ids"` // 改为多分类
	TagIDs      []uint `json:"tag_ids"`
	Status      string `json:"status"`
}

// UpdateArticleRequest 更新文章请求
type UpdateArticleRequest struct {
	Title       *string `json:"title"`
	Content     *string `json:"content"`
	Summary     *string `json:"summary"`
	CategoryIDs []uint  `json:"category_ids"` // 改为多分类
	TagIDs      []uint  `json:"tag_ids"`
	Status      *string `json:"status"`
}

// GetArticleList 获取文章列表
func GetArticleList(query ArticleListQuery) (*ArticleListResponse, error) {
	if query.Page <= 0 {
		query.Page = 1
	}
	if query.PageSize <= 0 || query.PageSize > 100 {
		query.PageSize = 10
	}

	db := database.DB.Model(&models.Article{})

	// 筛选条件
	if query.CategoryID != nil {
		db = db.Joins("JOIN article_categories ON article_categories.article_id = articles.id").
			Where("article_categories.category_id = ?", *query.CategoryID)
	}
	if query.Status != "" {
		db = db.Where("status = ?", query.Status)
	} else if !query.ShowAll {
		// 仅当 ShowAll 为 false 时，默认只显示已发布的文章
		db = db.Where("status = ?", "published")
	}
	if query.TagID != nil {
		db = db.Joins("JOIN article_tags ON article_tags.article_id = articles.id").
			Where("article_tags.tag_id = ?", *query.TagID)
	}

	// 总数
	var total int64
	db.Count(&total)

	// 分页查询
	var articles []models.Article
	offset := (query.Page - 1) * query.PageSize
	err := db.Preload("Author").Preload("Categories").Preload("Tags").
		Order("created_at DESC").
		Limit(query.PageSize).Offset(offset).
		Find(&articles).Error

	if err != nil {
		return nil, err
	}

	return &ArticleListResponse{
		Total:    total,
		Page:     query.Page,
		PageSize: query.PageSize,
		List:     articles,
	}, nil
}

// GetArticleByID 根据ID获取文章详情
func GetArticleByID(id uint) (*models.Article, error) {
	var article models.Article
	err := database.DB.Preload("Author").Preload("Categories").Preload("Tags").
		First(&article, id).Error

	if err != nil {
		return nil, errors.New("文章不存在")
	}

	// 增加浏览量
	database.DB.Model(&article).UpdateColumn("view_count", article.ViewCount+1)

	return &article, nil
}

// CreateArticle 创建文章
func CreateArticle(req CreateArticleRequest, authorID uint) (*models.Article, error) {
	article := models.Article{
		Title:    req.Title,
		Content:  req.Content,
		Summary:  req.Summary,
		AuthorID: authorID,
		Status:   req.Status,
	}

	if article.Status == "" {
		article.Status = "draft"
	}

	// 开始事务
	tx := database.DB.Begin()

	// 创建文章
	if err := tx.Create(&article).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// 关联分类
	if len(req.CategoryIDs) > 0 {
		var categories []models.Category
		tx.Where("id IN ?", req.CategoryIDs).Find(&categories)
		if err := tx.Model(&article).Association("Categories").Replace(categories); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// 关联标签
	if len(req.TagIDs) > 0 {
		var tags []models.Tag
		tx.Where("id IN ?", req.TagIDs).Find(&tags)
		if err := tx.Model(&article).Association("Tags").Replace(tags); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	tx.Commit()

	// 重新加载关联数据
	database.DB.Preload("Author").Preload("Categories").Preload("Tags").First(&article, article.ID)

	return &article, nil
}

// UpdateArticle 更新文章
func UpdateArticle(id uint, req UpdateArticleRequest, authorID uint) (*models.Article, error) {
	var article models.Article
	if err := database.DB.First(&article, id).Error; err != nil {
		return nil, errors.New("文章不存在")
	}

	// 检查权限
	if article.AuthorID != authorID {
		return nil, errors.New("无权限修改此文章")
	}

	// 更新字段
	updates := make(map[string]interface{})
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Content != nil {
		updates["content"] = *req.Content
	}
	if req.Summary != nil {
		updates["summary"] = *req.Summary
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}

	tx := database.DB.Begin()

	if err := tx.Model(&article).Updates(updates).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// 更新分类
	if req.CategoryIDs != nil {
		var categories []models.Category
		tx.Where("id IN ?", req.CategoryIDs).Find(&categories)
		if err := tx.Model(&article).Association("Categories").Replace(categories); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// 更新标签
	if req.TagIDs != nil {
		var tags []models.Tag
		tx.Where("id IN ?", req.TagIDs).Find(&tags)
		if err := tx.Model(&article).Association("Tags").Replace(tags); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	tx.Commit()

	// 重新加载
	database.DB.Preload("Author").Preload("Categories").Preload("Tags").First(&article, id)

	return &article, nil
}

// DeleteArticle 删除文章
func DeleteArticle(id uint, authorID uint) error {
	var article models.Article
	if err := database.DB.First(&article, id).Error; err != nil {
		return errors.New("文章不存在")
	}

	// 检查权限
	if article.AuthorID != authorID {
		return errors.New("无权限删除此文章")
	}

	return database.DB.Delete(&article).Error
}
