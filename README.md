# CimaGen - Client-Side Image Generator

A comprehensive web application for client-side image processing and generation. All rendering and transformations run entirely in the browser using the native Canvas API, there is no server uploads, no external dependencies for image manipulation.

**Live Demo:** [https://motebaya.github.io/cimagen](https://motebaya.github.io/cimagen)

### Feature Showcase

| #   | Tool                           | Preview                                                                         | Description                                                                                                                                            | Try It                                                                 |
| --- | ------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | **Thumbnail Generator**        | <img src="public/images/sample-thumbnail.webp" width="120" alt="Thumbnail">     | Generate eye-catching thumbnails (800×400) with centered text and customizable backgrounds. Perfect for YouTube, blogs, and social media.              | [Launch →](https://motebaya.github.io/cimagen/thumbnail-creator)       |
| 2   | **Statistic Frame Creator**    | <img src="public/images/sample-statistic.webp" width="120" alt="Statistics">    | Overlay statistics and data onto images with semi-transparent backgrounds. Ideal for infographics and data visualization.                              | [Launch →](https://motebaya.github.io/cimagen/statistic-frame-creator) |
| 3   | **Duotone Creator**            | <img src="public/images/sample-duotone.webp" width="120" alt="Duotone">         | Transform photos into artistic duotone images with customizable color schemes. Supports 4 filter modes including classic and reverse.                  | [Launch →](https://motebaya.github.io/cimagen/duotone-creator)         |
| 4   | **Metadata Viewer**            | <img src="public/images/sample-metadata.webp" width="120" alt="Metadata">       | Extract and view EXIF data, camera settings, GPS location, and technical details from photos.                                                          | [Launch →](https://motebaya.github.io/cimagen/metadata-viewer)         |
| 5   | **BLACKPINK Logo Maker**       | <img src="public/images/sample-blackpink.webp" width="120" alt="BLACKPINK">     | Create K-pop style logos with signature pink and black aesthetics inspired by BLACKPINK.                                                               | [Launch →](https://motebaya.github.io/cimagen/blackpink-creator)       |
| 6   | **GTA Wasted Effect**          | <img src="public/images/sample-wasted.webp" width="120" alt="Wasted">           | Add the iconic GTA "Wasted" game over effect to your images. Perfect for memes and gaming content.                                                     | [Launch →](https://motebaya.github.io/cimagen/wasted-creator)          |
| 7   | **PH Logo Style Generator**    | <img src="public/images/sample-phlogo.webp" width="120" alt="PH Logo">          | Generate logos in the iconic orange and black style with customizable text and colors.                                                                 | [Launch →](https://motebaya.github.io/cimagen/phlogo-creator)          |
| 8   | **Handwritten Text Generator** | <img src="public/images/sample-handwritten.webp" width="120" alt="Handwritten"> | Create realistic handwritten text on paper. Generate authentic-looking notes and messages digitally.                                                   | [Launch →](https://motebaya.github.io/cimagen/paper-writer-creator)    |
| 9   | **Pokemon Card Creator**       | <img src="public/images/sample-pokemoncard.webp" width="120" alt="Pokemon">     | Design custom Pokemon trading cards with personalized stats, images, and abilities.                                                                    | [Launch →](https://motebaya.github.io/cimagen/pokemon-card-creator)    |
| 10  | **ICO Converter**              | <img src="public/images/sample-imagetoico.webp" width="120" alt="ICO">          | Convert images to ICO format for favicons and Windows icons. Generates multiple sizes (16×16 to 256×256).                                              | [Launch →](https://motebaya.github.io/cimagen/ico-converter)           |
| 11  | **PDF Converter**              | <img src="public/images/sample-imagetopdf.webp" width="120" alt="PDF">          | Convert multiple images to PDF documents. Combine images into a single PDF with customizable layout.                                                   | [Launch →](https://motebaya.github.io/cimagen/pdf-converter)           |
| 12  | **SVG Converter**              | <img src="public/images/sample-imagetosvg.webp" width="120" alt="SVG">          | Transform raster images into scalable SVG vector graphics. Create resolution-independent graphics.                                                     | [Launch →](https://motebaya.github.io/cimagen/svg-converter)           |
| 13  | **Low-Res Generator**          | <img src="public/images/sample-lowress.webp" width="120" alt="Low-Res">         | Simulate low-resolution images with realistic degradation effects. Create pixelated and compressed versions.                                           | [Launch →](https://motebaya.github.io/cimagen/lowres-generator)        |
| 14  | **OCR Reader**                 | <img src="public/images/sample-imageocr.webp" width="120" alt="OCR">            | Extract text from images using advanced OCR technology. Convert image text to editable text in multiple languages.                                     | [Launch →](https://motebaya.github.io/cimagen/ocr-reader)              |
| 15  | **App Icon Generator**         | <img src="public/images/sample-appicons.webp" width="120" alt="App Icons">      | Generate Android and iOS app icons with proper directory structure. Includes adaptive icons, round icons, and all required sizes in a single ZIP file. | [Launch →](https://motebaya.github.io/cimagen/app-icon-generator)      |

---

### Tech Stack

| Layer                | Technology                      |
| -------------------- | ------------------------------- |
| **Framework**        | React 19                        |
| **Bundler**          | Vite 7                          |
| **Styling**          | TailwindCSS v4                  |
| **Routing**          | react-router-dom v7             |
| **Icons**            | lucide-react                    |
| **Image Processing** | Native Canvas API               |
| **OCR Engine**       | Tesseract.js                    |
| **PDF Generation**   | jsPDF                           |
| **ZIP Creation**     | JSZip                           |
| **Font Loading**     | FontFace API                    |
| **Deployment**       | GitHub Pages via GitHub Actions |

---

### Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Setup

```bash
git clone https://github.com/motebaya/cimagen.git
cd cimagen
npm install
npm run dev
```

The development server starts at `http://localhost:5173/cimagen/`.

### Production Build

```bash
npm run build
npm run preview
```

The optimized output is written to the `dist/` directory.

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with 🍵 by [motebaya](https://github.com/motebaya)
