# CimaGen

Static client-side image processing toolkit built with React and Vite, published as a GitHub Pages site. The project packages a large set of focused browser tools for image generation, conversion, cleanup, OCR, metadata inspection, and export workflows. Processing stays inside the browser runtime, so there is no application server involved in the image pipeline.

Live site: [https://motebaya.github.io/cimagen/](https://motebaya.github.io/cimagen/)

## Overview

CimaGen is a static web application where each route exposes a dedicated image utility. The application is designed around browser-local processing: user files are decoded in the client, transformed with Canvas and tool-specific libraries, and exported through Blob-based downloads. The repository is structured as a React SPA with route-level code splitting, reusable UI primitives, and isolated feature modules for each tool.

The project is intentionally built around browser capabilities rather than a backend queue. That keeps the deployment model simple, makes local development straightforward, and avoids sending image data to external services.

## Features

- Browser-local image generation, editing, conversion, and export.
- Tool coverage across meme generation, watermarking, background removal, OCR, metadata reading, palette extraction, line-art conversion, ASCII rendering, and PDF/icon conversion.
- Mixed processing strategies depending on the task: Canvas API for direct pixel work, worker-backed pipelines for heavier operations, and specialized libraries for OCR, PDF generation, ZIP output, and metadata parsing.
- Export targets including PNG, SVG, TXT, JSON, PDF, ICO, and ZIP.
- Static deployment on GitHub Pages with no server-side processing dependency.
- Offline-capable usage after the initial application assets and any route-specific model files have been cached by the browser.

## Tools Showcase

| No  | Preview                                                                                                 | Tool                      | Description                                                                                                                                    | Link                                                               |
| --- | ------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | <img src="public/images/sample_thumbnail_creator.webp" alt="Thumbnail Generator" width="120">           | Thumbnail Generator       | Generate thumbnail images with centered text and colored backgrounds. Perfect for blog posts, social media, and content previews.              | [Open](https://motebaya.github.io/cimagen/thumbnail-creator)       |
| 2   | <img src="public/images/sample_statistic_frame.webp" alt="Statistic Frame Generator" width="120">       | Statistic Frame Generator | Create statistic overlay frames on background images with customizable text. Great for sharing achievement milestones.                         | [Open](https://motebaya.github.io/cimagen/statistic-frame-creator) |
| 3   | <img src="public/images/sample_duotone.webp" alt="Duotone Generator" width="120">                       | Duotone Generator         | Convert images into a Pink x Green duotone effect. Choose from multiple filter modes including Classic, Reverse, and combined variants.        | [Open](https://motebaya.github.io/cimagen/duotone-creator)         |
| 4   | <img src="public/images/sample_metadata_exif.webp" alt="Metadata Viewer" width="120">                   | Metadata Viewer           | Extract and view EXIF metadata from images. Check GPS location, camera info, and download cleaned images without metadata.                     | [Open](https://motebaya.github.io/cimagen/metadata-viewer)         |
| 5   | <img src="public/images/sample_blackpink.webp" alt="Blackpink Text" width="120">                        | Blackpink Text            | Create pink text on black background with border effect. Perfect for stylish text graphics and social media posts.                             | [Open](https://motebaya.github.io/cimagen/blackpink-creator)       |
| 6   | <img src="public/images/sample_wasted.webp" alt="Wasted Generator" width="120">                         | Wasted Generator          | Add GTA-style `wasted` overlay to your images. Converts to grayscale and adds the iconic red text effect.                                      | [Open](https://motebaya.github.io/cimagen/wasted-creator)          |
| 7   | <img src="public/images/sample_phlogo.webp" alt="P*or*n Hub Logo" width="120">                          | P\*or\*n Hub Logo         | Create custom logo with white text, orange box, and rounded image. Parody generator for memes and jokes.                                       | [Open](https://motebaya.github.io/cimagen/phlogo-creator)          |
| 8   | <img src="public/images/sample_paperwritter.webp" alt="Paper Writer" width="120">                       | Paper Writer              | Convert text to handwritten-style paper pages. Automatically splits long text into multiple lined paper sheets.                                | [Open](https://motebaya.github.io/cimagen/paperwriter-creator)     |
| 9   | <img src="public/images/sample_pokemoncard.webp" alt="Pokemon Card" width="120">                        | Pokemon Card              | Create custom Pokemon-style trading cards. Choose from 4 templates with smart image cropping and text layout.                                  | [Open](https://motebaya.github.io/cimagen/pokemon-card-creator)    |
| 10  | <img src="public/images/sample_image_to_ico.webp" alt="Image to ICO" width="120">                       | Image to ICO              | Convert images to `.ico` format with multiple sizes. Perfect for creating favicons with automatic square cropping.                             | [Open](https://motebaya.github.io/cimagen/ico-converter)           |
| 11  | <img src="public/images/sample_image_to_pdf.webp" alt="Image to PDF" width="120">                       | Image to PDF              | Convert multiple images to a single PDF document. Drag to reorder, rotate pages, and customize layout settings.                                | [Open](https://motebaya.github.io/cimagen/pdf-converter)           |
| 12  | <img src="public/images/sample_image_to_svg.webp" alt="Image to SVG" width="120">                       | Image to SVG              | Convert raster images to vector SVG format. Choose between Logo mode (clean) or Photo mode (posterized).                                       | [Open](https://motebaya.github.io/cimagen/svg-converter)           |
| 13  | <img src="public/images/sample_lowress.webp" alt="Low-Res Generator" width="120">                       | Low-Res Generator         | Simulate realistic low-quality degraded images with JPEG artifacts, blur, and color reduction. Compare before/after.                           | [Open](https://motebaya.github.io/cimagen/lowres-generator)        |
| 14  | <img src="public/images/sample_imageocr.webp" alt="Image OCR Reader" width="120">                       | Image OCR Reader          | Extract text from images using optical character recognition. Supports English and Indonesian with preprocessing.                              | [Open](https://motebaya.github.io/cimagen/ocr-reader)              |
| 15  | <img src="public/images/sample_appicons.webp" alt="App Icon Generator" width="120">                     | App Icon Generator        | Generate Android and iOS app icons with proper directory structure. Includes adaptive icons, round icons, and all required sizes.              | [Open](https://motebaya.github.io/cimagen/app-icon-generator)      |
| 16  | <img src="public/images/sample_image_to_ascii.webp" alt="Image to ASCII" width="120">                   | Image to ASCII            | Convert uploaded images into ASCII art with live preview, brightness and contrast controls, custom charsets, and TXT or image export.          | [Open](https://motebaya.github.io/cimagen/image-to-ascii)          |
| 17  | <img src="public/images/sample_image_to_pixel.webp" alt="Image to Pixel" width="120">                   | Image to Pixel            | Turn photos into pixel art with palette presets, dithering, outlines, grid overlay, nearest-neighbor scaling, and PNG or SVG export.           | [Open](https://motebaya.github.io/cimagen/image-to-pixel)          |
| 18  | <img src="public/images/sample_color_palette_extractor.webp" alt="Color Palette Extractor" width="120"> | Color Palette Extractor   | Extract dominant colors from images, inspect HEX/RGB/HSL metadata, and export clean palette lists or JSON from a worker-backed pipeline.       | [Open](https://motebaya.github.io/cimagen/color-palette-extractor) |
| 19  | <img src="public/images/sample_image_to_emoji.webp" alt="Image to Emoji Mosaic" width="120">            | Image to Emoji Mosaic     | Convert images into emoji mosaics with preset libraries, custom emoji sets, grid controls, text export, and rendered image downloads.          | [Open](https://motebaya.github.io/cimagen/image-to-emoji-mosaic)   |
| 20  | <img src="public/images/sample_image_to_line_art.webp" alt="Image to Line Art" width="120">             | Image to Line Art         | Extract clean edges, sketch-like contours, or stencil-style line art with live threshold tuning, cleanup controls, and high-resolution export. | [Open](https://motebaya.github.io/cimagen/image-to-line-art)       |
| 21  | <img src="public/images/sample_image_to_ansi_art.webp" alt="Image to ANSI Art" width="120">             | Image to ANSI Art         | Render images into terminal-ready ANSI blocks with truecolor, 256-color, grayscale, or monochrome modes plus copyable console output.          | [Open](https://motebaya.github.io/cimagen/image-to-ansi-art)       |
| 22  | <img src="public/images/sample_image_upscaler.webp" alt="Image Upscaler" width="120">                   | Image Upscaler            | Upscale images offline with classic interpolation or an enhanced detail recovery mode while keeping preview rendering lightweight.             | [Open](https://motebaya.github.io/cimagen/image-upscaler)          |
| 23  | <img src="public/images/sample_html_toimage.webp" alt="HTML to Image" width="120">                      | HTML to Image             | Render pasted HTML or same-origin pages into exportable screenshots with viewport presets, device framing, padding, and shadow.                | [Open](https://motebaya.github.io/cimagen/html-to-image)           |
| 24  | <img src="public/images/sample_face_blur.webp" alt="Face Blur Tool" width="120">                        | Face Blur Tool            | Detect faces offline, click which regions stay blurred, and export image-safe results with blur, pixelate, or mosaic masking.                  | [Open](https://motebaya.github.io/cimagen/face-blur)               |
| 25  | <img src="public/images/sample_advanced_cropper.webp" alt="Advanced Cropper" width="120">               | Advanced Cropper          | Crop with aspect templates, shaped masks, zoom, rotation, drag repositioning, and export-ready background options.                             | [Open](https://motebaya.github.io/cimagen/advanced-cropper)        |
| 26  | <img src="public/images/sample_meme_generator.webp" alt="Meme Generator" width="120">                   | Meme Generator            | Choose a classic meme template, add draggable text or sticker layers, auto-fit captions, and export your finished meme offline.                | [Open](https://motebaya.github.io/cimagen/meme-generator)          |
| 27  | <img src="public/images/sample_watermark_tool.webp" alt="Watermark Tool" width="120">                   | Watermark Tool            | Apply text, image, tiled, and template watermarks with drag controls, layer editing, and batch ZIP export in a wider editor layout.            | [Open](https://motebaya.github.io/cimagen/watermark-tool)          |
| 28  | <img src="public/images/sample_background_remover.webp" alt="Background Remover" width="120">           | Background Remover        | Remove image backgrounds offline with a worker-based segmentation pipeline, then export transparent or replaced-background versions.           | [Open](https://motebaya.github.io/cimagen/background-remover)      |

## How It Works

The application is a static SPA served from GitHub Pages. A typical processing path looks like this:

1. The user selects or drops files into a tool route.
2. Files are decoded locally with browser APIs such as `FileReader`, `Image`, `Canvas`, `Blob`, and `ObjectURL`.
3. Tool-specific logic runs entirely in the client. Depending on the route, that can mean direct pixel transforms on Canvas, OCR through `tesseract.js`, metadata parsing through `exifr`/`exifreader`, PDF assembly through `jsPDF`, ZIP packaging through `JSZip`, or browser-side vision/model inference.
4. Results are rendered in the page and exported from memory without sending the original image to a remote server.

There is no server-side image pipeline. The only required network activity is the initial application load and any route-specific static assets or model files that have not been cached yet.

## Tech Stack

| Layer                  | Implementation                                                      |
| ---------------------- | ------------------------------------------------------------------- |
| Application runtime    | React 19, React Router, Vite 7                                      |
| Styling                | Tailwind CSS v4, CSS variables, component-level utility classes     |
| Imaging pipeline       | Canvas API, Blob/ObjectURL APIs, FileReader, FontFace API           |
| OCR                    | Tesseract.js                                                        |
| Metadata               | exifr, exif-reader, exifreader                                      |
| Vision and ML features | MediaPipe Tasks Vision, TensorFlow.js, browser-side upscaler models |
| Export formats         | jsPDF, JSZip, canvas-based PNG/JPEG/WebP output, TXT/JSON downloads |
| Mapping                | Leaflet, React Leaflet                                              |
| Deployment             | GitHub Pages                                                        |

## Performance and Offline Notes

- Images are processed in memory inside the browser process. The app does not upload user files to an external service.
- Heavier tools use route-level lazy loading, so large dependencies are not loaded on every page visit.
- Some workflows rely on worker-backed processing or model assets. The first run can take longer because the browser needs to fetch and cache those assets.
- After the app bundle and tool-specific assets are cached, the tools are usable offline as long as the browser cache remains available.
- Export speed and memory usage depend on image dimensions, number of layers/pages, and the selected tool.

## Development Notes

Run the project locally with:

```bash
npm install
npm run dev
```

Build the production bundle with:

```bash
npm run build
npm run preview
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
