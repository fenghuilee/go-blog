package models

import (
	"time"
)

// Article 文章模型
type Article struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	Title      string     `gorm:"size:255;not null" json:"title"`
	Content    string     `gorm:"type:text;not null" json:"content"`
	Summary    string     `gorm:"size:500" json:"summary"`
	AuthorID   uint       `gorm:"not null;index" json:"author_id"`
	Author     User       `gorm:"foreignKey:AuthorID" json:"author"`
	Categories []Category `gorm:"many2many:article_categories;" json:"categories"` // 改为多对多
	Tags       []Tag      `gorm:"many2many:article_tags;" json:"tags"`
	Status     string     `gorm:"size:20;default:draft" json:"status"` // draft, published
	ViewCount  int        `gorm:"default:0" json:"view_count"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

// TableName 指定表名
func (Article) TableName() string {
	return "articles"
}
