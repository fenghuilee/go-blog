package router

import (
	"go-blog/internal/handlers"
	"go-blog/internal/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter 配置路由
func SetupRouter(spaHandler ...gin.HandlerFunc) *gin.Engine {
	r := gin.Default()

	// 全局中间件
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	// API路由组
	api := r.Group("/api")
	{
		// 公开接口
		api.POST("/auth/login", handlers.Login)

		// 文章相关（公开）
		api.GET("/articles", handlers.GetArticleList)
		api.GET("/articles/:id", handlers.GetArticleByID)
		api.GET("/articles/search", handlers.SearchArticles)

		// 分类相关（公开）
		api.GET("/categories", handlers.GetCategories)

		// 标签相关（公开）
		api.GET("/tags", handlers.GetTags)

		// 评论相关（公开）
		api.GET("/comments/:articleId", handlers.GetCommentsByArticleID)
		api.POST("/comments", handlers.CreateComment)

		// 设置相关（公开获取）
		api.GET("/settings", handlers.GetSettings)

		// 需要认证的接口
		auth := api.Group("")
		auth.Use(middleware.AuthMiddleware())
		auth.Use(middleware.AuthorOnly())
		{
			// 文章管理
			auth.POST("/articles", handlers.CreateArticle)
			auth.PUT("/articles/:id", handlers.UpdateArticle)
			auth.DELETE("/articles/:id", handlers.DeleteArticle)

			// 分类管理
			auth.POST("/categories", handlers.CreateCategory)
			auth.PUT("/categories/:id", handlers.UpdateCategory)
			auth.DELETE("/categories/:id", handlers.DeleteCategory)

			// 标签管理
			auth.POST("/tags", handlers.CreateTag)
			auth.DELETE("/tags/:id", handlers.DeleteTag)

			// 评论管理
			auth.DELETE("/comments/:id", handlers.DeleteComment)

			// 设置管理
			auth.PUT("/settings", handlers.UpdateSettings)

			// 用户管理
			auth.POST("/user/password", handlers.ChangePassword)
		}
	}

	// 静态文件和SPA路由（如果提供了handler）
	if len(spaHandler) > 0 && spaHandler[0] != nil {
		r.NoRoute(spaHandler[0])
	}

	return r
}
