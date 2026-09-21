# AI Phishing Detection Platform — Backend

A secure, modular, production-ready backend API for an **AI Phishing Detection Platform** built with **Node.js**, **Express.js**, **Supabase Auth**, and **Supabase PostgreSQL**.

---

## 📌 Features

- **URL Security Scanner**: Analyzes suspicious URLs using 10 non-intrusive string heuristic checks (HTTP protocol, raw IP hostnames, lookalike brand impersonation, punycode, excessive subdomains/hyphens, high-entropy encoding, suspicious keywords, and URL length) without visiting or fetching the domain (SSRF prevention).
- **Email & Message Analyzer**: Scans email/SMS content for urgency signals, credential harvesting requests, financial scam phrases, subject anomalies, and extracts/analyzes links embedded within messages.
- **Deterministic Risk Scoring Engine**: Weighted score calculation (0–100) categorized into `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL` risk levels with human-readable security recommendations.
- **Threat Intelligence Overrides**: Optional integrations for **Google Safe Browsing** and **VirusTotal** with graceful fallback handling if APIs are disabled or unavailable.
- **Persistent Scan History**: Every successful scan is saved to Supabase PostgreSQL, ensuring scan reports remain available across logins, server restarts, and frontend reloads.
- **User Ownership & RLS Security**: Row Level Security (RLS) policies and backend validation ensure users can only view, fetch, and delete their own scan records.
- **Rate Limiting & Security Hardening**: Built-in rate limiters (`express-rate-limit`), Helmet security headers, CORS controls, and Zod input payload validation.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth
- **Validation**: Zod
- **Security Middleware**: Helmet, CORS, Express Rate Limit
- **Logging**: Pino & Pino-HTTP
- **Testing**: Vitest & Supertest

---

## 📂 Folder Structure

```
backend/
├── src/
│   ├── app.js                          # Express application configuration
│   ├── server.js                       # Server entrypoint and graceful shutdown
│   │
│   ├── config/
│   │   ├── env.js                      # Environment variable loader & Zod schema validation
│   │   ├── supabase.js                 # Supabase client instances (Admin & Anon)
│   │   └── securityApis.js             # Google Safe Browsing & VirusTotal configs
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # Supabase JWT token verification
│   │   ├── errorMiddleware.js          # Centralized error handler & 404 fallback
│   │   ├── rateLimitMiddleware.js      # Rate limiters per endpoint
│   │   └── validateMiddleware.js       # Zod request validator middleware
│   │
│   ├── routes/
│   │   ├── healthRoutes.js             # GET /api/health
│   │   ├── scanRoutes.js               # POST /api/scans/url, /email, /message
│   │   └── historyRoutes.js            # GET /api/scans, GET /api/scans/:id, DELETE /api/scans/:id
│   │
│   ├── controllers/
│   │   ├── scanController.js           # Handlers for URL, email, and message scans
│   │   └── historyController.js        # Handlers for listing, fetching, and deleting history
│   │
│   ├── services/
│   │   ├── scanService.js              # Scan flow orchestrator (local + external + DB save)
│   │   ├── urlAnalysisService.js       # 10 Heuristic URL security checks
│   │   ├── emailAnalysisService.js     # Text, urgency, credential & link extractor analyzer
│   │   ├── riskScoringService.js       # Deterministic weighted risk score calculator
│   │   ├── googleSafeBrowsingService.js# Google Safe Browsing API client
│   │   ├── virusTotalService.js        # VirusTotal v3 URL API client
│   │   └── historyService.js           # Supabase database operations
│   │
│   ├── validators/
│   │   ├── scanValidators.js           # Zod schemas for scan requests
│   │   └── historyValidators.js        # Zod schemas for pagination and UUID params
│   │
│   ├── utils/
│   │   ├── urlUtils.js                 # Safe URL parser, normalizer & lookalike heuristics
│   │   ├── textUtils.js                # Keyword matching, link extraction, safe preview
│   │   ├── logger.js                   # Pino logger with redaction
│   │   └── responseUtils.js            # Standardized API response formatters
│   │
│   └── constants/
│       ├── riskConstants.js            # Risk weights, levels, and statuses
│       └── keywordConstants.js         # Security keywords, urgency phrases, financial scam lists
│
├── supabase/
│   └── migrations/
│       └── 001_create_scan_tables.sql  # Database schema, RLS policies, and indexes
│
├── tests/
│   ├── urlAnalysis.test.js             # URL engine unit tests
│   ├── emailAnalysis.test.js           # Email & message engine unit tests
│   ├── riskScoring.test.js             # Risk scoring & threat override unit tests
│   └── scanApi.test.js                 # Supertest API integration tests
│
├── .env.example                        # Template for environment variables
├── .gitignore                          # Excluded files
├── package.json                        # Dependencies and npm scripts
└── README.md                           # Documentation
```

---

## ⚡ Installation & Setup

### 1. Prerequisites
- Node.js v18.0.0 or higher
- A Supabase account and project (free tier works)

### 2. Clone and Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials in `.env`:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional integrations
GOOGLE_SAFE_BROWSING_API_KEY=
GOOGLE_SAFE_BROWSING_ENABLED=false

