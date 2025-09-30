package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"api-gateway/db" // Import the new database package

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

// --- Constants & Config ---
const adminAPIKey = "SUPER_SECURE_KEY"
const serviceName = "eSports-API-Gateway"

// JWT Claims struct
type UserClaims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// --- Helper Functions ---

// respondWithJSON is a helper to write JSON responses
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// generateJWT creates a JWT token for an authenticated user.
func generateJWT(userID string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET environment variable is not set")
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &UserClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    serviceName,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtSecret))

	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}
	log.Printf("🔑 Generated JWT for UserID: %s", userID)
	return tokenString, nil
}


// --- Middleware ---

// adminAuthMiddleware checks for a valid X-Admin-Key header.
func adminAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("X-Admin-Key")
		if key != adminAPIKey {
			respondWithJSON(w, http.StatusUnauthorized, map[string]string{"error": "Unauthorized: Invalid Admin Key"})
			return
		}
		next.ServeHTTP(w, r)
	})
}

// --- Core Handlers ---

// handleHealth returns the service status.
func handleHealth(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"status":    "UP",
		"service":   serviceName,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// --- Admin Stream Handlers (Stub) ---

func handleStartStream(w http.ResponseWriter, r *http.Request) {
	// In a real scenario, this would call the streaming-processor-svc
	respondWithJSON(w, http.StatusOK, map[string]string{
		"status":  "success",
		"message": "Stream start request received (STUB).",
	})
}

func handleStopStream(w http.ResponseWriter, r *http.Request) {
	// In a real scenario, this would call the streaming-processor-svc
	respondWithJSON(w, http.StatusOK, map[string]string{
		"status":  "success",
		"message": "Stream stop request received (STUB).",
	})
}

func handleListStreams(w http.ResponseWriter, r *http.Request) {
	// In a real scenario, this would query a database/cache for active streams
	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"status": "success",
		"streams": []map[string]string{
			{"id": "s-101", "name": "eSports Grand Final", "status": "LIVE"},
		},
	})
}

// --- OAuth Handlers (Stub) ---

func handleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	// ⚠️ STUB IMPLEMENTATION
	// In reality, this would redirect the user to Google's OAuth consent screen.
	log.Println("🌐 STUB: Redirecting user to Google OAuth endpoint...")
	respondWithJSON(w, http.StatusOK, map[string]string{
		"status":  "info",
		"message": "STUB: Redirecting to Google Login URL.",
		"url":     "/auth/google/callback?code=MOCK_AUTH_CODE",
	})
}

func handleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	// ⚠️ STUB IMPLEMENTATION
	// 1. Get code from query params: r.URL.Query().Get("code")
	// 2. Exchange code with Google for user info (email, google_id).
	// 3. Upsert user in DB.
	// 4. Generate JWT.
	
	if r.URL.Query().Get("code") == "" {
		respondWithJSON(w, http.StatusUnauthorized, map[string]string{"error": "Missing authorization code."})
		return
	}

	// --- MOCK Google User Info ---
	mockUser := &db.User{
		GoogleID: "10987654321",
		Email:    "viewer@mock.com",
		Name:     "Mock Viewer",
	}

	// 3. Upsert User
	userID, err := db.UpsertUser(mockUser)
	if err != nil {
		log.Printf("DB Error: %v", err)
		respondWithJSON(w, http.StatusInternalServerError, map[string]string{"error": "Failed to authenticate user."})
		return
	}

	// 4. Generate JWT
	tokenString, err := generateJWT(userID)
	if err != nil {
		log.Printf("JWT Error: %v", err)
		respondWithJSON(w, http.StatusInternalServerError, map[string]string{"error": "Failed to generate session token."})
		return
	}

	// Success response - token is sent back
	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "success",
		"message": "Authentication successful.",
		"token":   tokenString,
		"user_id": userID,
	})
}


// --- Main Function ---

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil && !strings.Contains(err.Error(), "no such file or directory") {
		log.Printf("Warning: Error loading .env file: %v", err)
	}

	// Connect to database and run setup
	db.ConnectDB()
	db.SetupDB()

	r := mux.NewRouter()

	// Public Routes (No Auth)
	r.HandleFunc("/health", handleHealth).Methods("GET")

	// OAuth Routes (No Auth)
	r.HandleFunc("/api/v1/auth/google/login", handleGoogleLogin).Methods("GET")
	r.HandleFunc("/api/v1/auth/google/callback", handleGoogleCallback).Methods("GET")

	// Admin Routes (Protected by Middleware)
	adminRouter := r.PathPrefix("/api/v1/streams").Subrouter()
	adminRouter.Use(adminAuthMiddleware)
	adminRouter.HandleFunc("/start", handleStartStream).Methods("POST")
	adminRouter.HandleFunc("/stop", handleStopStream).Methods("POST")
	adminRouter.HandleFunc("/list", handleListStreams).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}