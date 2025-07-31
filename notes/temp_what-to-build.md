Looking at your PRD, System Design, and schema, I can see you're building a password manager with a Go backend. Let me guide you through the first steps to build your backend systematically.

Read file: go-backend/go.mod
Ran tool
Ran tool
Perfect! Based on your requirements and current setup, here's the systematic approach to build your Go backend:

## 🎯 **First Priority: Authentication System**

Since this is a password manager, security is paramount. Start with the authentication system as it's the foundation for everything else.

### **Step 1: Complete the User Model**

Read file: go-backend/models/user.go
Let's enhance the User model to match your schema:

Ran tool
Let me create the enhanced user model:

Read file: go-backend/models/user.go
I'll guide you through the files you need to create and modify. Let me show you the structure:

## 📁 **File Structure to Build**

### **1. Enhanced Models (Start Here)**

**`go-backend/models/user.go`** - Replace with:
```go
package models

import (
	"time"
	"github.com/google/uuid"
)

type User struct {
	ID                uuid.UUID `json:"id" db:"id"`
	Email             string    `json:"email" db:"email"`
	Username          string    `json:"username" db:"username"`
	PasswordHash      string    `json:"-" db:"password_hash"`
	MasterKeyHash     string    `json:"-" db:"master_key_hash"`
	Salt              string    `json:"-" db:"salt"`
	TwoFactorEnabled  bool      `json:"two_factor_enabled" db:"two_factor_enabled"`
	TwoFactorSecret   *string   `json:"-" db:"two_factor_secret"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
	LastLogin         *time.Time `json:"last_login" db:"last_login"`
	IsActive          bool      `json:"is_active" db:"is_active"`
	EmailVerified     bool      `json:"email_verified" db:"email_verified"`
	VerificationToken *string   `json:"-" db:"verification_token"`
	ResetToken        *string   `json:"-" db:"reset_token"`
	ResetTokenExpires *time.Time `json:"-" db:"reset_token_expires"`
}

type UserRegistration struct {
	Email     string `json:"email" validate:"required,email"`
	Username  string `json:"username" validate:"required,min=3,max=100"`
	Password  string `json:"password" validate:"required,min=8"`
	MasterKey string `json:"master_key" validate:"required,min=8"`
}

type UserLogin struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
	User         User   `json:"user"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
```

**`go-backend/models/password.go`** - Create this file:
```go
package models

import (
	"time"
	"github.com/google/uuid"
)

type Password struct {
	ID                uuid.UUID  `json:"id" db:"id"`
	UserID            uuid.UUID  `json:"user_id" db:"user_id"`
	CategoryID        *uuid.UUID `json:"category_id" db:"category_id"`
	Website           string     `json:"website" db:"website"`
	Username          *string    `json:"username" db:"username"`
	Email             *string    `json:"email" db:"email"`
	PasswordEncrypted string     `json:"-" db:"password_encrypted"`
	NotesEncrypted    *string    `json:"-" db:"notes_encrypted"`
	FaviconURL        *string    `json:"favicon_url" db:"favicon_url"`
	URL               *string    `json:"url" db:"url"`
	IsFavorite        bool       `json:"is_favorite" db:"is_favorite"`
	PasswordStrength  int        `json:"password_strength" db:"password_strength"`
	LastPasswordChange *time.Time `json:"last_password_change" db:"last_password_change"`
	PasswordHistory   []string   `json:"-" db:"password_history"`
	Tags              []string   `json:"tags" db:"tags"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at" db:"updated_at"`
	AccessedAt        time.Time  `json:"accessed_at" db:"accessed_at"`
	AccessCount       int        `json:"access_count" db:"access_count"`
}

type PasswordCreate struct {
	Website  string  `json:"website" validate:"required"`
	Username *string `json:"username"`
	Email    *string `json:"email"`
	Password string  `json:"password" validate:"required"`
	Notes    *string `json:"notes"`
	CategoryID *uuid.UUID `json:"category_id"`
	Tags     []string `json:"tags"`
}
```

### **2. Enhanced Services**

**`go-backend/services/auth.go`** - Create this file:
```go
package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"github.com/nanadotam/amoako-pass/go-backend/models"
	"github.com/nanadotam/amoako-pass/go-backend/storage"
)

type AuthService struct{}

func NewAuthService() *AuthService {
	return &AuthService{}
}

