# Fin-Analysis — Product Requirements Document (PRD)

> **Version:** 1.0 (MVP)  
> **Last Updated:** January 23, 2026  
> **Status:** Draft

---

## 1. Executive Summary

**Fin-Analysis** is a web-based financial analysis platform that detects anomalies in financial data using statistical forensic techniques, Benford's Law analysis, and AI-assisted insights. The platform enables users to upload financial documents, automatically analyze them for irregularities, and receive actionable risk assessments.

### Core Value Proposition
- **Automated Anomaly Detection** — Identify suspicious transactions without manual auditing
- **Benford's Law Analysis** — Industry-standard forensic technique for fraud detection  
- **AI-Powered Insights** — Gemini API provides natural language summaries and recommendations
- **Instant Risk Assessment** — Clear risk indicators (Low/Medium/High) for quick decision-making

---

## 2. Problem Statement

### The Challenge
Financial auditors and analysts spend countless hours manually reviewing transaction data to identify irregularities, fraud, or errors. This process is:
- **Time-consuming** — Manual review of thousands of transactions
- **Error-prone** — Human oversight can miss subtle patterns
- **Expensive** — Requires specialized forensic accounting expertise
- **Inconsistent** — Different auditors may apply different criteria

### The Solution
Fin-Analysis automates the detection of financial anomalies using proven statistical methods and AI, providing consistent, fast, and accurate analysis that highlights what auditors should investigate first.

---

## 3. Target Users

### Primary Users
| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| **Internal Auditors** | Company employees reviewing financial records | Quick anomaly detection, compliance checks |
| **Small Business Owners** | Non-experts monitoring their finances | Simple risk indicators, actionable insights |
| **Freelance Accountants** | Independent professionals serving multiple clients | Efficient batch analysis, clear reports |

### User Personas

**Persona 1: Sarah — Internal Auditor**
- Works at a mid-size company with 10,000+ transactions/month
- Needs to flag suspicious items before quarterly audits
- Values: Speed, accuracy, audit trail

**Persona 2: Raj — Small Business Owner**  
- Runs an e-commerce business
- Suspects vendor overcharging but lacks time to investigate
- Values: Simplicity, clear explanations, low cost

---

## 4. MVP Features & Scope

### 4.1 User Authentication (Firebase Auth)

| Feature | MVP Scope | Out of Scope |
|---------|-----------|--------------|
| Sign Up | Email + Password | Social login, SSO |
| Login | Email + Password | MFA, Passwordless |
| Session | Persistent login | Role-based access |
| Password Reset | Email-based | Phone verification |

**Technical Implementation:**
- Firebase Authentication (email/password provider)
- JWT tokens stored in browser
- Protected routes on frontend

---

### 4.2 File Upload & Parsing

| Feature | MVP Scope | Out of Scope |
|---------|-----------|--------------|
| File Types | CSV, Excel (.xlsx) | PDF, Bank API |
| File Size | Up to 10MB | Larger files |
| Storage | Firebase Storage (temp) | Permanent archive |
| Parsing | Auto-detect columns | Custom mapping UI |

**Required File Structure:**
```
| Date       | Description        | Amount    | Vendor/Payee    |
|------------|-------------------|-----------|-----------------|
| 2024-01-15 | Office Supplies   | 1,234.56  | ABC Corp        |
| 2024-01-16 | Consulting Fee    | 8,500.00  | XYZ Services    |
```

**Validation Rules:**
- ✅ Must contain at least one numeric column
- ✅ Maximum 50,000 rows
- ✅ UTF-8 encoding
- ❌ Reject files with no parseable data

---

### 4.3 Core Analysis Engine

#### 4.3.1 Statistical & Forensic Checks

| Check | Description | Detection Logic |
|-------|-------------|-----------------|
| **Outlier Detection** | Unusually large/small transactions | Z-score > 3 or < -3 |
| **Repeated Amounts** | Same exact amount appearing frequently | Count > threshold |
| **Vendor Concentration** | Single vendor receiving disproportionate payments | > 40% of total |
| **Round Number Bias** | Excessive round numbers (ends in 00, 000) | > Expected frequency |
| **Weekend/Holiday Transactions** | Unusual timing patterns | Outside business days |

#### 4.3.2 Benford's Law Analysis

Benford's Law states that in naturally occurring numerical datasets, the leading digit follows a specific distribution:

