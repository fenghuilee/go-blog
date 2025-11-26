package handlers

import (
	"go-blog/internal/database"
	"go-blog/internal/models"
	"go-blog/pkg/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetCommentsByArticleID 获取文章评论
func GetCommentsByArticleID(c *gin.Context) {
	articleID, err := strconv.ParseUint(c.Param("articleId"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的文章ID")
		return
	}

	var comments []models.Comment
	if err := database.DB.Where("article_id = ?", articleID).
		Order("created_at DESC").
		Find(&comments).Error; err != nil {
		utils.InternalServerError(c, err.Error())
		return
	}

	utils.Success(c, comments)
}

// CreateComment 发表评论
func CreateComment(c *gin.Context) {
	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	// 验证文章是否存在
	var article models.Article
	if err := database.DB.First(&article, comment.ArticleID).Error; err != nil {
		utils.Error(c, 404, "文章不存在")
		return
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		utils.InternalServerError(c, "发表评论失败")
		return
	}

	utils.SuccessWithMessage(c, "评论发表成功", comment)
}

// DeleteComment 删除评论
func DeleteComment(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的评论ID")
		return
	}

	var comment models.Comment
	if err := database.DB.First(&comment, id).Error; err != nil {
		utils.Error(c, 404, "评论不存在")
		return
	}

	if err := database.DB.Delete(&comment).Error; err != nil {
		utils.InternalServerError(c, "删除评论失败")
		return
	}

	utils.SuccessWithMessage(c, "评论删除成功", nil)
}
