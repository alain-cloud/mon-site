# Alaeddine Najjar — Cloud Architecture Portfolio

A multilingual professional portfolio in English, French, Spanish, and Arabic. It presents technology leadership, cloud and enterprise architecture, selected technical work, career history, credentials, and contact options. The site is a static React application built with Vite and deployed to GitHub Pages.

## Requirements

- Node.js 22.12 or newer (the required version is recorded in `.nvmrc`)
- npm

## Local development

```sh
npm ci
npm run dev
```

Vite prints the local preview URL. The application reads its localized Markdown content directly from `content/`.

## Validation and production build

```sh
npm test
npm run lint
npm run build
npm run preview
```

The production output is generated in `dist/`; it is not committed. `npm run preview` serves that output locally after a build.

## Repository structure

- `content/{en,fr,es,ar}/` — localized profile, impact, expertise, community, experience, projects, credentials, and contact content.
- `src/App.jsx` — page composition, language selection, CV generation, and interactions.
- `src/contentUtils.js` — Markdown/front-matter parsing shared by the portfolio and CV.
- `public/logos/` — locally stored employer and credential marks.
- `public/cv/` — existing reference CV files.
- `test/` — Node.js unit tests.
- `.github/workflows/static.yml` — active GitHub Pages build and deployment workflow.

## Updating content

Edit the matching Markdown file in each `content/<language>/` directory and preserve its front matter and section structure. `content/README.md` documents the current authoring conventions, anonymization rules, and assistant endpoint contract. Review all four language versions before publishing a factual or career-history change.

The featured architecture articles and their sample repositories are linked from the blog at `https://blog.alaeddinenajjar.com`. They are labeled as reference architectures or technical demonstrations, not as client engagements.

## CV generation

The English, French, and Spanish CVs are generated in the browser from the selected language's portfolio content. The Arabic CV opens a print-ready page so the browser can shape right-to-left text; choose **Save as PDF** in the print dialog.

## GitHub Pages and custom domain

The active workflow builds with Node.js 22 and deploys `dist/` to GitHub Pages when changes are pushed to `main`. Vite's relative asset paths support both the GitHub project URL and the configured custom domain. Deployment workflow and domain settings should be changed only when the hosting model changes.

## Security and third-party services

No API key or private assistant credential belongs in this static application. `VITE_RECRUITER_ASSISTANT_ENDPOINT`, if configured, is public in the generated JavaScript; the endpoint must enforce its own authentication, rate limiting, and server-side secret storage. YouTube embeds use the privacy-enhanced host and load lazily.

## Licensing

No repository-wide license file is currently declared. Local brand marks remain subject to their owners' trademark and brand-use requirements; see `public/logos/README.md`.
