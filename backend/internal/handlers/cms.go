package handlers

import (
	"net/http"
	"streamcast-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// -- USERS --

func GetUsers(c *gin.Context) {
	var users []models.User
	models.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

func ToggleBanUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := models.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	user.IsBanned = !user.IsBanned
	models.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"data": user})
}

// -- CONTENT (BANNERS) --

func GetBanners(c *gin.Context) {
	var banners []models.HeroBanner
	models.DB.Find(&banners)
	c.JSON(http.StatusOK, gin.H{"data": banners})
}

func GetActiveBanner(c *gin.Context) {
	var banner models.HeroBanner
	// Find the most recent active banner
	if err := models.DB.Where("is_active = ?", true).Last(&banner).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active banner"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": banner})
}

func UpdateBanner(c *gin.Context) {
	var input models.HeroBanner
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If setting to active, deactivate others (optional simple logic)
	if input.IsActive {
		models.DB.Model(&models.HeroBanner{}).Where("1 = 1").Update("is_active", false)
	}

	if input.ID == 0 {
		models.DB.Create(&input)
	} else {
		models.DB.Save(&input)
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// -- EVENTS --

func GetEvents(c *gin.Context) {
	var events []models.Event
	// Order by start time
	models.DB.Order("start_time asc").Find(&events)
	c.JSON(http.StatusOK, gin.H{"data": events})
}

func CreateEvent(c *gin.Context) {
	var input models.Event
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var event models.Event
	if err := models.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	var input models.Event
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	models.DB.Model(&event).Updates(input)

	c.JSON(http.StatusOK, gin.H{"data": event})
}

func DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	models.DB.Delete(&models.Event{}, id)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
