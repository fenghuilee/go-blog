package web

import (
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

// ServeSPA 处理 SPA 路由
// 如果请求的文件存在，返回该文件；否则返回 index.html（由前端路由处理）
func ServeSPA() gin.HandlerFunc {
	// 从 embed.FS 中获取文件系统，去掉 html 前缀
	fsys, err := fs.Sub(HTMLFiles, "dist")
	if err != nil {
		panic("无法加载静态文件: " + err.Error())
	}

	// 创建文件服务器
	fileServer := http.FileServer(http.FS(fsys))

	return func(c *gin.Context) {
		// 获取请求路径
		path := c.Request.URL.Path

		// 如果是 API 请求，跳过（应该由 API 路由处理）
		if strings.HasPrefix(path, "/api") {
			c.Next()
			return
		}

		// 清理路径，移除开头的斜杠
		path = strings.TrimPrefix(path, "/")
		if path == "" {
			path = "index.html"
		}

		// 尝试打开文件
		file, err := fsys.Open(path)
		if err != nil {
			// 文件不存在，返回 index.html（SPA 路由）
			c.FileFromFS("index.html", http.FS(fsys))
			return
		}
		file.Close()

		// 文件存在，检查是否是目录
		info, err := file.Stat()
		if err != nil || info.IsDir() {
			// 如果是目录或无法获取信息，返回 index.html
			c.FileFromFS("index.html", http.FS(fsys))
			return
		}

		// 设置正确的 Content-Type
		ext := filepath.Ext(path)
		switch ext {
		case ".html":
			c.Header("Content-Type", "text/html; charset=utf-8")
		case ".css":
			c.Header("Content-Type", "text/css; charset=utf-8")
		case ".js":
			c.Header("Content-Type", "application/javascript; charset=utf-8")
		case ".json":
			c.Header("Content-Type", "application/json; charset=utf-8")
		case ".png":
			c.Header("Content-Type", "image/png")
		case ".jpg", ".jpeg":
			c.Header("Content-Type", "image/jpeg")
		case ".gif":
			c.Header("Content-Type", "image/gif")
		case ".svg":
			c.Header("Content-Type", "image/svg+xml")
		case ".ico":
			c.Header("Content-Type", "image/x-icon")
		case ".woff", ".woff2":
			c.Header("Content-Type", "font/woff")
		case ".ttf":
			c.Header("Content-Type", "font/ttf")
		case ".eot":
			c.Header("Content-Type", "application/vnd.ms-fontobject")
		}

		// 返回文件
		fileServer.ServeHTTP(c.Writer, c.Request)
	}
}
