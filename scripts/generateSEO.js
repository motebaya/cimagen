import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO Configuration
const seoConfig = {
  siteName: 'CimaGen - Professional Image Generator & Editor',
  siteUrl: 'https://cimagen.com/cimagen',
  defaultImage: '/cimagen/og-image.png',
  twitterHandle: '@cimagen',
  
  pages: {
    home: {
      path: '',
      title: 'CimaGen - Free Online Image Generator & Editor Tools',
      description: 'Create stunning images with our free online tools. Generate thumbnails, memes, logos, convert images to PDF, ICO, SVG, and more. Professional image editing made easy.',
      keywords: 'image generator, online image editor, thumbnail creator, meme generator, image converter, PDF converter, ICO converter, SVG converter, OCR reader, image tools',
    },
    'thumbnail-creator': {
      path: 'thumbnail-creator',
      title: 'YouTube Thumbnail Creator - Free Online Tool | CimaGen',
      description: 'Create eye-catching YouTube thumbnails instantly. Professional thumbnail maker with customizable text, colors, and effects. Download in high quality for free.',
      keywords: 'youtube thumbnail creator, thumbnail maker, video thumbnail generator, custom thumbnails, youtube thumbnail design',
    },
    'statistic-frame-creator': {
      path: 'statistic-frame-creator',
      title: 'Statistics Frame Creator - Add Stats to Images | CimaGen',
      description: 'Add professional statistics frames to your images. Perfect for social media posts, presentations, and infographics. Customize colors, fonts, and layouts.',
      keywords: 'statistics frame, data visualization, infographic creator, stats overlay, image statistics',
    },
    'duotone-creator': {
      path: 'duotone-creator',
      title: 'Duotone Image Creator - Two-Tone Photo Effect | CimaGen',
      description: 'Transform photos into stunning duotone images. Apply two-color effects with customizable color schemes. Create artistic duotone photos instantly.',
      keywords: 'duotone creator, two tone effect, duotone filter, photo effects, color grading',
    },
    'metadata-viewer': {
      path: 'metadata-viewer',
      title: 'Image Metadata Viewer - EXIF Data Reader | CimaGen',
      description: 'View and analyze image metadata and EXIF data. Extract camera settings, GPS location, timestamps, and technical details from photos.',
      keywords: 'exif viewer, metadata reader, image information, photo data, camera settings',
    },
    'blackpink-creator': {
      path: 'blackpink-creator',
      title: 'BLACKPINK Logo Maker - K-pop Style Text Generator | CimaGen',
      description: 'Create BLACKPINK-style logos and text designs. Generate K-pop inspired graphics with signature pink and black aesthetics.',
      keywords: 'blackpink logo, kpop logo maker, blackpink text generator, kpop graphics, blackpink style',
    },
    'wasted-creator': {
      path: 'wasted-creator',
      title: 'GTA Wasted Effect Generator - Meme Creator | CimaGen',
      description: 'Add the iconic GTA "Wasted" effect to your images. Create viral memes with the classic Grand Theft Auto game over screen.',
      keywords: 'wasted meme generator, gta wasted effect, game over meme, gta meme maker, wasted screen',
    },
    'phlogo-creator': {
      path: 'phlogo-creator',
      title: 'PH Logo Style Generator - Orange Box Logo Maker | CimaGen',
      description: 'Create logos in the iconic orange and black style. Generate professional-looking logos with customizable text and colors.',
      keywords: 'ph logo maker, orange logo generator, logo creator, brand logo, custom logo design',
    },
    'paper-writer-creator': {
      path: 'paper-writer-creator',
      title: 'Handwritten Text Generator - Paper Note Creator | CimaGen',
      description: 'Generate realistic handwritten text on paper. Create authentic-looking handwritten notes and messages digitally.',
      keywords: 'handwriting generator, paper note creator, handwritten text, digital handwriting, note maker',
    },
    'pokemon-card-creator': {
      path: 'pokemon-card-creator',
      title: 'Pokemon Card Creator - Custom Trading Card Maker | CimaGen',
      description: 'Design custom Pokemon trading cards. Create personalized Pokemon cards with custom stats, images, and abilities.',
      keywords: 'pokemon card maker, custom pokemon cards, trading card creator, pokemon card generator, tcg creator',
    },
    'ico-converter': {
      path: 'ico-converter',
      title: 'Image to ICO Converter - Favicon Generator | CimaGen',
      description: 'Convert images to ICO format for favicons and Windows icons. Generate multiple sizes (16x16 to 256x256) in one click.',
      keywords: 'ico converter, favicon generator, image to ico, icon creator, favicon maker, windows icon',
    },
    'pdf-converter': {
      path: 'pdf-converter',
      title: 'Image to PDF Converter - Multi-Page PDF Creator | CimaGen',
      description: 'Convert multiple images to PDF documents. Combine images into a single PDF with customizable page size, orientation, and layout.',
      keywords: 'image to pdf, pdf converter, images to pdf, pdf creator, combine images pdf, multi-page pdf',
    },
    'svg-converter': {
      path: 'svg-converter',
      title: 'Image to SVG Converter - Vector Graphics Generator | CimaGen',
      description: 'Convert raster images to scalable SVG vector graphics. Transform photos and logos into resolution-independent SVG format.',
      keywords: 'image to svg, svg converter, vectorize image, raster to vector, svg generator, vector graphics',
    },
    'lowres-generator': {
      path: 'lowres-generator',
      title: 'Low Resolution Image Generator - Image Degradation Tool | CimaGen',
      description: 'Simulate low-resolution images with realistic degradation effects. Create pixelated, compressed, and low-quality image versions.',
      keywords: 'low resolution generator, image degradation, pixelate image, compress image, low quality image',
    },
    'ocr-reader': {
      path: 'ocr-reader',
      title: 'Image OCR Reader - Extract Text from Images | CimaGen',
      description: 'Extract text from images using advanced OCR technology. Convert image text to editable text in multiple languages.',
      keywords: 'ocr reader, text extraction, image to text, ocr online, text recognition, image text reader',
    },
    'app-icon-generator': {
      path: 'app-icon-generator',
      title: 'App Icon Generator - Android & iOS Icons | CimaGen',
      description: 'Generate professional Android and iOS app icons instantly. Create all required icon sizes with proper directory structure. Supports adaptive icons, badges, and custom backgrounds.',
      keywords: 'app icon generator, android icon maker, ios icon creator, app icon design, adaptive icons, mobile app icons, icon generator',
    },
  },
};

