/**
 * SEO metadata configuration for all pages
 */

export const seoConfig = {
  siteName: 'CimaGen - Professional Image Generator & Editor',
  siteUrl: 'https://cimagen.com',
  basePath: '/cimagen',
  defaultImage: '/cimagen/images/sample-thumbnail.webp',
  twitterHandle: '@cimagen',
  
  pages: {
    home: {
      title: 'CimaGen - Free Online Image Generator & Editor Tools',
      description: 'Create stunning images with our free online tools. Generate thumbnails, memes, logos, convert images to PDF, ICO, SVG, and more. Professional image editing made easy.',
      keywords: 'image generator, online image editor, thumbnail creator, meme generator, image converter, PDF converter, ICO converter, SVG converter, OCR reader, image tools',
      image: '/cimagen/images/sample-thumbnail.webp',
    },
    
    thumbnailCreator: {
      title: 'YouTube Thumbnail Creator - Free Online Tool | CimaGen',
      description: 'Create eye-catching YouTube thumbnails instantly. Professional thumbnail maker with customizable text, colors, and effects. Download in high quality for free.',
      keywords: 'youtube thumbnail creator, thumbnail maker, video thumbnail generator, custom thumbnails, youtube thumbnail design',
      image: '/cimagen/images/sample-thumbnail.webp',
    },
    
    statisticFrameCreator: {
      title: 'Statistics Frame Creator - Add Stats to Images | CimaGen',
      description: 'Add professional statistics frames to your images. Perfect for social media posts, presentations, and infographics. Customize colors, fonts, and layouts.',
      keywords: 'statistics frame, data visualization, infographic creator, stats overlay, image statistics',
      image: '/cimagen/images/sample-statistic.webp',
    },
    
    duotoneCreator: {
      title: 'Duotone Image Creator - Two-Tone Photo Effect | CimaGen',
      description: 'Transform photos into stunning duotone images. Apply two-color effects with customizable color schemes. Create artistic duotone photos instantly.',
      keywords: 'duotone creator, two tone effect, duotone filter, photo effects, color grading',
      image: '/cimagen/images/sample-duotone.webp',
    },
    
    metadataViewer: {
      title: 'Image Metadata Viewer - EXIF Data Reader | CimaGen',
      description: 'View and analyze image metadata and EXIF data. Extract camera settings, GPS location, timestamps, and technical details from photos.',
      keywords: 'exif viewer, metadata reader, image information, photo data, camera settings',
      image: '/cimagen/images/sample-metadata.webp',
    },
    
    blackpinkCreator: {
      title: 'BLACKPINK Logo Maker - K-pop Style Text Generator | CimaGen',
      description: 'Create BLACKPINK-style logos and text designs. Generate K-pop inspired graphics with signature pink and black aesthetics.',
      keywords: 'blackpink logo, kpop logo maker, blackpink text generator, kpop graphics, blackpink style',
      image: '/cimagen/images/sample-blackpink.webp',
    },
    
    wastedCreator: {
      title: 'GTA Wasted Effect Generator - Meme Creator | CimaGen',
      description: 'Add the iconic GTA "Wasted" effect to your images. Create viral memes with the classic Grand Theft Auto game over screen.',
      keywords: 'wasted meme generator, gta wasted effect, game over meme, gta meme maker, wasted screen',
      image: '/cimagen/images/sample-wasted.webp',
    },
    
    phLogoCreator: {
      title: 'PH Logo Style Generator - Orange Box Logo Maker | CimaGen',
      description: 'Create logos in the iconic orange and black style. Generate professional-looking logos with customizable text and colors.',
      keywords: 'ph logo maker, orange logo generator, logo creator, brand logo, custom logo design',
      image: '/cimagen/images/sample-phlogo.webp',
    },
    
    paperWriterCreator: {
      title: 'Handwritten Text Generator - Paper Note Creator | CimaGen',
      description: 'Generate realistic handwritten text on paper. Create authentic-looking handwritten notes and messages digitally.',
      keywords: 'handwriting generator, paper note creator, handwritten text, digital handwriting, note maker',
      image: '/cimagen/images/sample-handwritten.webp',
    },
    
    pokemonCardCreator: {
      title: 'Pokemon Card Creator - Custom Trading Card Maker | CimaGen',
      description: 'Design custom Pokemon trading cards. Create personalized Pokemon cards with custom stats, images, and abilities.',
      keywords: 'pokemon card maker, custom pokemon cards, trading card creator, pokemon card generator, tcg creator',
      image: '/cimagen/images/sample-pokemoncard.webp',
    },
    
    icoConverter: {
      title: 'Image to ICO Converter - Favicon Generator | CimaGen',
      description: 'Convert images to ICO format for favicons and Windows icons. Generate multiple sizes (16x16 to 256x256) in one click.',
      keywords: 'ico converter, favicon generator, image to ico, icon creator, favicon maker, windows icon',
      image: '/cimagen/images/sample-imagetoico.webp',
    },
    
    pdfConverter: {
      title: 'Image to PDF Converter - Multi-Page PDF Creator | CimaGen',
      description: 'Convert multiple images to PDF documents. Combine images into a single PDF with customizable page size, orientation, and layout.',
      keywords: 'image to pdf, pdf converter, images to pdf, pdf creator, combine images pdf, multi-page pdf',
      image: '/cimagen/images/sample-imagetopdf.webp',
    },
    
    svgConverter: {
      title: 'Image to SVG Converter - Vector Graphics Generator | CimaGen',
      description: 'Convert raster images to scalable SVG vector graphics. Transform photos and logos into resolution-independent SVG format.',
      keywords: 'image to svg, svg converter, vectorize image, raster to vector, svg generator, vector graphics',
      image: '/cimagen/images/sample-imagetosvg.webp',
    },
    
    lowResGenerator: {
      title: 'Low Resolution Image Generator - Image Degradation Tool | CimaGen',
      description: 'Simulate low-resolution images with realistic degradation effects. Create pixelated, compressed, and low-quality image versions.',
      keywords: 'low resolution generator, image degradation, pixelate image, compress image, low quality image',
      image: '/cimagen/images/sample-lowress.webp',
    },
    
    ocrReader: {
      title: 'Image OCR Reader - Extract Text from Images | CimaGen',
      description: 'Extract text from images using advanced OCR technology. Convert image text to editable text in multiple languages.',
      keywords: 'ocr reader, text extraction, image to text, ocr online, text recognition, image text reader',
      image: '/cimagen/images/sample-imageocr.webp',
    },
    
    appIconGenerator: {
      title: 'App Icon Generator - Android & iOS Icons | CimaGen',
      description: 'Generate professional Android and iOS app icons instantly. Create all required icon sizes with proper directory structure. Supports adaptive icons, badges, and custom backgrounds.',
      keywords: 'app icon generator, android icon maker, ios icon creator, app icon design, adaptive icons, mobile app icons, icon generator',
      image: '/cimagen/images/sample-appicons.webp',
    },
  },
};

/**
 * Generate structured data for SEO
 */
export function generateStructuredData(pageKey) {
  const page = seoConfig.pages[pageKey];
  if (!page) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.title,
    description: page.description,
    url: `${seoConfig.siteUrl}${pageKey === 'home' ? '' : `/${pageKey}`}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'CimaGen',
      url: seoConfig.siteUrl,
    },
  };
}
