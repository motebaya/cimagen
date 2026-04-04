import { Helmet } from "react-helmet-async";
import { seoConfig, generateStructuredData } from "../config/seo.js";

export default function SEO({
  pageKey = "home",
  customTitle,
  customDescription,
}) {
  const page = seoConfig.pages[pageKey] || seoConfig.pages.home;
  const title = customTitle || page.title;
  const description = customDescription || page.description;
  const url = `${seoConfig.siteUrl}${pageKey === "home" ? "" : `/${pageKey}`}`;
  const imageUrl = page.image
    ? `${seoConfig.siteUrl}${page.image}`
    : `${seoConfig.siteUrl}${seoConfig.defaultImage}`;
  const structuredData = generateStructuredData(pageKey);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={page.keywords} />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="alternate icon" href="/favicon.ico" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      <meta property="twitter:creator" content={seoConfig.twitterHandle} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="CimaGen" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
