package handlers

import (
	"net/http"
	"streamcast-backend/internal/models"
	"streamcast-backend/internal/rtmp"

	"github.com/gin-gonic/gin"
)

func GetStreams(c *gin.Context) {
	var streams []models.Stream
	models.DB.Find(&streams)
	c.JSON(http.StatusOK, gin.H{"data": streams})
}

func CreateStream(c *gin.Context) {
	var input models.Stream
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	key, _ := rtmp.GenerateStreamKey()
	input.StreamKey = key
	input.IngestStatus = "offline"
	input.IsLive = false
	if input.Title == "" {
		input.Title = "Untitled Stream"
	}
	// For HLS, we might generate a PlaybackID based on the ID or random
	input.PlaybackID = "hls-" + key[:8]

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func UpdateStream(c *gin.Context) {
	id := c.Param("id")
	var stream models.Stream
	if err := models.DB.First(&stream, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Stream not found"})
		return
	}

	var input models.Stream
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Dynamic update of all allowed fields
	stream.Title = input.Title
	if input.Description != "" {
		stream.Description = input.Description
	}
	if input.SportCategory != "" {
		stream.SportCategory = input.SportCategory
	}
	if input.BannerURL != "" {
		stream.BannerURL = input.BannerURL
	}
	if input.ThumbnailURL != "" {
		stream.ThumbnailURL = input.ThumbnailURL
	}
	if input.PreMatchDetails != "" {
		stream.PreMatchDetails = input.PreMatchDetails
	}
	if input.PostMatchDetails != "" {
		stream.PostMatchDetails = input.PostMatchDetails
	}

	// Explicitly set IsLive as it's boolean
	stream.IsLive = input.IsLive

	models.DB.Save(&stream)
	c.JSON(http.StatusOK, gin.H{"data": stream})
}

func DeleteStream(c *gin.Context) {
	id := c.Param("id")
	models.DB.Delete(&models.Stream{}, id)
	c.JSON(http.StatusOK, gin.H{"data": true})
}

func GetStream(c *gin.Context) {
	id := c.Param("id")
	var stream models.Stream
	if err := models.DB.First(&stream, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Stream not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": stream})
}
