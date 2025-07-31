package main

import (
	"fmt"
	"net/http"

	"github.com/nanadotam/amoako-pass/api/handlers"
	"github.com/nanadotam/amoako-pass/storage"
)

func main() {
	// fmt.Println("Hello, World!")

	storage.InitDB() // Connect to DB

	http.HandleFunc("/api/health", handlers.HealthCheck)
	http.HandleFunc("/api/register", handlers.Register)
	http.HandleFunc("/api/login", handlers.Login)

	log.Println("✅ Server running on http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}