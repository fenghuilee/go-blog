package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// QwenService 通义千问服务实现
type QwenService struct {
	apiKey      string
	apiURL      string
	model       string
	maxTokens   int
	temperature float64
	httpClient  *http.Client
}

// NewQwenService 创建通义千问服务实例
func NewQwenService(apiKey, apiURL, model string, maxTokens int, temperature float64) *QwenService {
	return &QwenService{
		apiKey:      apiKey,
		apiURL:      apiURL,
		model:       model,
		maxTokens:   maxTokens,
		temperature: temperature,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// OpenAI兼容模式API请求结构
type QwenRequest struct {
	Model       string        `json:"model"`
	Messages    []QwenMessage `json:"messages"`
	MaxTokens   int           `json:"max_tokens,omitempty"`
	Temperature float64       `json:"temperature,omitempty"`
}

// QwenMessage 消息结构
type QwenMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// OpenAI兼容模式API响应结构
type QwenResponse struct {
	ID      string `json:"id"`
	Choices []struct {
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		TotalTokens int `json:"total_tokens"`
	} `json:"usage"`
}

// GenerateArticle 生成文章初稿
func (s *QwenService) GenerateArticle(req *GenerateArticleRequest) (string, error) {
	prompt := s.buildGeneratePrompt(req)
	return s.callAPI(prompt)
}

// ContinueWriting 续写内容
func (s *QwenService) ContinueWriting(req *ContinueWritingRequest) (string, error) {
	prompt := s.buildContinuePrompt(req)
	return s.callAPI(prompt)
}

// PolishArticle 润色文章
func (s *QwenService) PolishArticle(req *PolishArticleRequest) (string, error) {
	prompt := s.buildPolishPrompt(req)
	return s.callAPI(prompt)
}

// ExpandOutline 扩展大纲
func (s *QwenService) ExpandOutline(req *ExpandOutlineRequest) (string, error) {
	prompt := s.buildExpandPrompt(req)
	return s.callAPI(prompt)
}

// buildGeneratePrompt 构建生成文章的提示词
func (s *QwenService) buildGeneratePrompt(req *GenerateArticleRequest) string {
	var prompt strings.Builder

	prompt.WriteString("你是一位专业的技术博客作者。请根据以下要求生成一篇文章：\n\n")
	prompt.WriteString(fmt.Sprintf("标题：%s\n", req.Title))

	if len(req.Keywords) > 0 {
		prompt.WriteString(fmt.Sprintf("关键词：%s\n", strings.Join(req.Keywords, "、")))
	}

	if req.Outline != "" {
		prompt.WriteString(fmt.Sprintf("大纲：\n%s\n", req.Outline))
	}

	wordCount := req.WordCount
	if wordCount == 0 {
		wordCount = 2000
	}
	prompt.WriteString(fmt.Sprintf("字数要求：约%d字\n\n", wordCount))

	prompt.WriteString("要求：\n")
	prompt.WriteString("1. 使用Markdown格式\n")
	prompt.WriteString("2. 包含清晰的段落结构，使用##、###等标题层级\n")
	prompt.WriteString("3. 适当使用代码示例（使用```代码块）\n")
	prompt.WriteString("4. 语言专业且易懂\n")
	prompt.WriteString("5. 内容充实，有深度\n")
	prompt.WriteString("6. 直接输出文章内容，不要额外的解释")

	return prompt.String()
}

// buildContinuePrompt 构建续写提示词
func (s *QwenService) buildContinuePrompt(req *ContinueWritingRequest) string {
	var prompt strings.Builder

	prompt.WriteString("请继续写下面这篇文章：\n\n")
	prompt.WriteString(req.ExistingContent)
	prompt.WriteString("\n\n")

	if req.Direction != "" {
		prompt.WriteString(fmt.Sprintf("续写方向：%s\n\n", req.Direction))
	}

	prompt.WriteString("要求：\n")
	prompt.WriteString("1. 保持与前文的风格和语气一致\n")
	prompt.WriteString("2. 使用Markdown格式\n")
	prompt.WriteString("3. 内容连贯自然\n")
	prompt.WriteString("4. 直接输出续写内容，不要重复已有内容\n")
	prompt.WriteString("5. 不要添加额外的解释或评论")

	return prompt.String()
}

// buildPolishPrompt 构建润色提示词
func (s *QwenService) buildPolishPrompt(req *PolishArticleRequest) string {
	var prompt strings.Builder

	prompt.WriteString("请对下面的文章进行润色和改进：\n\n")
	prompt.WriteString(req.Content)
	prompt.WriteString("\n\n")

	style := req.Style
	if style == "" {
		style = "professional"
	}

	prompt.WriteString("润色要求：\n")
	switch style {
	case "professional":
		prompt.WriteString("1. 使用专业、正式的语言风格\n")
	case "casual":
		prompt.WriteString("1. 使用轻松、易懂的语言风格\n")
	case "academic":
		prompt.WriteString("1. 使用学术、严谨的语言风格\n")
	}
	prompt.WriteString("2. 改善语言表达，使其更加流畅\n")
	prompt.WriteString("3. 优化文章结构和逻辑\n")
	prompt.WriteString("4. 修正语法和拼写错误\n")
	prompt.WriteString("5. 保持原有的Markdown格式\n")
	prompt.WriteString("6. 保留代码块和专业术语\n")
	prompt.WriteString("7. 直接输出润色后的完整文章")

	return prompt.String()
}

// buildExpandPrompt 构建扩展大纲提示词
func (s *QwenService) buildExpandPrompt(req *ExpandOutlineRequest) string {
	var prompt strings.Builder

	prompt.WriteString("请将下面的大纲扩展为完整的文章：\n\n")
	prompt.WriteString(req.Outline)
	prompt.WriteString("\n\n")

	wordCount := req.WordCount
	if wordCount == 0 {
		wordCount = 2000
	}
	prompt.WriteString(fmt.Sprintf("字数要求：约%d字\n\n", wordCount))

	prompt.WriteString("要求：\n")
	prompt.WriteString("1. 基于大纲的每个要点展开详细内容\n")
	prompt.WriteString("2. 使用Markdown格式，保持层级结构\n")
	prompt.WriteString("3. 补充细节、示例和解释\n")
	prompt.WriteString("4. 内容充实完整\n")
	prompt.WriteString("5. 直接输出完整文章")

	return prompt.String()
}

// callAPI 调用通义千问API (OpenAI兼容模式)
func (s *QwenService) callAPI(prompt string) (string, error) {
	// 构建请求 (OpenAI兼容格式)
	reqBody := QwenRequest{
		Model: s.model,
		Messages: []QwenMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
		MaxTokens:   s.maxTokens,
		Temperature: s.temperature,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("序列化请求失败: %w", err)
	}

	// 创建HTTP请求
	fullURL := s.apiURL + "/chat/completions"
	httpReq, err := http.NewRequest("POST", fullURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("创建请求失败: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+s.apiKey)

	// 发送请求
	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("API请求失败: %w", err)
	}
	defer resp.Body.Close()

	// 读取响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("读取响应失败: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API返回错误: %s, 响应: %s", resp.Status, string(body))
	}

	// 解析响应 (OpenAI兼容格式)
	var qwenResp QwenResponse
	if err := json.Unmarshal(body, &qwenResp); err != nil {
		return "", fmt.Errorf("解析响应失败: %w, 响应: %s", err, string(body))
	}

	if len(qwenResp.Choices) == 0 || qwenResp.Choices[0].Message.Content == "" {
		return "", fmt.Errorf("API返回空内容")
	}

	return qwenResp.Choices[0].Message.Content, nil
}
