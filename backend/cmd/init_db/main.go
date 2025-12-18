package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "user=postgres password=postgres dbname=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE DATABASE streamcast")
	if err != nil {
		fmt.Println("Error creating db (might already exist):", err)
	} else {
		fmt.Println("Database 'streamcast' created successfully")
	}
}
