package services

// GenerateArticleRequest 生成文章请求
type GenerateArticleRequest struct {
	Title     string   `json:"title"`
	Keywords  []string `json:"keywords"`
	Outline   string   `json:"outline"`
	WordCount int      `json:"word_count"`
}

// ContinueWritingRequest 续写请求
type ContinueWritingRequest struct {
	ExistingContent string `json:"existing_content"`
	Direction       string `json:"direction"`
}

// PolishArticleRequest 润色请求
type PolishArticleRequest struct {
	Content string `json:"content"`
	Style   string `json:"style"` // professional, casual, academic
}

// ExpandOutlineRequest 扩展大纲请求
type ExpandOutlineRequest struct {
	Outline   string `json:"outline"`
	WordCount int    `json:"word_count"`
}

// AIService AI服务接口
type AIService interface {
	// GenerateArticle 生成文章初稿
	GenerateArticle(req *GenerateArticleRequest) (string, error)

	// ContinueWriting 续写内容
	ContinueWriting(req *ContinueWritingRequest) (string, error)

	// PolishArticle 润色文章
	PolishArticle(req *PolishArticleRequest) (string, error)

	// ExpandOutline 大纲扩展
	ExpandOutline(req *ExpandOutlineRequest) (string, error)
}
