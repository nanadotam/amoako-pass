package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	// "github.com/nanadotam/amoako-pass/go-backend/models"
	"github.com/nanadotam/amoako-pass/go-backend/services"
	"github.com/nanadotam/amoako-pass/go-backend/storage"
)

type AuthRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	json.NewDecoder(r.Body).Decode(&req)

	hash, _ := services.HashPassword(req.Password)
	_, err := storage.DB.Exec(`INSERT INTO users (email, username, password_hash, created_at)
		VALUES ($1, $2, $3, $4)`, req.Email, req.Username, hash, time.Now())
	if err != nil {
		http.Error(w, "Registration failed", 500)
		return
	}
	w.Write([]byte("✅ Registered"))
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	json.NewDecoder(r.Body).Decode(&req)

	row := storage.DB.QueryRow(`SELECT id, password_hash FROM users WHERE email = $1`, req.Email)
	var id string
	var hash string
	err := row.Scan(&id, &hash)
	if err != nil || !services.CheckPasswordHash(req.Password, hash) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	token, _ := services.GenerateToken(id)
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