| Digit | Expected % |
|-------|-----------|
| 1 | 30.1% |
| 2 | 17.6% |
| 3 | 12.5% |
| 4 | 9.7% |
| 5 | 7.9% |
| 6 | 6.7% |
| 7 | 5.8% |
| 8 | 5.1% |
| 9 | 4.6% |

**Analysis Output:**
- **Benford Compliance Score** (0-100)
- **Deviation by Digit** — Which digits deviate most
- **Chi-Square Test Result** — Statistical significance
- **Risk Level** — Low / Medium / High

**Deviation Thresholds:**
| Risk Level | Chi-Square p-value | Description |
|------------|-------------------|-------------|
| 🟢 Low | p > 0.10 | Data follows Benford's Law |
| 🟡 Medium | 0.01 < p ≤ 0.10 | Minor deviations detected |
| 🔴 High | p ≤ 0.01 | Significant anomalies |

---

### 4.4 AI-Assisted Analysis (Gemini API)

**Purpose:** Convert numerical findings into human-readable insights

**Input to Gemini:**
```json
{
  "total_transactions": 2500,
  "flagged_transactions": 45,
  "benford_score": 72,
  "top_anomalies": [...],
  "vendor_concentration": {...}
}
```

**Output from Gemini:**
- **Executive Summary** — 2-3 sentence overview
- **Key Findings** — Bullet points of major issues
- **Recommended Actions** — What to investigate first
- **Risk Assessment** — Overall risk narrative

**Constraints:**
- Use Gemini API free tier
- No real-time streaming (batch response only)
- Max context: 8000 tokens

---

### 4.5 Results Dashboard

**Dashboard Sections:**

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 ANALYSIS RESULTS                                            │
│  [Modern card with glassmorphism effect]                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎯 RISK LEVEL: [Badge: LOW] [Badge: MEDIUM] [Badge: HIGH]    │
│  [Large, prominent badge with gradient background]             │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ BENFORD'S LAW       │  │ DETECTION SIGNALS   │              │
│  │ [Card with shadow]  │  │ [Card with shadow]  │              │
│  │ Score: 72/100       │  │ ⚠️ 3 Outliers        │              │
│  │ [Progress ring]     │  │ ⚠️ 2 Repeated Amts   │              │
│  │ Status: Medium Risk │  │ ✅ Vendor OK         │              │
│  │ [Chart Button]      │  │ [Animated icons]    │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  🔍 SUSPICIOUS TRANSACTIONS (Top 10)                           │
│  [shadcn/ui DataTable with hover effects]                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Date       │ Amount    │ Vendor     │ Flag Reason      │   │
│  │ 2024-03-15 │ $45,000   │ ABC Corp   │ Outlier (3.2σ)   │   │
│  │ 2024-02-20 │ $9,999    │ XYZ Ltd    │ Just under $10k  │   │
│  │ [Rows with hover:bg-slate-50 dark:hover:bg-slate-800]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🧠 AI INSIGHTS                                                 │
│  [Card with gradient border and glassmorphism]                 │
│  "Your data shows 3 significant outliers concentrated in       │
│   March. The vendor ABC Corp received 42% of payments,         │
│   which warrants investigation..."                             │
│  [Smooth fade-in animation]                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Architecture

### 5.1 Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | React (Vite) | Fast dev experience, component-based |
| **UI Components** | shadcn/ui | Accessible, customizable, modern components |
| **Styling** | Tailwind CSS | Utility-first, rapid development, consistent design |
| **Backend** | FastAPI (Python) | Async support, excellent for data processing |
| **Database** | Firebase Firestore | Real-time sync, easy auth integration |
| **Auth** | Firebase Auth | Managed auth, secure, scalable |
| **Storage** | Firebase Storage | File uploads, integrates with auth |
| **AI** | Gemini API | Google's LLM, free tier available |

### 5.2 System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Login     │  │   Upload    │  │  Dashboard  │  │   History   │     │
│  │   Page      │  │   Page      │  │    Page     │  │    Page     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          FIREBASE SERVICES                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  Firebase Auth  │  │ Firebase Storage │  │    Firestore    │          │
│  │  (User Auth)    │  │  (File Upload)   │  │  (Results DB)   │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (FastAPI)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                        API ENDPOINTS                                 │ │
│  │  POST /api/analyze    — Trigger analysis                            │ │
│  │  GET  /api/results/:id — Fetch analysis results                     │ │
│  │  GET  /api/history    — User's past analyses                        │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│  ┌─────────────────────────────────┴───────────────────────────────────┐ │
│  │                      ANALYSIS ENGINE                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │ │
│  │  │   Parser     │  │  Statistical │  │  Benford's   │              │ │
│  │  │   Module     │  │   Checks     │  │    Law       │              │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │ │
│  │                           │                                         │ │
│  │                           ▼                                         │ │
│  │                  ┌──────────────────┐                               │ │
│  │                  │   Gemini API     │                               │ │
│  │                  │   (AI Insights)  │                               │ │
│  │                  └──────────────────┘                               │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### 5.3 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/analyze` | Upload file & trigger analysis | ✅ Required |
| GET | `/api/results/{id}` | Get analysis results | ✅ Required |
| GET | `/api/history` | List user's past analyses | ✅ Required |
| DELETE | `/api/results/{id}` | Delete an analysis | ✅ Required |