VIRUSTOTAL_API_KEY=
VIRUSTOTAL_ENABLED=false

CORS_ORIGIN=http://localhost:5173
```

---

## 🗄️ Database Setup (Supabase)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and navigate to the **SQL Editor**.
3. Copy the contents of [`supabase/migrations/001_create_scan_tables.sql`](file:///c:/Users/Krish/OneDrive/Desktop/hack%20dect/backend/supabase/migrations/001_create_scan_tables.sql).
4. Paste the SQL query into the SQL Editor and click **Run**.
5. This creates the `public.scans` table, indexes, and configures Row Level Security (RLS) policies.

---

## 🚀 Running the Application

### Development Mode (with Nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 🧪 Testing

Run the automated test suite using **Vitest**:

```bash
# Run all unit and integration tests once
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📡 API Documentation & Example Requests

All protected endpoints require a Supabase Access Token passed in the `Authorization` header:
`Authorization: Bearer <SUPABASE_ACCESS_TOKEN>`

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Authentication**: None

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/health
```

**Response**:
```json
{
  "success": true,
  "message": "Phishing detection backend is running"
}
```

---

### 2. Scan URL
- **Endpoint**: `POST /api/scans/url`
- **Authentication**: Required

**Request Body**:
```json
{
  "url": "https://paypa1-security-verify-account.com/login"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/scans/url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN" \
  -d '{"url": "https://paypa1-security-verify-account.com/login"}'
```

**Response**:
```json
{
  "success": true,
  "message": "URL scan completed and saved successfully.",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "user-uuid",
    "scan_type": "url",
    "target": "https://paypa1-security-verify-account.com/login",
    "normalized_target": "https://paypa1-security-verify-account.com/login",
    "risk_score": 60,
    "risk_level": "HIGH",
    "status": "suspicious",
    "findings": [
      {
        "code": "LOOKALIKE_DOMAIN",
        "severity": "high",
        "message": "Domain uses character substitution (e.g. 0/1/rn) to impersonate 'paypal'."
      },
      {
        "code": "SUSPICIOUS_KEYWORDS",
        "severity": "medium",
        "message": "The URL contains suspicious security or authentication keywords: login, verify, security"
      }
    ],
    "recommendation": "WARNING: Multiple suspicious indicators detected. Exercise extreme caution and verify the source before proceeding.",
    "created_at": "2026-09-20T11:00:00.000Z"
  }
}
```

---

### 3. Scan Email Content
- **Endpoint**: `POST /api/scans/email`
- **Authentication**: Required

**Request Body**:
```json
{
  "subject": "URGENT: Account Suspension Notice",
  "content": "Your account will be suspended within 24 hours. Please enter password immediately at http://192.168.1.100/login to verify.",
  "sender": "security@alert-system.com"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/scans/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN" \
  -d '{
    "subject": "URGENT: Account Suspension Notice",
    "content": "Your account will be suspended within 24 hours. Please enter password immediately at http://192.168.1.100/login to verify.",
    "sender": "security@alert-system.com"
  }'
```

---

### 4. Scan SMS / Message Content
- **Endpoint**: `POST /api/scans/message`
- **Authentication**: Required

**Request Body**:
```json
{
  "content": "Congratulations! You won a $1,000 gift card prize. Claim instant payout immediately at http://free-reward-claim.com"
}
```

---

### 5. Get User Scan History
- **Endpoint**: `GET /api/scans`
- **Query Parameters**: `page`, `limit`, `type`, `risk_level`, `status`, `search`
- **Authentication**: Required

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/scans?page=1&limit=10&type=url" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "scan_type": "url",
      "target": "https://example.com",
      "risk_score": 10,
      "risk_level": "LOW",
      "status": "safe",
      "created_at": "2026-09-20T11:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 1,
    "currentPage": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 6. Get Single Scan Report
- **Endpoint**: `GET /api/scans/:id`
- **Authentication**: Required

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/scans/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"
```

---

### 7. Delete Scan Record
- **Endpoint**: `DELETE /api/scans/:id`
- **Authentication**: Required

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/scans/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"
```

---

## 🔒 Security Considerations

1. **SSRF Prevention**: The backend analyzes URLs strictly as strings using syntax and heuristic pattern matching. It **never** fetches, crawls, or visits user-supplied URLs.
2. **Privacy Compliance**: Email and message bodies are stripped and converted into safe previews before storage. Raw email bodies are not stored in plain text.
3. **No Credential Exposure**: Service role keys are kept on the backend, environment variables are loaded via Zod, and sensitive fields (tokens, passwords) are redacted from logs using Pino.
4. **Row Level Security (RLS)**: PostgreSQL tables strictly isolate user data based on Supabase `auth.uid()`.

---

## 📋 Known Limitations & Future Improvements

- **SPF/DKIM Header Verification**: Email sender validation currently inspects email address formatting and Reply-To domain consistency. Full cryptographic header analysis requires raw MIME headers.
- **Machine Learning Extensions**: The current engine uses deterministic rule-based weights. Future updates can incorporate transformer models (e.g. BERT/DeBERTa) for deep semantic embedding classification.
