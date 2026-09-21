# Oleksandr Doroshenko — personal website

A bilingual static portfolio and engineering blog built with Next.js. The published website is generated entirely from files in this repository and deployed to GitHub Pages.

## Stack

- Next.js and React
- TypeScript and Tailwind CSS
- JSON block posts and legacy Markdown posts
- Jest and React Testing Library
- GitHub Actions and GitHub Pages

There is no database, authentication, admin panel, upload API, or persistent application server.

## Local development

Requirements: Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

Run the checks used by the quality gate:

```bash
npx tsc --noEmit
npm test -- --runInBand
GITHUB_PAGES=true npm run build
```

The production build is written to `out/`.

## Publishing a blog post

Blog content is Git-based. Publishing means changing files, opening a pull request, and merging it after review.

1. Add an English or Ukrainian post to `posts/` using `<slug>-en.json` or `<slug>-uk.json`.
2. Put referenced images, PDFs, or videos in `public/uploads/` and use paths such as `/uploads/example.webp` in the post blocks.
3. Run the checks locally.
4. Commit the content and open a pull request.
5. After merge to `main`, the deployment workflow rebuilds and publishes GitHub Pages.

Example block post:

```json
{
  "title": "Post title",
  "date": "2026-09-21",
  "blocks": [
    {
      "id": "intro",
      "type": "paragraph",
      "content": "Post text"
    },
    {
      "id": "diagram",
      "type": "image",
      "src": "/uploads/example.webp",
      "alt": "Diagram description"
    }
  ]
}
```

## Quality and security gate

Pull requests run TypeScript checks, unit tests, a static production build, dependency review, CodeQL SAST, TruffleHog secret scanning, Trivy dependency/configuration scanning, and an OWASP ZAP baseline scan against the exported site.

## Project structure

```text
components/       Shared interface and post rendering components
hooks/            Client-side language preference
lib/posts.ts      Build-time content loader
pages/            Statically exported website routes
posts/            Version-controlled blog posts
public/uploads/   Version-controlled blog media
styles/           Global styles
types/            Blog content types
__tests__/        Jest test suites
```
