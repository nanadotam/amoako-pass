package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/nanadotam/amoako-pass/go-backend/storage"
)

type PasswordPreview struct {
	Website  string `json:"website"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func GetPasswords(w http.ResponseWriter, r *http.Request) {
	rows, err := storage.DB.Query(`
		SELECT website, username, email
		FROM passwords
		ORDER BY updated_at DESC
	`)
	if err != nil {
		http.Error(w, "Failed to fetch passwords", 500)
		return
	}
	defer rows.Close()

	var results []PasswordPreview
	for rows.Next() {
		var p PasswordPreview
		if err := rows.Scan(&p.Website, &p.Username, &p.Email); err != nil {
			continue
		}
		results = append(results, p)
	}

	json.NewEncoder(w).Encode(results)
}