#### POST `/api/analyze` — Request
```json
{
  "file_url": "gs://bucket/path/to/file.csv",
  "file_name": "Q1_Transactions.csv"
}
```

#### POST `/api/analyze` — Response
```json
{
  "analysis_id": "abc123",
  "status": "processing",
  "estimated_time_seconds": 30
}
```

#### GET `/api/results/{id}` — Response
```json
{
  "analysis_id": "abc123",
  "status": "completed",
  "file_name": "Q1_Transactions.csv",
  "created_at": "2024-01-23T10:30:00Z",
  "summary": {
    "total_transactions": 2500,
    "total_amount": 1250000.00,
    "flagged_count": 45,
    "risk_level": "MEDIUM"
  },
  "benford_analysis": {
    "score": 72,
    "risk_level": "MEDIUM",
    "digit_distribution": {...},
    "chi_square_p_value": 0.04
  },
  "detection_signals": [
    {
      "type": "OUTLIER",
      "count": 3,
      "severity": "HIGH"
    },
    {
      "type": "REPEATED_AMOUNT",
      "count": 2,
      "severity": "MEDIUM"
    }
  ],
  "suspicious_transactions": [
    {
      "row": 142,
      "date": "2024-03-15",
      "amount": 45000.00,
      "vendor": "ABC Corp",
      "flags": ["OUTLIER", "LARGE_ROUND_NUMBER"]
    }
  ],
  "ai_insights": {
    "summary": "Your data shows 3 significant outliers...",
    "key_findings": [...],
    "recommendations": [...]
  }
}
```

### 5.4 Data Models

#### Firestore Collections

**`users/{userId}`**
```json
{
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z",
  "analysis_count": 5
}
```

**`analyses/{analysisId}`**
```json
{
  "user_id": "uid123",
  "file_name": "transactions.csv",
  "file_url": "gs://...",
  "status": "completed",
  "created_at": "2024-01-23T10:30:00Z",
  "results": { ... }
}
```

---

## 6. User Flows

### 6.1 Main User Journey

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │ ──▶ │   Sign Up   │ ──▶ │   Upload    │ ──▶ │  Dashboard  │
│    Page     │     │   / Login   │     │    File     │     │  (Results)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  Processing │
                                        │  (Loading)  │
                                        └─────────────┘
```

### 6.2 Detailed Flow: Upload & Analyze

1. **User clicks "Upload File"**
2. **File picker opens** — User selects CSV/Excel
3. **Validation** — Frontend checks file type & size
4. **Upload to Firebase Storage** — Progress indicator shown
5. **Trigger Analysis** — POST to `/api/analyze`
6. **Processing Screen** — Show estimated time, progress steps
7. **Results Ready** — Redirect to Dashboard
8. **View Analysis** — Risk level, Benford, AI insights displayed

---

## 7. UI/UX Design Principles

### Design Philosophy

**Fin-Analysis** embraces a **premium, modern aesthetic** that combines functionality with visual excellence. The interface should feel sophisticated, trustworthy, and delightful to use.

### Core Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Modern & Sleek** | Glassmorphism effects, subtle shadows, smooth gradients |
| **Premium Feel** | High-quality typography (Inter/Geist), refined spacing, polished interactions |
| **Clarity** | Risk levels use intuitive color coding (🟢🟡🔴) with clear visual hierarchy |
| **Micro-interactions** | Smooth transitions, hover effects, loading animations |
| **Responsive** | Mobile-first design, works seamlessly on all devices |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard navigation, screen reader support |
| **Dark Mode Ready** | Support for dark theme using Tailwind's dark mode utilities |

### Design System

#### Typography
```
Primary Font: Inter (Google Fonts)
Fallback: system-ui, -apple-system, sans-serif

