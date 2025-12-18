package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"unique;not null" json:"username"`
	Password  string         `json:"-"`    // Store hashed password
	Role      string         `json:"role"` // e.g. "admin", "user"
	IsBanned  bool           `json:"is_banned"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Stream struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	Title            string         `json:"title"`
	Description      string         `json:"description"`
	StreamKey        string         `gorm:"unique;not null" json:"stream_key"`
	PlaybackID       string         `json:"playback_id"`
	SportCategory    string         `json:"sport_category"`
	ThumbnailURL     string         `json:"thumbnail_url"`
	BannerURL        string         `json:"banner_url"`         // New: Stream specific banner
	PreMatchDetails  string         `json:"pre_match_details"`  // New: Info before match
	PostMatchDetails string         `json:"post_match_details"` // New: Info after match
	Language         string         `json:"language"`
	IsLive           bool           `json:"is_live"`
	IngestStatus     string         `json:"ingest_status"`
	ViewerCount      int            `json:"viewer_count"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}

type Event struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `json:"title"`
	Sport       string         `json:"sport"`
	League      string         `json:"league"`
	TeamHome    string         `json:"team_home"`
	TeamAway    string         `json:"team_away"`
	StartTime   time.Time      `json:"start_time"`
	Venue       string         `json:"venue"`
	Broadcaster string         `json:"broadcaster"`
	Thumbnail   string         `json:"thumbnail"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type HeroBanner struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	TitleAr    string    `json:"title_ar"`
	TitleEn    string    `json:"title_en"`
	SubtitleAr string    `json:"subtitle_ar"`
	SubtitleEn string    `json:"subtitle_en"`
	ImageURL   string    `json:"image_url"`
	IsActive   bool      `json:"is_active"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Post struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	ImageURL   string    `json:"image_url"`
	Category   string    `json:"category"` // e.g. "News", "Highlight"
	IsFeatured bool      `json:"is_featured"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
