# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY linkin-frontend/package*.json ./
RUN npm ci
COPY linkin-frontend/ ./
RUN npm run build

# Stage 2: Build the Java JAR with static frontend resources embedded
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and source code from the LinkinAI subdirectory
COPY LinkinAI/pom.xml .
COPY LinkinAI/src ./src

# Copy build output from frontend-build step directly into Spring Boot's static resources directory
COPY --from=frontend-build /frontend/dist/ ./src/main/resources/static/

# Build the jar skipping tests to save build time
RUN mvn clean package -DskipTests

# Stage 3: Create runtime environment with JRE + Python + rembg + FastAPI
FROM python:3.10-slim-bookworm

# Install OpenJDK 17 JRE and native graphic libraries required by OpenCV
RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install rembg (CPU version) + FastAPI + Uvicorn for the background removal daemon
RUN pip install --no-cache-dir rembg[cpu] fastapi uvicorn pillow

# Set up a non-root user (Hugging Face runs as UID 1000)
RUN useradd -m -u 1000 user
ENV HOME=/home/user
WORKDIR /home/user/app

# Pre-download the rembg u2net model weights into the image during build.
# This makes container start-up instant and avoids runtime network downloads on HF.
RUN mkdir -p /home/user/.u2net && \
    python -c "from rembg import new_session; new_session('u2net'); print('U2Net model cached successfully')" && \
    chown -R 1000:0 /home/user

# Copy the compiled Spring Boot jar from Stage 2
COPY --from=build --chown=1000:0 /app/target/LinkinAI-0.0.1-SNAPSHOT.jar app.jar

# Copy the FastAPI background removal Python server
COPY --chown=1000:0 app.py app.py

# Copy the startup script that launches both services
COPY --chown=1000:0 start.sh start.sh
RUN chmod +x start.sh

# Configure permissions for Hugging Face
USER 1000

# Hugging Face Spaces dynamically routes external traffic to port 7860
EXPOSE 7860
ENV PORT=7860

# Run both the Python daemon and Spring Boot via the startup script
ENTRYPOINT ["./start.sh"]
