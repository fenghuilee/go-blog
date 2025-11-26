package database

import (
	"log"

	"go-blog/internal/models"
	"go-blog/pkg/utils"
)

// SeedData 初始化种子数据
func SeedData() error {
	// 检查是否已有管理员用户
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count > 0 {
		log.Println("数据库已有数据，跳过种子数据初始化")
		return nil
	}

	// 创建默认管理员
	hashedPassword, err := utils.HashPassword("admin123")
	if err != nil {
		return err
	}

	admin := models.User{
		Username: "admin",
		Password: hashedPassword,
		Email:    "admin@example.com",
		Role:     "author",
	}

	if err := DB.Create(&admin).Error; err != nil {
		return err
	}

	// 创建默认分类
	categories := []models.Category{
		{Name: "技术", Description: "技术相关文章"},
		{Name: "生活", Description: "生活随笔"},
		{Name: "思考", Description: "个人思考"},
	}

	for _, category := range categories {
		DB.Create(&category)
	}

	// 创建默认标签
	tags := []models.Tag{
		{Name: "Golang"},
		{Name: "React"},
		{Name: "数据库"},
	}

	for _, tag := range tags {
		DB.Create(&tag)
	}

	// 创建默认系统设置
	settings := []models.Setting{
		{Key: "site_name", Value: "我的博客"},
		{Key: "site_description", Value: "分享技术与生活"},
		{Key: "site_subtitle", Value: "记录成长的每一步"},
		{Key: "seo_keywords", Value: "博客,技术,分享"},
		{Key: "seo_description", Value: "一个记录技术与生活的博客"},
		{Key: "posts_per_page", Value: "10"},
		{Key: "enable_comments", Value: "true"},
		{Key: "icp_beian", Value: ""},
	}

	for _, setting := range settings {
		DB.Create(&setting)
	}

	log.Println("种子数据初始化成功")
	log.Println("默认管理员账号: admin / admin123")
	return nil
}