func (s *AuthService) Register(userData models.UserRegistration) (*models.AuthResponse, error) {
	// Check if user already exists
	var existingUser models.User
	err := storage.DB.QueryRow("SELECT id FROM users WHERE email = $1 OR username = $2", 
		userData.Email, userData.Username).Scan(&existingUser.ID)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	// Generate salt and hash passwords
	salt := generateSalt()
	passwordHash, err := hashPassword(userData.Password, salt)
	if err != nil {
		return nil, err
	}

	masterKeyHash, err := hashPassword(userData.MasterKey, salt)
	if err != nil {
		return nil, err
	}

	// Create user
	user := models.User{
		ID:            uuid.New(),
		Email:         userData.Email,
		Username:      userData.Username,
		PasswordHash:  passwordHash,
		MasterKeyHash: masterKeyHash,
		Salt:          salt,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		IsActive:      true,
	}

	// Insert into database
	_, err = storage.DB.Exec(`
		INSERT INTO users (id, email, username, password_hash, master_key_hash, salt, created_at, updated_at, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`, user.ID, user.Email, user.Username, user.PasswordHash, user.MasterKeyHash, 
	   user.Salt, user.CreatedAt, user.UpdatedAt, user.IsActive)
	if err != nil {
		return nil, err
	}

	// Generate tokens
	accessToken, refreshToken, err := s.generateTokens(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) Login(loginData models.UserLogin) (*models.AuthResponse, error) {
	var user models.User
	err := storage.DB.QueryRow(`
		SELECT id, email, username, password_hash, salt, created_at, updated_at, is_active
		FROM users WHERE email = $1
	`, loginData.Email).Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash, 
		&user.Salt, &user.CreatedAt, &user.UpdatedAt, &user.IsActive)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Verify password
	if !verifyPassword(loginData.Password, user.PasswordHash, user.Salt) {
		return nil, errors.New("invalid credentials")
	}

	// Update last login
	now := time.Now()
	_, err = storage.DB.Exec("UPDATE users SET last_login = $1 WHERE id = $2", now, user.ID)
	if err != nil {
		return nil, err
	}

	// Generate tokens
	accessToken, refreshToken, err := s.generateTokens(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) generateTokens(userID uuid.UUID) (string, string, error) {
	// Access token (15 minutes)
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     time.Now().Add(15 * time.Minute).Unix(),
		"type":    "access",
	})

	// Refresh token (7 days)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
		"type":    "refresh",
	})

	// Sign tokens (you'll need to add JWT_SECRET to your .env)
	jwtSecret := "your-secret-key" // Replace with os.Getenv("JWT_SECRET")
	
	accessTokenString, err := accessToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", err
	}

	refreshTokenString, err := refreshToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}

func generateSalt() string {
	salt := make([]byte, 32)
	rand.Read(salt)
	return hex.EncodeToString(salt)
}

func hashPassword(password, salt string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password+salt), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func verifyPassword(password, hash, salt string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password+salt))
	return err == nil
}
```

### **3. Enhanced Handlers**

**`go-backend/api/handlers/auth.go`** - Replace with:
```go
package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/nanadotam/amoako-pass/go-backend/models"
	"github.com/nanadotam/amoako-pass/go-backend/services"
)

var authService = services.NewAuthService()

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var userData models.UserRegistration
	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := authService.Register(userData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var loginData models.UserLogin
	if err := json.NewDecoder(r.Body).Decode(&loginData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	response, err := authService.Login(loginData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
```

### **4. Update Dependencies**

**`go-backend/go.mod`** - Add these dependencies:
```go
module github.com/nanadotam/amoako-pass/go-backend

go 1.24.5

require (
	github.com/golang-jwt/jwt/v5 v5.3.0
	github.com/google/uuid v1.6.0
	github.com/lib/pq v1.10.9
	golang.org/x/crypto v0.40.0
)
```

### **5. Update Main File**

**`go-backend/cmd/main.go`** - Update to include new endpoints:
```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/nanadotam/amoako-pass/go-backend/api/handlers"
	"github.com/nanadotam/amoako-pass/go-backend/storage"
)

func main() {
	fmt.Println("Hello, World!")

	storage.ConnectDB() // Connect to DB

	// Root handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			w.Header().Set("Content-Type", "text/html")
			fmt.Fprintf(w, `
<!DOCTYPE html>
<html>
<head>
    <title>Amoako Pass Backend</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .endpoint { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .method { color: #007acc; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🚀 Amoako Pass Backend API</h1>
    <p>Your password manager backend is running successfully!</p>
    
    <h2>Available Endpoints:</h2>
    <div class="endpoint">
        <span class="method">GET</span> <a href="/api/health">/api/health</a> - Health check
    </div>
    <div class="endpoint">
        <span class="method">POST</span> /api/register - User registration
    </div>
    <div class="endpoint">
        <span class="method">POST</span> /api/login - User login
    </div>
    <div class="endpoint">
        <span class="method">GET</span> <a href="/api/vault">/api/vault</a> - Get passwords
    </div>
    
    <h2>Test the API:</h2>
    <p>Try clicking the links above or use curl:</p>
    <code>curl http://localhost:8000/api/health</code>
</body>
</html>
			`)
		} else {
			http.NotFound(w, r)
		}
	})

	// API endpoints
	http.HandleFunc("/api/health", handlers.HealthCheck)
	http.HandleFunc("/api/register", handlers.Register)
	http.HandleFunc("/api/login", handlers.Login)
	http.HandleFunc("/api/vault", handlers.GetPasswords)

	log.Println("✅ Server running on http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

## �� **Next Steps After This:**

1. **Run `go mod tidy`** to download new dependencies
2. **Test the registration endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "username": "testuser",
       "password": "password123",
       "master_key": "masterkey123"
     }'
   ```

3. **Test the login endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

This gives you a solid foundation with:
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ JWT token generation
- ✅ Database integration
- ✅ Proper error handling

After this works, we'll build the password management system next!