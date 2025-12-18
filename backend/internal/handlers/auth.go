package handlers

import (
	"net/http"
	"streamcast-backend/internal/models"

	"github.com/gin-gonic/gin"
)

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Verify password (in real app use bcrypt)
	if user.Password != input.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": "mock-jwt-token-" + user.Username})
}

func Seed(c *gin.Context) {
	// Create Admin User
	admin := models.User{Username: "admin", Password: "password", Role: "admin"}
	models.DB.FirstOrCreate(&admin, models.User{Username: "admin"})

	// Create Default Banner
	banner := models.HeroBanner{
		TitleEn:  "Welcome to StreamCast",
		TitleAr:  "مرحباً بكم",
		ImageURL: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
		IsActive: true,
	}
	models.DB.Create(&banner)

	c.JSON(http.StatusOK, gin.H{"message": "Seed successful"})
}
