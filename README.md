# LinkinAI - Ultimate LinkedIn Personal Branding Assistant

LinkinAI is a full-stack web application designed for university students and professionals to automate and optimize their LinkedIn branding. It leverages Gemini AI to generate high-converting headlines, bios, project summaries, and cold outreach drafts, alongside an OpenCV-powered background removal and template compositing suite for professional Profile Pictures (PFP).

## 🚀 Key Features

* **PFP Editor:** Automatically removes backgrounds from portrait photos (using `rembg` U²-Net or GrabCut fallback) and composites them onto high-quality professional templates with live client-side scale and drag repositioning.
* **Branding Copywriter Suite:** Generates AI-optimized headlines, bios, and project summaries tailored to specific target audiences (Recruiters, Investors, Technical Peers, etc.).
* **Outreach Draft Creator:** Tailors cold outreach emails, InMails, and connection notes for recruiters or alumni based on your profile context and chosen tone.
* **State Preservation Navigation:** Fully preserves input fields, generated outputs, and photo editing progress when navigating between tabs.
* **Stateless & Production-Ready:** Backend keys are fully secured via environment variables and local environment config files are automatically git-ignored.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React, Vite, Vanilla CSS.
* **Backend:** Spring Boot (v4.0.6), Spring AI, Google GenAI Java SDK, OpenCV (v4.9.0).

---

## 💻 Local Quick Start

Clone this repository and open the workspace.

### 1. Run the Backend (Spring Boot)
Ensure you have Java 17+ installed.

1. Navigate to the backend directory:
   ```bash
   cd LinkinAI
   ```
2. Configure your environment variable (replace with your actual Gemini API key):
   * **PowerShell:**
     ```powershell
     Remove-Item env:GOOGLE_API_KEY
     $env:GEMINI_API_KEY="AIzaSy..."
     ./mvnw spring-boot:run
     ```
   * **Command Prompt (CMD):**
     ```cmd
     set GEMINI_API_KEY=AIzaSy...
     mvnw spring-boot:run
     ```
   * **Linux/macOS Bash:**
     ```bash
     export GEMINI_API_KEY="AIzaSy..."
     ./mvnw spring-boot:run
     ```

The backend starts on `http://localhost:8080`. You can confirm it's online by opening `http://localhost:8080/api/v1/linkin/ping` (should return `"pong"`).

### 2. Run the Frontend (React/Vite)
Ensure you have Node.js (v18+) installed.

1. Navigate to the frontend directory:
   ```bash
   cd linkin-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in your browser. Requests to `/api/...` and `/background/...` are automatically proxied to the backend on port `8080`.
