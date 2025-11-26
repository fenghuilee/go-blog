package handlers

import (
	"net/http"

	"go-blog/internal/database"
	"go-blog/internal/models"
	"go-blog/pkg/utils"

	"github.com/gin-gonic/gin"
)

// ChangePasswordRequest 修改密码请求
type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

// ChangePassword 修改密码
func ChangePassword(c *gin.Context) {
	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "请求参数错误")
		return
	}

	// 从JWT中获取用户ID
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "未登录")
		return
	}

	// 获取用户信息
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		utils.Error(c, http.StatusNotFound, "用户不存在")
		return
	}

	// 验证旧密码
	if !utils.CheckPassword(req.OldPassword, user.Password) {
		utils.Error(c, http.StatusBadRequest, "旧密码不正确")
		return
	}

	// 生成新密码哈希
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "密码加密失败")
		return
	}

	// 更新密码
	user.Password = hashedPassword
	if err := database.DB.Save(&user).Error; err != nil {
		utils.Error(c, http.StatusInternalServerError, "密码更新失败")
		return
	}

	utils.Success(c, gin.H{"message": "密码修改成功"})
}
