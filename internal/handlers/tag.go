package handlers

import (
	"go-blog/internal/database"
	"go-blog/internal/models"
	"go-blog/pkg/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetTags 获取标签列表
func GetTags(c *gin.Context) {
	var tags []models.Tag
	if err := database.DB.Order("created_at DESC").Find(&tags).Error; err != nil {
		utils.InternalServerError(c, err.Error())
		return
	}

	utils.Success(c, tags)
}

// CreateTag 创建标签
func CreateTag(c *gin.Context) {
	var tag models.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	if err := database.DB.Create(&tag).Error; err != nil {
		utils.InternalServerError(c, "创建标签失败")
		return
	}

	utils.SuccessWithMessage(c, "标签创建成功", tag)
}

// DeleteTag 删除标签
func DeleteTag(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的标签ID")
		return
	}

	var tag models.Tag
	if err := database.DB.First(&tag, id).Error; err != nil {
		utils.Error(c, 404, "标签不存在")
		return
	}

	if err := database.DB.Delete(&tag).Error; err != nil {
		utils.InternalServerError(c, "删除标签失败")
		return
	}

	utils.SuccessWithMessage(c, "标签删除成功", nil)
}
