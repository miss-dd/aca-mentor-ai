# AI-Powered Student Support System

A production-quality frontend for an AI-powered academic support platform. Students get instant, sourced answers to academic questions. Administrators manage knowledge, FAQs, queries, users, and analytics.

---

## Tech Stack

- **Framework**: TanStack Start (SSR, file-based routing)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Runtime**: Cloudflare Workers (via Nitro)

---

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin layout shell
│   ├── app/            # Student app shell (sidebar)
│   ├── auth/           # Auth page shell
│   ├── landing/        # Landing nav + footer
│   └── ui/             # shadcn/ui component library
├── hooks/              # Shared React hooks
├── lib/
│   ├── auth.tsx        # Auth context + mock provider
│   ├── mock-data.ts    # All mock data + AI response generator
│   └── utils.ts        # Tailwind class utilities
├── routes/
│   ├── __root.tsx      # Root layout (QueryClient, AuthProvider, Toaster)
│   ├── index.tsx       # Landing page (/)
│   ├── login.tsx       # /login
│   ├── register.tsx    # /register
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── _authenticated.tsx        # Student layout guard
│   ├── _authenticated.dashboard.tsx
│   ├── _authenticated.support.tsx
│   ├── _authenticated.conversations.index.tsx
│   ├── _authenticated.conversations.$id.tsx
│   ├── _authenticated.faqs.tsx
│   ├── _authenticated.resources.tsx
│   ├── _authenticated.profile.tsx
│   ├── _authenticated.help.tsx
│   ├── admin.tsx                 # Admin layout guard
│   └── admin/
│       ├── index.tsx             # /admin — Overview dashboard
│       ├── queries.tsx           # /admin/queries
│       ├── knowledge.tsx         # /admin/knowledge
│       ├── faqs.tsx              # /admin/faqs
│       ├── feedback.tsx          # /admin/feedback
│       ├── analytics.tsx         # /admin/analytics
│       ├── users.tsx             # /admin/users
│       ├── monitoring.tsx        # /admin/monitoring
│       └── settings.tsx          # /admin/settings
├── services/
│   ├── api.ts                    # Centralized fetch wrapper + mock helpers
│   ├── auth.service.ts           # (replace with Cognito)
│   ├── conversation.service.ts
│   ├── faq.service.ts
│   ├── resource.service.ts
│   ├── feedback.service.ts
│   └── admin.service.ts
├── types/
│   └── index.ts                  # All TypeScript interfaces
└── styles.css                    # Design tokens + Tailwind config
```

---

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
git clone <repository-url>
cd aca-mentor-ai
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Leave empty to use mock data (default for local dev)
VITE_PUBLIC_API_BASE_URL=

# Set to your API Gateway base URL for real backend
# VITE_PUBLIC_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

When `VITE_PUBLIC_API_BASE_URL` is empty, all services use in-memory mock data automatically. No other configuration is needed for local development.

---

## Authentication

### Current (Mock)

- Any email + any password logs in successfully
- User is stored in `localStorage` under key `aiss-user`
- Passwords are never stored
- `AuthProvider` in `src/lib/auth.tsx` manages state

### Replacing with Amazon Cognito

1. Install the Amplify Auth library:
   ```bash
   npm install aws-amplify
   ```

2. Configure Cognito in `src/lib/auth.tsx`:
   ```ts
   import { Amplify } from 'aws-amplify';
   import { signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth';

   Amplify.configure({
     Auth: {
       Cognito: {
         userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
         userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
       }
     }
   });
   ```

3. Replace the mock `login`, `register`, and `logout` functions in `AuthProvider` with the Amplify calls above. The `AuthContext` interface stays identical — no component changes needed.

4. Add to `.env.local`:
   ```env
   VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
   VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. For role-based access (student vs admin), decode the Cognito JWT and read the `custom:role` claim. Update `User.role` in the auth context accordingly.

---

## API Integration (Amazon API Gateway)

All data access goes through service modules in `src/services/`. Each service calls `api()` from `src/services/api.ts`.

### Switching from Mock to Real API

Set `VITE_PUBLIC_API_BASE_URL` in your environment. The `MOCK_MODE` flag in `api.ts` becomes `false` automatically and all `api()` calls route to your API Gateway endpoint.

### Expected API Response Shape

All endpoints must return:

```json
// Success
{ "success": true, "data": {}, "message": "optional" }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message" } }
```

### Service → Endpoint Mapping

| Service | Method | Endpoint |
|---|---|---|
| `conversationService.list()` | GET | `/conversations` |
| `conversationService.create()` | POST | `/conversations` |
| `conversationService.sendMessage()` | POST | `/conversations/:id/messages` |
| `faqService.list()` | GET | `/faqs` |
| `resourceService.list()` | GET | `/resources` |
| `resourceService.requestDownloadUrl()` | POST | `/resources/:id/download-url` |
| `adminService.getAnalytics()` | GET | `/admin/analytics` |
| `adminService.listQueries()` | GET | `/admin/queries` |
| `adminService.listDocs()` | GET | `/admin/knowledge` |
| `adminService.requestUploadUrl()` | POST | `/admin/knowledge/upload-url` |
| `feedbackService.submit()` | POST | `/feedback` |

### File Uploads (Knowledge Base)

The frontend never uploads directly to S3. It calls `adminService.requestUploadUrl()` which hits your backend to get a pre-signed S3 URL, then uploads to that URL. This keeps AWS credentials server-side only.

---

## AWS Backend Architecture (Reference)

The frontend is designed to connect to this backend stack:

| Service | Purpose |
|---|---|
| Amazon API Gateway | REST API entry point |
| AWS Lambda | Business logic handlers |
| Amazon Cognito | Authentication + JWT |
| Amazon DynamoDB | Conversations, FAQs, users |
| Amazon Bedrock | AI response generation |
| Amazon S3 | Knowledge base document storage |
| Amazon SQS | Async processing queue |
| Amazon SES | Email notifications |
| Amazon CloudWatch | Logging + monitoring |
| Terraform | Infrastructure as code |
| GitHub Actions | CI/CD pipeline |

**No AWS credentials, Bedrock keys, or backend secrets should ever appear in this frontend codebase.**

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--brand-deep` | `#123B6D` | Deep academic blue — headings, sidebar |
| `--brand` | `#2563EB` | Primary blue — buttons, links, active states |
| `--teal` | `#14B8A6` | Accent — charts, highlights |
| `--success` | `#16A34A` | Positive states |
| `--warning` | `#F59E0B` | Caution states |
| `--destructive` | `#DC2626` | Error states |
| `--background` | `#F8FAFC` | Page background |
| `--foreground` | `#0F172A` | Primary text |
| `--muted-foreground` | `#64748B` | Secondary text |
| `--border` | `#E2E8F0` | Borders |

---

## Accessibility

- WCAG 2.2 AA target
- All interactive elements have visible focus rings
- Form fields have associated labels and `aria-describedby` error links
- Icon-only buttons have `aria-label` and `title`
- Color is never the sole indicator of state
- Semantic HTML throughout (`<header>`, `<nav>`, `<main>`, `<aside>`, `<ul>`)

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
npm run format    # Prettier
```

---

## AI Safety Notice

> AI-generated responses are intended to provide academic guidance and may not replace official institutional decisions. Verify important information with the appropriate department.

This notice is displayed in the chat interface and is configurable via Admin → Settings.

---

© 2026 AI-Powered Student Support System
