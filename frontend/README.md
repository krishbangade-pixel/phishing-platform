# PhishShield AI — AI Phishing Detection Platform (Frontend)

PhishShield AI is an enterprise-grade cybersecurity web application built with **React.js**, **Tailwind CSS**, **Supabase Auth**, and **Recharts**. It provides a real-time threat intelligence interface for scanning suspicious URLs, analyzing fake email payloads, and auditing smishing text messages.

---

## 🚀 Key Features

1. **Supabase Authentication**:
   - Registration with password strength, confirmation, and email validation.
   - Login, logout, and password recovery (`forgot-password` and `reset-password`).
   - Centralized `AuthContext` with session persistence across page refreshes.
   - Route protection for authenticated security analysts (`ProtectedRoute`).

2. **URL Threat Scanner (`/scan/url`)**:
   - Inspects web domain structures, typosquatting patterns, and SSL status.
   - Integrates with Google Safe Browsing and VirusTotal multi-engine APIs via the backend.
   - Prominently warns users against opening suspicious URLs.

3. **Email Phishing Analyzer (`/scan/email`)**:
   - Evaluates subject lines, envelope sender headers, panic lures, and reply-to traps.
   - Extracts payload links and assesses risk scores (0–100).
   - Strict privacy handling — email bodies are never stored in browser `localStorage`.

4. **SMS & Chat Message Scan (`/scan/message`)**:
   - Audits SMS smishing alerts, WhatsApp bait, and fake delivery notifications.

5. **Scan History & Audit Log (`/scans`)**:
   - Paginated history grid retrieved directly from Express backend + PostgreSQL database.
   - Search by target URL, subject, or domain name.
   - Filter by scan type (`url`, `email`, `message`), risk level (`Low`, `Medium`, `High`, `Critical`), or threat status (`Safe`, `Suspicious`, `Malicious`).
   - Accessible deletion confirmation modal (`DELETE /api/scans/:id`).

6. **Individual Threat Report (`/scans/:id`)**:
   - Detailed breakdown featuring an interactive circular risk index gauge.
   - Granular rule violation list with severity badges (`Low`, `Medium`, `High`, `Critical`).
   - Multi-engine security vendor breakdown and technical metadata inspector.
   - Clear advisory disclaimers confirming that scan indicators are guidance and do not guarantee 100% safety.

7. **Threat Analytics Dashboard (`/dashboard`)**:
   - Live aggregate telemetry metrics (Total scans, URL scans, Email scans, Message scans).
   - Dynamic Recharts threat distribution pie chart.
   - Quick launcher modules and recent scan cards.

---

## 💻 Technology Stack

- **Framework**: React.js (JavaScript, Vite)
- **Styling**: Tailwind CSS (Cybersecurity Dark Theme `#0b0f19`, Glowing Cyan Accents)
- **Routing**: React Router v6
- **Authentication**: Supabase JavaScript Client (`@supabase/supabase-js`)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS Radar Keyframes

---

## 🛠️ Environment Configuration

Create a `.env` file in the `frontend` root directory based on `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Express Backend Base API URL
VITE_API_BASE_URL=http://localhost:5000

# Standalone UI Testing Mock Fallback (Optional)
VITE_ENABLE_MOCK_FALLBACK=true
```

> **Security Note**: No secret API keys (such as Supabase Service Role Key or VirusTotal API Keys) are stored in the frontend environment.

---

## ⚡ Quick Start & Running Locally

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔗 Express Backend API Contract Integration

The central API service (`src/services/api.js`) automatically retrieves the active Supabase JWT session token and attaches it to all outgoing REST API requests:

```http
Authorization: Bearer <SUPABASE_JWT_ACCESS_TOKEN>
```

### Integrated Endpoints:
- `GET /api/health` — Backend health status check.
- `POST /api/scans/url` — Submit URL target for analysis.
- `POST /api/scans/email` — Submit email payload for analysis.
- `POST /api/scans/message` — Submit SMS / chat content for analysis.
- `GET /api/scans` — Retrieve paginated scan history.
- `GET /api/scans/:id` — Retrieve detailed individual report.
- `DELETE /api/scans/:id` — Permanently delete scan record.

---

## 🛡️ Standalone Mock / Fallback Mode

If the Express backend or Supabase service is not actively running during local development, the frontend automatically falls back to an interactive mock service layer when `VITE_ENABLE_MOCK_FALLBACK=true`. This allows complete UI testing, form validation checks, history searching, filtering, deletion modals, and report rendering without network errors.

---

## ⚠️ Security & Advisory Compliance

- **No Unsafe HTML**: All backend findings and user-submitted targets are rendered safely without `dangerouslySetInnerHTML`.
- **No Automatic Link Opening**: Submitted URLs are rendered as plain text to prevent accidental malware execution.
- **Non-Misleading Indicators**: "Safe" results are accurately labeled as *"No Known Threat"* to clarify that zero-day vectors cannot be 100% ruled out by automated tools.
