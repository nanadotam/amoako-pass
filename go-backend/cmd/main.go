package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/nanadotam/amoako-pass/go-backend/api/handlers"
	"github.com/nanadotam/amoako-pass/go-backend/storage"
)

func main() {

	storage.ConnectDB() // Connect to DB

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			w.Header().Set("Content-Type", "text/html")
			fmt.Fprintf(w, `
<!DOCTYPE html>
<html>
<head>
    <title>Amoako Pass Backend</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: #181a20; 
            color: #f3f3f3;
        }
        .endpoint { 
            background: #23262f; 
            padding: 10px; 
            margin: 10px 0; 
            border-radius: 5px; 
            box-shadow: 0 1px 4px rgba(0,0,0,0.12);
        }
        .method { 
            color: #4fd1c5; 
            font-weight: bold; 
        }
        a { 
            color: #63b3ed; 
            text-decoration: underline; 
        }
        h1, h2 {
        body { font-family: Arial, sans-serif; margin: 40px; }
        .endpoint { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .method { color: #007acc; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Amoako Pass Backend API</h1>
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
	http.HandleFunc("/api/health", handlers.HealthCheck)
	http.HandleFunc("/api/register", handlers.Register)
	http.HandleFunc("/api/login", handlers.Login)
	http.HandleFunc("/api/vault", handlers.GetPasswords)

	log.Println("✅ Server running on http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
