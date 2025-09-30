package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// User represents the structure of a user record in the database.
type User struct {
	ID        string
	GoogleID  string
	Email     string
	Name      string
	CreatedAt time.Time
}

// DB is the package-level variable to hold the database connection pool.
var DB *sql.DB

// ConnectDB establishes the connection to the PostgreSQL database.
func ConnectDB() *sql.DB {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL environment variable is not set.")
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	// Ping the database to verify the connection
	if err = db.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	log.Println("✅ Successfully connected to PostgreSQL!")
	DB = db
	return db
}

// UpsertUser simulates finding a user by GoogleID and updating or creating them.
// NOTE: This is a stub. Real implementation requires proper SQL queries and error handling.
func UpsertUser(user *User) (string, error) {
	// ⚠️ STUB IMPLEMENTATION - In a real app, this would execute SQL:
	// 1. Check if user.GoogleID exists.
	// 2. If yes, update Name and Email.
	// 3. If no, insert new user record.
	// 4. Return the database-generated user ID.
	
	log.Printf("👤 STUB: Attempting to Upsert user: %s, Email: %s, GoogleID: %s", user.Name, user.Email, user.GoogleID)
	
	// Mock a unique ID for the JWT.
	// In reality, this would be the ID from the database.
	mockUserID := "user_" + user.GoogleID 

	log.Printf("✅ STUB: User %s upserted/retrieved with mock ID: %s", user.Email, mockUserID)
	return mockUserID, nil
}

// SetupDB creates the necessary tables (STUB - actual migration tool should be used).
func SetupDB() {
	// ⚠️ STUB IMPLEMENTATION - Only for demonstration/local development convenience.
	// A proper app would use a migration tool (e.g., Goose, Migrate).
	
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		google_id VARCHAR(255) UNIQUE NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		name VARCHAR(255),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("❌ Error setting up user table: %v", err)
	}
	log.Println("✅ User table ensured (or created).")
}
