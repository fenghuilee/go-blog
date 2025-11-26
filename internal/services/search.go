package services

import (
	"go-blog/internal/database"
	"go-blog/internal/models"
)

// SearchArticles 搜索文章
func SearchArticles(keyword string, page, pageSize int) (*ArticleListResponse, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 10
	}

	db := database.DB.Model(&models.Article{}).Where("status = ?", "published")

	if keyword != "" {
		searchPattern := "%" + keyword + "%"
		db = db.Where("title LIKE ? OR content LIKE ? OR summary LIKE ?",
			searchPattern, searchPattern, searchPattern)
	}

	var total int64
	db.Count(&total)

	var articles []models.Article
	offset := (page - 1) * pageSize
	err := db.Preload("Author").Preload("Categories").Preload("Tags").
		Order("created_at DESC").
		Limit(pageSize).Offset(offset).
		Find(&articles).Error

	if err != nil {
		return nil, err
	}

	return &ArticleListResponse{
		Total:    total,
		Page:     page,
		PageSize: pageSize,
		List:     articles,
	}, nil
}
