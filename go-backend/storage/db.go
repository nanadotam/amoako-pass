package storage

import (
	"database/sql"
	// "fmt"
	"log"
	"os"

	// "github.com/nanadotam/amoako-pass/env"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() {
	connStr := os.Getenv("DB_URL")
	var err error

	DB, err = sql.Open("postgres", connStr)

	if err != nil {
		log.Fatal("DB connection failed: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("DB Unreachable: ", err)
	}

	log.Println("✅ Supabase DB connected successfully")

}