function generateMetaTags(page) {
  const url = page.path ? `${seoConfig.siteUrl}/${page.path}` : seoConfig.siteUrl;
  const imageUrl = `https://cimagen.com${seoConfig.defaultImage}`;
  
  return `
    <!-- Primary Meta Tags -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="title" content="${page.title}" />
    <meta name="description" content="${page.description}" />
    <meta name="keywords" content="${page.keywords}" />
    <meta name="theme-color" content="#4c6ef5" />
    
    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%234c6ef5'/><path d='M8 22l5-7 4 5 3-4 4 6H8z' fill='white' opacity='0.9'/><circle cx='21' cy='12' r='3' fill='white' opacity='0.9'/></svg>" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="${seoConfig.siteName}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${url}" />
    <meta property="twitter:title" content="${page.title}" />
    <meta property="twitter:description" content="${page.description}" />
    <meta property="twitter:image" content="${imageUrl}" />
    <meta property="twitter:creator" content="${seoConfig.twitterHandle}" />
    
    <!-- Additional Meta Tags -->
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="revisit-after" content="7 days" />
    <meta name="author" content="CimaGen" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${url}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${page.title}",
      "description": "${page.description}",
      "url": "${url}",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "CimaGen",
        "url": "${seoConfig.siteUrl}"
      }
    }
    </script>
  `;
}

function generateHTML(page, linkTags, scriptTags) {
  return `<!doctype html>
<html lang="en">
  <head>${generateMetaTags(page)}
    ${linkTags}
  </head>
  <body>
    <div id="root"></div>
    ${scriptTags}
  </body>
</html>
`;
}

// Generate HTML files
const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Generating static HTML files with SEO meta tags...\n');

// Read the Vite-built index.html to extract script and link tags
const viteIndexPath = path.join(distDir, 'index.html');
let scriptTags = '<script type="module" crossorigin src="/cimagen/assets/index-HASH.js"></script>';
let linkTags = '';

if (fs.existsSync(viteIndexPath)) {
  const viteHTML = fs.readFileSync(viteIndexPath, 'utf-8');
  
  // Extract link tags (CSS)
  const linkMatch = viteHTML.match(/<link[^>]*rel="stylesheet"[^>]*>/g);
  if (linkMatch) {
    linkTags = linkMatch.join('\n    ');
  }
  
  // Extract script tags
  const scriptMatch = viteHTML.match(/<script[^>]*>[\s\S]*?<\/script>|<script[^>]*\/>/g);
  if (scriptMatch) {
    // Filter out JSON-LD scripts (we'll add our own)
    const jsScripts = scriptMatch.filter(tag => !tag.includes('application/ld+json'));
    scriptTags = jsScripts.join('\n    ');
  }
}

// Generate index.html for home
const homePage = seoConfig.pages.home;
const homeHTML = generateHTML(homePage, linkTags, scriptTags);
fs.writeFileSync(path.join(distDir, 'index.html'), homeHTML);
console.log('✓ Generated: index.html (Home)');

// Generate HTML for each route
Object.entries(seoConfig.pages).forEach(([key, page]) => {
  if (key === 'home') return; // Skip home, already generated
  
  const routeDir = path.join(distDir, page.path);
  
  // Create directory for route
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Generate HTML file
  const html = generateHTML(page, linkTags, scriptTags);
  fs.writeFileSync(path.join(routeDir, 'index.html'), html);
  console.log(`✓ Generated: ${page.path}/index.html`);
});

console.log('\n✅ All HTML files generated successfully!');
console.log('\nThese files now contain static meta tags that will be visible to:');
console.log('  - WhatsApp link previews');
console.log('  - Telegram link previews');
console.log('  - Facebook/Twitter social cards');
console.log('  - Search engine crawlers');
