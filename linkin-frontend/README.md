# LinkinAI - Frontend Application

This is the React-based frontend application for **LinkinAI**, a suite designed to help university students and professionals build their personal brand on LinkedIn. 

It is built with **React**, **Vite**, and **Vanilla CSS** for a clean, fast, and responsive user experience.

---

## 🚀 Key Features & Modules

The application is structured as a single-page app (SPA) with a multi-tab interface:

*   **👤 Photo Editor (PFP Editor):** Upload a portrait photo, automatically remove the background (powered by the backend's CV/rembg module), and composite it onto professional templates. Includes live client-side dragging, scaling, and rotation.
*   **✍️ Headline Generator:** Generates high-converting and professional LinkedIn headlines tailored to different audiences (Recruiters, Tech Leads, etc.).
*   **📝 Bio Generator:** Crafts engaging "About" sections or summaries for your LinkedIn profile.
*   **📂 Project Generator:** Summarizes your projects into clear, professional descriptions optimized for LinkedIn's project section.
*   **🔍 Job Finder:** Helps users discover or structure job searches.
*   **✉️ Outreach Generator:** Drafts tailored connection requests, InMails, or cold emails for networking.
*   **📄 Resume Analyzer:** Analyzes resume content and compares/aligns it with target jobs or profiles.

---

## 🛠️ Tech Stack & Structure

*   **Framework:** React (Vite-based template)
*   **Routing:** `react-router-dom`
*   **Styling:** Vanilla CSS (Glassmorphism, custom animations, custom cursor, responsive design)
*   **API Client:** Built-in connection to the LinkinAI backend

### Directory Structure

*   `src/components/` - Houses all functional modular views (`HeadlineGenerator`, `PhotoEditor`, `BioGenerator`, etc.) and shell components (`Sidebar`, `TopBar`, `CustomCursor`).
*   `src/App.jsx` - App entry point managing routing, shell layouts, and state preservation.
*   `src/apiConfig.js` - Configuration for API endpoints pointing to local development or deployed production backend.

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Endpoint (Optional)
If running a remote backend, configure the environment variable:
```bash
VITE_API_BASE_URL=https://your-backend-api-url.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment
This frontend is configured for deployment to **Vercel** via the root-level configuration.
*   The `vercel.json` ensures clean routing and API proxy settings.
*   Ensure to set `VITE_API_BASE_URL` on your hosting provider to point to your live Hugging Face or server backend.
