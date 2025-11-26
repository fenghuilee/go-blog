package handlers

import (
	"go-blog/internal/database"
	"go-blog/internal/models"
	"go-blog/pkg/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetCategories 获取分类列表
func GetCategories(c *gin.Context) {
	var categories []models.Category
	if err := database.DB.Order("created_at DESC").Find(&categories).Error; err != nil {
		utils.InternalServerError(c, err.Error())
		return
	}

	utils.Success(c, categories)
}

// CreateCategory 创建分类
func CreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	if err := database.DB.Create(&category).Error; err != nil {
		utils.InternalServerError(c, "创建分类失败")
		return
	}

	utils.SuccessWithMessage(c, "分类创建成功", category)
}

// UpdateCategory 更新分类
func UpdateCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的分类ID")
		return
	}

	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		utils.Error(c, 404, "分类不存在")
		return
	}

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "请求参数错误")
		return
	}

	category.Name = req.Name
	category.Description = req.Description

	if err := database.DB.Save(&category).Error; err != nil {
		utils.InternalServerError(c, "更新分类失败")
		return
	}

	utils.SuccessWithMessage(c, "分类更新成功", category)
}

// DeleteCategory 删除分类
func DeleteCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.BadRequest(c, "无效的分类ID")
		return
	}

	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		utils.Error(c, 404, "分类不存在")
		return
	}

	if err := database.DB.Delete(&category).Error; err != nil {
		utils.InternalServerError(c, "删除分类失败")
		return
	}

	utils.SuccessWithMessage(c, "分类删除成功", nil)
}
