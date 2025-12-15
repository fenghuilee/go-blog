package handlers

import (
	"encoding/json"
	"fmt"
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

	streamResponse(c, func(callback func(string) error) error {
		return aiService.StreamGenerateArticle(&req, callback)
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

	streamResponse(c, func(callback func(string) error) error {
		return aiService.StreamContinueWriting(&req, callback)
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

	streamResponse(c, func(callback func(string) error) error {
		return aiService.StreamPolishArticle(&req, callback)
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

	streamResponse(c, func(callback func(string) error) error {
		return aiService.StreamExpandOutline(&req, callback)
	})
}

// streamResponse 辅助函数：处理SSE流式响应
func streamResponse(c *gin.Context, param func(func(string) error) error) {
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")

	err := param(func(content string) error {
		data := gin.H{
			"content": content,
		}
		jsonData, _ := json.Marshal(data)
		fmt.Fprintf(c.Writer, "data: %s\n\n", jsonData)
		c.Writer.Flush()
		return nil
	})

	if err != nil {
		// Log error
		fmt.Printf("Stream error: %v\n", err)
		// 发送错误事件
		fmt.Fprintf(c.Writer, "event: error\ndata: {\"error\": \"%s\"}\n\n", err.Error())
		c.Writer.Flush()
	} else {
		// 发送完成信号
		fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
		c.Writer.Flush()
	}
}
