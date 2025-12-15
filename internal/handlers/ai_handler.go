package handlers

import (
	"net/http"

	"go-blog/internal/config"
	"go-blog/internal/services"

	"github.com/gin-gonic/gin"
)

var aiService services.AIService

// InitAIService 初始化AI服务
func InitAIService() {
	cfg := config.AppConfig.AI.Qwen
	aiService = services.NewQwenService(
		cfg.APIKey,
		cfg.APIURL,
		cfg.Model,
		cfg.MaxTokens,
		cfg.Temperature,
	)
}

// GenerateArticle 生成文章
func GenerateArticle(c *gin.Context) {
	var req services.GenerateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误: " + err.Error()})
		return
	}

	// 验证必填字段
	if req.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "标题不能为空"})
		return
	}

	content, err := aiService.GenerateArticle(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"message": "success",
		"data": gin.H{
			"content": content,
		},
	})
}

// ContinueWriting 续写文章
func ContinueWriting(c *gin.Context) {
	var req services.ContinueWritingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误: " + err.Error()})
		return
	}

	if req.ExistingContent == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "现有内容不能为空"})
		return
	}

	content, err := aiService.ContinueWriting(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "续写失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"message": "success",
		"data": gin.H{
			"content": content,
		},
	})
}

// PolishArticle 润色文章
func PolishArticle(c *gin.Context) {
	var req services.PolishArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误: " + err.Error()})
		return
	}

	if req.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "内容不能为空"})
		return
	}

	content, err := aiService.PolishArticle(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "润色失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"message": "success",
		"data": gin.H{
			"content": content,
		},
	})
}

// ExpandOutline 扩展大纲
func ExpandOutline(c *gin.Context) {
	var req services.ExpandOutlineRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误: " + err.Error()})
		return
	}

	if req.Outline == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "大纲不能为空"})
		return
	}

	content, err := aiService.ExpandOutline(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "扩展失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"message": "success",
		"data": gin.H{
			"content": content,
		},
	})
}
