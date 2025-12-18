package models

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=streamcast port=5432 sslmode=disable"
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = database.AutoMigrate(&User{}, &Stream{}, &Event{}, &HeroBanner{}, &Post{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = database
	fmt.Println("Database connected successfully")
}
