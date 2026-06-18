#!/bin/bash
# Startup script for Hugging Face Spaces
# Runs both the FastAPI Python background removal daemon and Spring Boot

echo "=== Starting LinkinAI Services ==="

# Step 1: Start the FastAPI / Uvicorn Python daemon in the background.
# This loads the U2Net model into RAM once and keeps it warm.
# Spring Boot will send HTTP requests to this on localhost:8000.
echo "[1/2] Starting Python rembg daemon on port 8000..."
uvicorn app:app --host 127.0.0.1 --port 8000 &
PYTHON_PID=$!

# Give Python a moment to load the U2Net model before Spring Boot starts
sleep 5
echo "      Python daemon started (PID: $PYTHON_PID)"

# Step 2: Start Spring Boot as the main foreground process.
# Hugging Face routes external traffic to port 7860.
echo "[2/2] Starting Spring Boot on port 7860..."
java -jar app.jar
