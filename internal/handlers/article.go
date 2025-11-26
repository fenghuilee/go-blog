package handlers

import (
	"go-blog/internal/services"
	"go-blog/pkg/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetArticleList 获取文章列表
func GetArticleList(c *gin.Context) {
	var query services.ArticleListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	resp, err := services.GetArticleList(query)
	if err != nil {
		utils.InternalServerError(c, err.Error())
		return
	}

	utils.Success(c, resp)
}

// GetArticleByID 获取文章详情
func GetArticleByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	article, err := services.GetArticleByID(uint(id))
	if err != nil {
		utils.Error(c, 404, err.Error())
		return
	}

	utils.Success(c, article)
}

// CreateArticle 创建文章
func CreateArticle(c *gin.Context) {
	var req services.CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	userID, _ := c.Get("user_id")
	article, err := services.CreateArticle(req, userID.(uint))
	if err != nil {
		utils.InternalServerError(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "文章创建成功", article)
}

// UpdateArticle 更新文章
func UpdateArticle(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	var req services.UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	userID, _ := c.Get("user_id")
	article, err := services.UpdateArticle(uint(id), req, userID.(uint))
	if err != nil {
		utils.Error(c, 400, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "文章更新成功", article)
}

// DeleteArticle 删除文章
func DeleteArticle(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	userID, _ := c.Get("user_id")
	err = services.DeleteArticle(uint(id), userID.(uint))
	if err != nil {
		utils.Error(c, 400, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "文章删除成功", nil)
}

// SearchArticles 搜索文章
func SearchArticles(c *gin.Context) {
	keyword := c.Query("keyword")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	resp, err := services.SearchArticles(keyword, page, pageSize)
	if err != nil {
		utils.InternalServerError(c, err.Error())
		return
	}

	utils.Success(c, resp)
}
