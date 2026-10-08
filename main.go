package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
)

//go:embed dist
var distFS embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	distSub, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Fatalf("Failed to locate dist directory: %v", err)
	}

	http.Handle("/", http.FileServer(http.FS(distSub)))

	log.Printf("Server listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
