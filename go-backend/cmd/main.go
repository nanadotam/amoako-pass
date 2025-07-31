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

	http.HandleFunc("/api/health", handlers.HealthCheck)
	http.HandleFunc("/api/register", handlers.Register)
	http.HandleFunc("/api/login", handlers.Login)

	log.Println("✅ Server running on http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}