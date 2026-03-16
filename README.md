# Client-Side Image Generator

A single-page web application for client-side image processing. All rendering and transformations run entirely in the browser using the native Canvas API — no server uploads, no external dependencies for image manipulation.

**Live Demo:** [https://motebaya.github.io/cimagen](https://motebaya.github.io/cimagen)

## Features

### Thumbnail Generator

Generates thumbnail images (800×400) with centered, word-wrapped text over a solid background color. Supports 7 preset dark color palettes and a custom hex color picker.

### Statistic Frame Generator

Overlays statistic text onto a user-uploaded image with rounded semi-transparent backgrounds and per-character stroke rendering. Renders at the original image resolution.

### Duotone Generator

Converts images into a Pink × Green duotone effect using Rec. 709 luminance with a contrast S-curve. Supports four filter modes:

| Mode                  | Description                            |
| --------------------- | -------------------------------------- |
| **Original**          | Optimized shadow/highlight preset      |
| **Classic**           | Classic green/pink color palette       |
| **Reverse**           | Swapped shadow ↔ highlight (optimized) |
| **Classic & Reverse** | Swapped shadow ↔ highlight (classic)   |

### Common Features

- **Export** — Download output as PNG, JPG, or WEBP with configurable quality
- **Live Preview** — Debounced real-time preview while editing parameters
- **Edit History** — localStorage-backed history (up to 20 entries per tool) with restore/delete
- **Dark/Light Theme** — Persisted theme toggle with smooth CSS transitions
- **Lazy Loading** — IntersectionObserver-based image loading on the home page
- **Font Preloading** — Custom fonts (Inter, SpaceGrotesk, HelveticaLTStd) loaded on app init via the FontFace API

## Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Framework        | React 19                        |
| Bundler          | Vite 7                          |
| Styling          | TailwindCSS v4                  |
| Routing          | react-router-dom v7             |
| Icons            | lucide-react                    |
| Image Processing | Native Canvas API               |
| Font Loading     | FontFace API                    |
| Deployment       | GitHub Pages via GitHub Actions |

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Setup

```bash
# Clone the repository
git clone https://github.com/motebaya/cimagen.git
cd cimagen

# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server starts at `http://localhost:5173/cimagen/`.

### Production Build

```bash
npm run build
```

The optimized output is written to the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with 🍵 by [motebaya](https://github.com/motebaya)