Headings: font-semibold to font-bold
Body: font-normal
Code/Numbers: font-mono
```

#### Color Palette (Tailwind CSS)

| Usage | Tailwind Class | Color | Hex |
|-------|---------------|-------|-----|
| **Primary** | `bg-blue-600` | Deep Blue | `#2563EB` |
| **Primary Hover** | `bg-blue-700` | Darker Blue | `#1D4ED8` |
| **Success / Low Risk** | `bg-green-500` | Green | `#22C55E` |
| **Warning / Medium Risk** | `bg-amber-500` | Amber | `#F59E0B` |
| **Danger / High Risk** | `bg-red-500` | Red | `#EF4444` |
| **Background** | `bg-slate-50` | Light Gray | `#F8FAFC` |
| **Card Background** | `bg-white` | White | `#FFFFFF` |
| **Border** | `border-slate-200` | Light Border | `#E2E8F0` |
| **Text Primary** | `text-slate-900` | Dark Gray | `#0F172A` |
| **Text Secondary** | `text-slate-600` | Medium Gray | `#475569` |
| **Accent** | `bg-violet-600` | Violet | `#7C3AED` |

#### Dark Mode Palette

| Usage | Tailwind Class | Color |
|-------|---------------|-------|
| **Background** | `dark:bg-slate-900` | `#0F172A` |
| **Card Background** | `dark:bg-slate-800` | `#1E293B` |
| **Border** | `dark:border-slate-700` | `#334155` |
| **Text Primary** | `dark:text-slate-100` | `#F1F5F9` |
| **Text Secondary** | `dark:text-slate-400` | `#94A3B8` |

### Component Library (shadcn/ui)

All UI components will use **shadcn/ui** for consistency and accessibility:

| Component | Usage | shadcn Component |
|-----------|-------|------------------|
| **Buttons** | Primary actions, CTAs | `Button` |
| **Cards** | Dashboard sections, results | `Card` |
| **Forms** | Login, file upload | `Input`, `Label`, `Form` |
| **Data Tables** | Transaction lists | `Table`, `DataTable` |
| **Badges** | Risk indicators, tags | `Badge` |
| **Alerts** | Error messages, warnings | `Alert` |
| **Progress** | File upload, analysis | `Progress` |
| **Dialogs** | Confirmations, details | `Dialog` |
| **Tabs** | Dashboard sections | `Tabs` |
| **Charts** | Benford's Law visualization | `Recharts` integration |
| **Tooltips** | Explanations, help text | `Tooltip` |
| **Skeleton** | Loading states | `Skeleton` |

### Visual Effects

#### Glassmorphism
```css
/* Applied to key cards and modals */
backdrop-blur-lg bg-white/80 dark:bg-slate-900/80
border border-white/20
shadow-xl
```

#### Smooth Animations
```css
/* All interactive elements */
transition-all duration-200 ease-in-out

/* Hover effects */
hover:scale-105 hover:shadow-lg

/* Loading states */
animate-pulse, animate-spin
```

#### Shadows
```
Small: shadow-sm
Medium: shadow-md
Large: shadow-lg
Extra Large: shadow-2xl
```

### Layout Patterns

#### Dashboard Grid
```
Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Spacing: space-y-6 (vertical), gap-4 (grid)
```

