package services

import (
	"errors"
	"go-blog/internal/database"
	"go-blog/internal/models"
)

// GetSettings 获取所有设置
func GetSettings() (map[string]string, error) {
	var settings []models.Setting
	if err := database.DB.Find(&settings).Error; err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, setting := range settings {
		result[setting.Key] = setting.Value
	}

	return result, nil
}

// GetSettingByKey 获取单个设置
func GetSettingByKey(key string) (string, error) {
	var setting models.Setting
	if err := database.DB.Where("`key` = ?", key).First(&setting).Error; err != nil {
		return "", err
	}
	return setting.Value, nil
}

// UpdateSettings 批量更新设置
func UpdateSettings(settingsMap map[string]string) error {
	if len(settingsMap) == 0 {
		return errors.New("设置数据不能为空")
	}

	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	for key, value := range settingsMap {
		var setting models.Setting
		result := tx.Where("`key` = ?", key).First(&setting)

		if result.Error != nil {
			// 设置不存在，创建新记录
			newSetting := models.Setting{
				Key:   key,
				Value: value,
			}
			if err := tx.Create(&newSetting).Error; err != nil {
				tx.Rollback()
				return err
			}
		} else {
			// 设置已存在，更新值
			setting.Value = value
			if err := tx.Save(&setting).Error; err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	return tx.Commit().Error
}
