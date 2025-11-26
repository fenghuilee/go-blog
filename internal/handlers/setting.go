package handlers

import (
	"net/http"

	"go-blog/internal/services"
	"go-blog/pkg/utils"

	"github.com/gin-gonic/gin"
)

// GetSettings 获取所有设置
func GetSettings(c *gin.Context) {
	settings, err := services.GetSettings()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "获取设置失败")
		return
	}

	utils.Success(c, settings)
}

// UpdateSettings 更新设置
func UpdateSettings(c *gin.Context) {
	var settingsMap map[string]string
	if err := c.ShouldBindJSON(&settingsMap); err != nil {
		utils.Error(c, http.StatusBadRequest, "请求参数错误")
		return
	}

	if err := services.UpdateSettings(settingsMap); err != nil {
		utils.Error(c, http.StatusInternalServerError, "更新设置失败: "+err.Error())
		return
	}

	utils.Success(c, gin.H{"message": "设置更新成功"})
}