#### Card Design
```jsx
<Card className="backdrop-blur-lg bg-white/80 dark:bg-slate-800/80 
                 border border-slate-200 dark:border-slate-700 
                 shadow-lg hover:shadow-xl transition-all duration-200">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target |
|--------|--------|
| File Upload | < 10 seconds for 10MB |
| Analysis Time | < 60 seconds for 50k rows |
| Dashboard Load | < 2 seconds |
| API Response | < 500ms (non-analysis) |

### 8.2 Security

- ✅ All data encrypted in transit (HTTPS)
- ✅ Firebase Security Rules restrict data access
- ✅ Files auto-deleted after 24 hours
- ✅ No PII stored beyond email
- ✅ Rate limiting on API endpoints

### 8.3 Scalability

| Component | MVP Capacity |
|-----------|--------------|
| Concurrent Users | 100 |
| Analyses/Day | 500 |
| Storage | 50GB |

---

## 9. Out of Scope (Phase 2+)

The following features are explicitly **NOT** part of the MVP:

| Feature | Reason for Exclusion |
|---------|---------------------|
| Multiple user roles (admin/auditor) | Adds complexity |
| PDF document parsing | Requires OCR integration |
| Bank API integration | Security & compliance overhead |
| Custom analysis rules | Too complex for MVP |
| Report export (PDF/Excel) | Nice-to-have, not core |
| Real-time collaboration | Enterprise feature |
| Fraud prediction scoring | Requires ML training |
| Mobile app | Web-first approach |

---

## 10. Success Metrics

### MVP Launch Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| User can sign up/login | 100% | Manual QA |
| File upload works | < 10s for 5MB | Automated test |
| Analysis completes | < 60s for 10k rows | Automated test |
| Benford's chart renders | Accurate to theory | Visual QA |
| AI summary generated | Non-empty response | API test |
| Mobile responsive | Usable on phone | Manual QA |

### Post-Launch KPIs

| KPI | 30-Day Target |
|-----|---------------|
| Sign-ups | 100 |
| Analyses completed | 200 |
| Return users (7-day) | 25% |
| Avg. analysis time | < 45 seconds |

---

## 11. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (React + Vite)
- [ ] Tailwind CSS configuration
- [ ] shadcn/ui installation and setup
- [ ] Design system implementation (colors, typography, components)
- [ ] FastAPI backend setup
- [ ] Firebase configuration (Auth, Storage, Firestore)
- [ ] Basic UI layout and routing with modern design
- [ ] Authentication flow with sleek UI components

### Phase 2: Core Features (Week 2-3)
- [ ] File upload component
- [ ] Parser module (CSV/Excel)
- [ ] Statistical analysis engine
- [ ] Benford's Law implementation

### Phase 3: AI & Dashboard (Week 4)
- [ ] Gemini API integration
- [ ] Results dashboard UI
- [ ] AI insights display
- [ ] History page

### Phase 4: Polish & Launch (Week 5)
- [ ] Error handling & edge cases
- [ ] Loading states & animations
- [ ] Testing & bug fixes
- [ ] Deployment

---

## 12. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Gemini API rate limits | Analysis fails | Medium | Queue system, retry logic |
| Large file parsing timeout | Bad UX | Medium | Chunk processing, progress bar |
| Firebase cost overrun | Budget issue | Low | Usage monitoring, alerts |
| Benford's Law false positives | User confusion | Medium | Clear "Why" explanations |

---

## 13. Appendix

### A. Benford's Law — Technical Details

**Chi-Square Test Formula:**
```
χ² = Σ [(Observed - Expected)² / Expected]
```

**Python Implementation:**
```python
from scipy import stats

def benford_test(data):
    # Extract leading digits
    leading_digits = [int(str(abs(n))[0]) for n in data if n != 0]
    
    # Count occurrences
    observed = [leading_digits.count(i) / len(leading_digits) for i in range(1, 10)]
    
    # Expected Benford distribution
    expected = [0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046]
    
    # Chi-square test
    chi2, p_value = stats.chisquare(observed, expected)
    
    return {
        "observed": observed,
        "expected": expected,
        "chi_square": chi2,
        "p_value": p_value,
        "score": max(0, 100 - (chi2 * 10))  # Simplified score
    }
```

### B. Glossary

| Term | Definition |
|------|------------|
| **Benford's Law** | Mathematical principle about leading digit distribution |
| **Outlier** | Transaction significantly different from the mean |
| **Vendor Concentration** | When one vendor receives disproportionate payments |
| **Chi-Square Test** | Statistical test for distribution comparison |
| **Z-Score** | Number of standard deviations from the mean |

---

## 14. Frontend Setup Instructions

### Initial Project Setup

```bash
# Create Vite + React project
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui
npx shadcn-ui@latest init
```

### Tailwind Configuration

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Global CSS (src/index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom glassmorphism utility */
@layer components {
  .glass {
    @apply backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border border-white/20;
  }
  
  .glass-card {
    @apply glass shadow-xl rounded-lg;
  }
}
```

### shadcn/ui Components to Install

```bash
# Essential components for MVP
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
```

### Additional Dependencies

```bash
# Firebase
npm install firebase

# Routing
npm install react-router-dom

# Charts (for Benford's Law visualization)
npm install recharts

# Icons
npm install lucide-react

# File upload
npm install react-dropzone

# Form validation
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# Animations
npm install framer-motion
```

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Auth components
│   │   ├── upload/          # File upload components
│   │   ├── dashboard/       # Dashboard components
│   │   └── layout/          # Layout components
│   ├── lib/
│   │   ├── firebase.ts      # Firebase config
│   │   └── utils.ts         # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── types/               # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

**Document Owner:** [Your Name]  
**Reviewers:** [Team Members]  
**Approval Status:** Pending

---

*This document serves as the single source of truth for Fin-Analysis MVP development.*