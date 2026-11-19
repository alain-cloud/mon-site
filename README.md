# Alaeddine Najjar - Portfolio

Multilingual portfolio in English, French, Spanish, and Arabic, built with React and Vite. The language switch updates the page copy and generates a matching CV; Arabic uses the browser's print-to-PDF flow.

## Run locally

```sh
npm install
npm run dev
```

Use Node.js 22.12 or newer.

## Build

```sh
npm run build
```

## CV downloads

The English, French, and Spanish CVs are generated in the browser from the localized portfolio content. The Arabic CV opens a print-ready page so the browser can render Arabic text correctly; choose **Save as PDF** in the print dialog.

## GitHub Pages

Vite uses relative asset paths so the site can work both at `alain-cloud.github.io/mon-site/` and on the custom domain `alaeddinenajjar.com`.
