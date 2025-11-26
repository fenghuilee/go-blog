package handlers

import (
	"go-blog/internal/services"
	"go-blog/pkg/utils"

	"github.com/gin-gonic/gin"
)

// Login 登录处理器
func Login(c *gin.Context) {
	var req services.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	resp, err := services.Login(req.Username, req.Password)
	if err != nil {
		utils.Error(c, 400, err.Error())
		return
	}

	utils.Success(c, resp)
}
