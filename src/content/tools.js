const BASE = import.meta.env.BASE_URL;

export const tools = [
  {
    id: "thumbnail",
    title: "Thumbnail Generator",
    description:
      "Generate thumbnail images with centered text and colored backgrounds. Perfect for blog posts, social media, and content previews.",
    thumbnail: `${BASE}images/sample_thumbnail_creator.webp`,
    href: "/thumbnail-creator",
    icon: "image",
    tags: ["thumbnail", "youtube", "cover", "social", "text", "generator"],
  },
  {
    id: "statistic-frame",
    title: "Statistic Frame Generator",
    description:
      "Create statistic overlay frames on background images with customizable text. Great for sharing achievement milestones.",
    thumbnail: `${BASE}images/sample_statistic_frame.webp`,
    href: "/statistic-frame-creator",
    icon: "barChart3",
    tags: [
      "statistics",
      "frame",
      "overlay",
      "milestone",
      "achievement",
      "generator",
    ],
  },
  {
    id: "duotone",
    title: "Duotone Generator",
    description:
      "Convert images into a Pink x Green duotone effect. Choose from multiple filter modes including Classic, Reverse, and combined variants.",
    thumbnail: `${BASE}images/sample_duotone.webp`,
    href: "/duotone-creator",
    icon: "palette",
    tags: ["duotone", "two tone", "color effect", "photo filter", "palette"],
  },
  {
    id: "metadata",
    title: "Metadata Viewer",
    description:
      "Extract and view EXIF metadata from images. Check GPS location, camera info, and download cleaned images without metadata.",
    thumbnail: `${BASE}images/sample_metadata_exif.webp`,
    href: "/metadata-viewer",
    icon: "info",
    tags: ["metadata", "exif", "gps", "camera", "viewer", "photo info"],
  },
  {
    id: "blackpink",
    title: "Blackpink Text",
    description:
      "Create pink text on black background with border effect. Perfect for stylish text graphics and social media posts.",
    thumbnail: `${BASE}images/sample_blackpink.webp`,
    href: "/blackpink-creator",
    icon: "heart",
    tags: ["text", "logo", "blackpink", "kpop", "graphic", "generator"],
  },
  {
    id: "wasted",
    title: "Wasted Generator",
    description:
      "Add GTA-style 'wasted' overlay to your images. Converts to grayscale and adds the iconic red text effect.",
    thumbnail: `${BASE}images/sample_wasted.webp`,
    href: "/wasted-creator",
    icon: "skull",
    tags: ["wasted", "gta", "meme", "overlay", "effect", "generator"],
  },
  {
    id: "phlogo",
    title: "P*or*n Hub Logo",
    description:
      "Create custom logo with white text, orange box, and rounded image. Parody generator for memes and jokes.",
    thumbnail: `${BASE}images/sample_phlogo.webp`,
    href: "/phlogo-creator",
    icon: "sparkles",
    tags: ["logo", "parody", "orange box", "meme", "brand", "generator"],
  },
  {
    id: "paperwriter",
    title: "Paper Writer",
    description:
      "Convert text to handwritten-style paper pages. Automatically splits long text into multiple lined paper sheets.",
    thumbnail: `${BASE}images/sample_paperwritter.webp`,
    href: "/paperwriter-creator",
    icon: "fileText",
    tags: ["handwriting", "paper", "notes", "writer", "text", "generator"],
  },
  {
    id: "pokemoncard",
    title: "Pokemon Card",
    description:
      "Create custom Pokemon-style trading cards. Choose from 4 templates with smart image cropping and text layout.",
    thumbnail: `${BASE}images/sample_pokemoncard.webp`,
    href: "/pokemon-card-creator",
    icon: "creditCard",
    tags: ["pokemon", "card", "trading card", "tcg", "generator", "template"],
  },
  {
    id: "ico-converter",
    title: "Image to ICO",
    description:
      "Convert images to .ico format with multiple sizes. Perfect for creating favicons with automatic square cropping.",
    thumbnail: `${BASE}images/sample_image_to_ico.webp`,
    href: "/ico-converter",
    icon: "fileImage",
    tags: ["ico", "favicon", "icon", "converter", "windows", "app icon"],
  },
  {
    id: "pdf-converter",
    title: "Image to PDF",
    description:
      "Convert multiple images to a single PDF document. Drag to reorder, rotate pages, and customize layout settings.",
    thumbnail: `${BASE}images/sample_image_to_pdf.webp`,
    href: "/pdf-converter",
    icon: "fileType",
    tags: ["pdf", "document", "converter", "images to pdf", "pages"],
  },
  {
    id: "svg-converter",
    title: "Image to SVG",
    description:
      "Convert raster images to vector SVG format. Choose between Logo mode (clean) or Photo mode (posterized).",
    thumbnail: `${BASE}images/sample_image_to_svg.webp`,
    href: "/svg-converter",
    icon: "layers",
    tags: ["svg", "vector", "converter", "logo", "posterize", "trace"],
  },
  {
    id: "lowres-generator",
    title: "Low-Res Generator",
    description:
      "Simulate realistic low-quality degraded images with JPEG artifacts, blur, and color reduction. Compare before/after.",
    thumbnail: `${BASE}images/sample_lowress.webp`,
    href: "/lowres-generator",
    icon: "sliders",
    tags: [
      "low res",
      "degrade",
      "compression",
      "blur",
      "pixelated",
      "generator",
    ],
  },
  {
    id: "ocr-reader",
    title: "Image OCR Reader",
    description:
      "Extract text from images using optical character recognition. Supports English and Indonesian with preprocessing.",
    thumbnail: `${BASE}images/sample_imageocr.webp`,
    href: "/ocr-reader",
    icon: "scanText",
    tags: ["ocr", "text extraction", "image to text", "reader", "scan"],
  },
  {
    id: "app-icon-generator",
    title: "App Icon Generator",
    description:
      "Generate Android and iOS app icons with proper directory structure. Includes adaptive icons, round icons, and all required sizes.",
    thumbnail: `${BASE}images/sample_appicons.webp`,
    href: "/app-icon-generator",
    icon: "smartphone",
    tags: [
      "app icon",
      "android",
      "ios",
      "mobile",
      "adaptive icon",
      "generator",
    ],
  },
  {
    id: "image-to-ascii",
    title: "Image to ASCII",
    description:
      "Convert uploaded images into ASCII art with live preview, brightness and contrast controls, custom charsets, and TXT or image export.",
    thumbnail: `${BASE}images/sample_image_to_ascii.webp`,
    href: "/image-to-ascii",
    icon: "fileText",
    tags: ["ascii", "text art", "terminal", "converter", "monospace", "export"],
  },
  {
    id: "image-to-pixel",
    title: "Image to Pixel",
    description:
      "Turn photos into pixel art with palette presets, dithering, outlines, grid overlay, nearest-neighbor scaling, and PNG or SVG export.",
    thumbnail: `${BASE}images/sample_image_to_pixel.webp`,
    href: "/image-to-pixel",
    icon: "sliders",
    tags: ["pixel art", "pixel", "retro", "dither", "palette", "converter"],
  },
  {
    id: "color-palette-extractor",
    title: "Color Palette Extractor",
    description:
      "Extract dominant colors from images, inspect HEX/RGB/HSL metadata, and export clean palette lists or JSON from a worker-backed pipeline.",
    thumbnail: `${BASE}images/sample_color_palette_extractor.webp`,
    href: "/color-palette-extractor",
    icon: "palette",
    tags: [
      "palette",
      "colors",
      "hex",
      "extractor",
      "dominant colors",
      "metadata",
    ],
  },
  {
    id: "image-to-emoji-mosaic",
    title: "Image to Emoji Mosaic",
    description:
      "Convert images into emoji mosaics with preset libraries, custom emoji sets, grid controls, text export, and rendered image downloads.",
    thumbnail: `${BASE}images/sample_image_to_emoji.webp`,
    href: "/image-to-emoji-mosaic",
    icon: "heart",
    tags: ["emoji", "mosaic", "emoji art", "grid", "converter", "playful"],
  },
  {
    id: "image-to-line-art",
    title: "Image to Line Art",
    description:
      "Extract clean edges, sketch-like contours, or stencil-style line art with live threshold tuning, cleanup controls, and high-resolution export.",
    thumbnail: `${BASE}images/sample_image_to_line_art.webp`,
    href: "/image-to-line-art",
    icon: "scanText",
    tags: ["line art", "edge", "sketch", "stencil", "outline", "converter"],
  },
  {
    id: "image-to-ansi-art",
    title: "Image to ANSI Art",
    description:
      "Render images into terminal-ready ANSI blocks with truecolor, 256-color, grayscale, or monochrome modes plus copyable console output.",
    thumbnail: `${BASE}images/sample_image_to_ansi_art.webp`,
    href: "/image-to-ansi-art",
    icon: "fileType",
    tags: [
      "ansi",
      "terminal",
      "console",
      "block art",
      "truecolor",
      "converter",
    ],
  },
  {
    id: "image-upscaler",
    title: "Image Upscaler",
    description:
      "Upscale images offline with classic interpolation or an enhanced detail recovery mode while keeping preview rendering lightweight.",
    thumbnail: `${BASE}images/sample_image_upscaler.webp`,
    href: "/image-upscaler",
    icon: "image",
    tags: ["upscale", "enhance", "resolution", "lanczos", "ai", "converter"],
  },
  {
    id: "html-to-image",
    title: "HTML to Image",
    description:
      "Render pasted HTML or same-origin pages into exportable screenshots with viewport presets, device framing, padding, and shadow.",
    thumbnail: `${BASE}images/sample_html_toimage.webp`,
    href: "/html-to-image",
    icon: "layers",
    tags: ["html", "screenshot", "website", "capture", "iframe", "export"],
  },
  {
    id: "face-blur",
    title: "Face Blur Tool",
    description:
      "Detect faces offline, click which regions stay blurred, and export image-safe results with blur, pixelate, or mosaic masking.",
    thumbnail: `${BASE}images/sample_face_blur.webp`,
    href: "/face-blur",
    icon: "scanText",
    tags: [
      "face blur",
      "privacy",
      "detect faces",
      "pixelate",
      "mosaic",
      "offline",
    ],
  },
  {
    id: "advanced-cropper",
    title: "Advanced Cropper",
    description:
      "Crop with aspect templates, shaped masks, zoom, rotation, drag repositioning, and export-ready background options.",
    thumbnail: `${BASE}images/sample_advanced_cropper.webp`,
    href: "/advanced-cropper",
    icon: "fileImage",
    tags: ["crop", "mask", "aspect ratio", "rotate", "shape crop", "editor"],
  },
  {
    id: "meme-generator",
    title: "Meme Generator",
    description:
      "Choose a classic meme template, add draggable text or sticker layers, auto-fit captions, and export your finished meme offline.",
    thumbnail: `${BASE}images/sample_meme_generator.webp`,
    href: "/meme-generator",
    icon: "sparkles",
    tags: ["meme", "template", "caption", "generator", "funny", "stickers"],
  },
  {
    id: "watermark-tool",
    title: "Watermark Tool",
    description:
      "Apply text, image, tiled, and template watermarks with drag controls, layer editing, and batch ZIP export in a wider editor layout.",
    thumbnail: `${BASE}images/sample_watermark_tool.webp`,
    href: "/watermark-tool",
    icon: "layers",
    tags: [
      "watermark",
      "batch",
      "text overlay",
      "brand",
      "copyright",
      "editor",
    ],
  },
  {
    id: "background-remover",
    title: "Background Remover",
    description:
      "Remove image backgrounds offline with a worker-based segmentation pipeline, then export transparent or replaced-background versions.",
    thumbnail: `${BASE}images/sample_background_remover.webp`,
    href: "/background-remover",
    icon: "image",
    tags: [
      "background remover",
      "cutout",
      "transparent png",
      "segmentation",
      "offline",
      "editor",
    ],
  },
];

export default tools;
