package main

import (
	"fmt"
	"log"

	"go-blog/internal/config"
	"go-blog/internal/database"
	"go-blog/internal/handlers"
	"go-blog/internal/router"
	"go-blog/pkg/utils"
	"go-blog/web"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	if err := config.LoadConfig("configs/config.yaml"); err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 初始化JWT
	utils.InitJWT(config.AppConfig.JWT.Secret)

	// 初始化数据库
	if err := database.InitDB(); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}
	defer database.CloseDB()

	// 自动迁移
	if err := database.AutoMigrate(); err != nil {
		log.Fatalf("数据库迁移失败: %v", err)
	}

	// 初始化种子数据
	if err := database.SeedData(); err != nil {
		log.Fatalf("种子数据初始化失败: %v", err)
	}

	// 设置Gin模式
	gin.SetMode(config.AppConfig.Server.Mode)

	// 初始化AI服务
	handlers.InitAIService()

	// 设置路由，传入 SPA handler（嵌入的前端静态文件）
	r := router.SetupRouter(web.ServeSPA())

	// 启动服务器
	addr := fmt.Sprintf(":%d", config.AppConfig.Server.Port)
	log.Printf("服务器启动在端口 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
