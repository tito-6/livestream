package handlers

import (
	"net/http"
	"streamcast-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetStats(c *gin.Context) {
	// In the future, this will query the RTMP server for real stats
	// For now, we return the DB state
	var liveStreams int64
	var totalStreams int64

	models.DB.Model(&models.Stream{}).Where("is_live = ?", true).Count(&liveStreams)
	models.DB.Model(&models.Stream{}).Count(&totalStreams)

	c.JSON(http.StatusOK, gin.H{
		"viewers":       0, // Real implementation would sum viewers from active streams
		"live_streams":  liveStreams,
		"total_streams": totalStreams,
		"cpu_usage":     "5%",
		"bitrate":       "0 kbps",
		"ingest_status": "online", // The Go server is running
	})
}
