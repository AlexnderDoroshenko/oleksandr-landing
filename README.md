# Oleksandr Doroshenko – AQA Engineer Landing Page

Personal website showcasing the professional profile of an AQA Engineer, with a structured block-based blog, bilingual support (English / Ukrainian), authentication, and a Docker-ready setup.

## 🛠 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (React) |
| Styling | TailwindCSS |
| Auth | NextAuth.js (credentials) |
| Blog content | JSON block posts + Markdown |
| Password hashing | bcryptjs |
| File uploads | formidable |
| Testing | Jest + React Testing Library |
| CI/CD | GitHub Actions |
| Containerisation | Docker / Docker Compose |

## 📁 Project Structure

```
.
├── components/          # Reusable UI components (BlockEditor, BlockRenderer, …)
├── hooks/               # Custom React hooks
├── lib/                 # Server-side utilities (auth, users, API helpers, validation)
├── pages/
│   ├── admin/           # Admin-only pages (new-post editor)
│   ├── api/
│   │   ├── auth/        # NextAuth endpoints
│   │   ├── posts/       # CRUD endpoints for blog posts
│   │   └── upload.ts    # Media file upload endpoint
│   ├── auth/            # Sign-in page
│   ├── blog/            # Blog listing and post pages
│   ├── about.tsx
│   ├── contact.tsx
│   └── index.tsx
├── posts/               # Published blog post JSON files
├── public/
│   ├── images/          # Static images and icons
│   └── uploads/         # Uploaded media files (runtime)
├── scripts/
│   └── seed-admin.ts    # One-time admin user seed script
├── styles/              # Global CSS
├── types/               # TypeScript type definitions
└── __tests__/           # Jest test suites
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | Random secret for NextAuth — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public URL of the app (e.g. `http://localhost:3000`) |
| `ADMIN_EMAIL` | Email for the initial admin account (used by seed script) |
| `ADMIN_PASSWORD` | Password for the initial admin account |

### 3. Seed the admin user

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword npx ts-node -P tsconfig.json scripts/seed-admin.ts
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker

```bash
docker-compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run export` | Export static site |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest test suite |
| `npm run test:coverage` | Run tests with coverage |

## 📄 License

MIT
