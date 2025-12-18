package handlers

import (
	"net/http"
	"streamcast-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetPosts(c *gin.Context) {
	var posts []models.Post
	models.DB.Order("created_at desc").Find(&posts)
	c.JSON(http.StatusOK, gin.H{"data": posts})
}

func CreatePost(c *gin.Context) {
	var input models.Post
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post
	if err := models.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	var input models.Post
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Model(&post).Updates(input)
	c.JSON(http.StatusOK, gin.H{"data": post})
}

func DeletePost(c *gin.Context) {
	id := c.Param("id")
	models.DB.Delete(&models.Post{}, id)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
