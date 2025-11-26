package services

import (
	"errors"
	"go-blog/internal/config"
	"go-blog/internal/database"
	"go-blog/internal/models"
	"go-blog/pkg/utils"
)

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

// Login 用户登录
func Login(username, password string) (*LoginResponse, error) {
	var user models.User

	// 查找用户
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, errors.New("用户名或密码错误")
	}

	// 验证密码
	if !utils.CheckPassword(password, user.Password) {
		return nil, errors.New("用户名或密码错误")
	}

	// 生成token
	token, err := utils.GenerateToken(
		user.ID,
		user.Username,
		user.Role,
		config.AppConfig.JWT.ExpireHours,
	)
	if err != nil {
		return nil, errors.New("生成令牌失败")
	}

	return &LoginResponse{
		Token: token,
		User:  &user,
	}, nil
}
