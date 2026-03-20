/**
 * App Icon Generator Utility
 * Generates Android and iOS app icons with proper directory structure
 */

import JSZip from "jszip";

// Android icon specifications
const ANDROID_SPECS = {
  "mipmap-ldpi": { size: 36, foreground: null },
  "mipmap-mdpi": { size: 48, foreground: 108 },
  "mipmap-hdpi": { size: 72, foreground: 162 },
  "mipmap-xhdpi": { size: 96, foreground: 216 },
  "mipmap-xxhdpi": { size: 144, foreground: 324 },
  "mipmap-xxxhdpi": { size: 192, foreground: 432 },
  playstore: { size: 512, foreground: null },
  web: { size: 512, foreground: null },
};

// iOS icon specifications
const IOS_SPECS = [
  { name: "Icon-App-20x20@1x.png", size: 20 },
  { name: "Icon-App-20x20@2x.png", size: 40 },
  { name: "Icon-App-20x20@3x.png", size: 60 },
  { name: "Icon-App-29x29@1x.png", size: 29 },
  { name: "Icon-App-29x29@2x.png", size: 58 },
  { name: "Icon-App-29x29@3x.png", size: 87 },
  { name: "Icon-App-40x40@1x.png", size: 40 },
  { name: "Icon-App-40x40@2x.png", size: 80 },
  { name: "Icon-App-40x40@3x.png", size: 120 },
  { name: "Icon-App-60x60@2x.png", size: 120 },
  { name: "Icon-App-60x60@3x.png", size: 180 },
  { name: "Icon-App-76x76@1x.png", size: 76 },
  { name: "Icon-App-76x76@2x.png", size: 152 },
  { name: "Icon-App-83.5x83.5@2x.png", size: 167 },
  { name: "ItunesArtwork@2x.png", size: 1024 },
];

/**
 * Generate icon with zoom and background
 */
function generateIcon(sourceCanvas, size, zoom, backgroundColor, badge = null) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Fill background (handle transparent)
  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  // Calculate scaled dimensions
  const scale = zoom;
  const scaledSize = size * scale;
  const offset = (size - scaledSize) / 2;

  // Draw image
  ctx.drawImage(sourceCanvas, offset, offset, scaledSize, scaledSize);

  // Draw badge if provided
  if (badge && badge.enabled && badge.text) {
    drawBadge(ctx, size, badge);
  }

  return canvas;
}

/**
 * Draw badge overlay as horizontal strip below icon
 */
function drawBadge(ctx, size, badge) {
  const badgeHeight = size * 0.12; // 12% of icon height
  const y = size - badgeHeight;

  // Badge strip
  ctx.fillStyle = badge.color;
  ctx.fillRect(0, y, size, badgeHeight);

  // Badge text
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${badgeHeight * 0.5}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badge.text, size / 2, y + badgeHeight / 2);
}

/**
 * Generate round icon (Android)
 */
function generateRoundIcon(sourceCanvas, size, zoom, backgroundColor, badge) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Create circular clip for the entire icon including badge
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Calculate scaled dimensions
  const scale = zoom;
  const scaledSize = size * scale;
  const offset = (size - scaledSize) / 2;

  // Draw image
  ctx.drawImage(sourceCanvas, offset, offset, scaledSize, scaledSize);

  // Draw badge INSIDE the clip so it's also rounded
  if (badge && badge.enabled && badge.text) {
    drawBadge(ctx, size, badge);
  }

  // Restore context
  ctx.restore();

  return canvas;
}

/**
 * Generate Android XML files
 */
function generateAndroidXML(iconName, backgroundColor) {
  const hexColor = backgroundColor.startsWith("#")
    ? backgroundColor
    : "#" + backgroundColor;

  const launcherXML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/${iconName}_foreground"/>
</adaptive-icon>`;

  const backgroundXML = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${hexColor}</color>
</resources>`;

  return { launcherXML, backgroundXML };
}

/**
 * Generate iOS Contents.json
 */
function generateIOSContentsJSON() {
  return {
    images: [
      {
        size: "20x20",
        idiom: "iphone",
        filename: "Icon-App-20x20@2x.png",
        scale: "2x",
      },
      {
        size: "20x20",
        idiom: "iphone",
        filename: "Icon-App-20x20@3x.png",
        scale: "3x",
      },
      {
        size: "29x29",
        idiom: "iphone",
        filename: "Icon-App-29x29@1x.png",
        scale: "1x",
      },
      {
        size: "29x29",
        idiom: "iphone",
        filename: "Icon-App-29x29@2x.png",
        scale: "2x",
      },
      {
        size: "29x29",
        idiom: "iphone",
        filename: "Icon-App-29x29@3x.png",
        scale: "3x",
      },
      {
        size: "40x40",
        idiom: "iphone",
        filename: "Icon-App-40x40@2x.png",
        scale: "2x",
      },
      {
        size: "40x40",
        idiom: "iphone",
        filename: "Icon-App-40x40@3x.png",
        scale: "3x",
      },
      {
        size: "60x60",
        idiom: "iphone",
        filename: "Icon-App-60x60@2x.png",
        scale: "2x",
      },
      {
        size: "60x60",
        idiom: "iphone",
        filename: "Icon-App-60x60@3x.png",
        scale: "3x",
      },
      {
        size: "20x20",
        idiom: "ipad",
        filename: "Icon-App-20x20@1x.png",
        scale: "1x",
      },
      {
        size: "20x20",
        idiom: "ipad",
        filename: "Icon-App-20x20@2x.png",
        scale: "2x",
      },
      {
        size: "29x29",
        idiom: "ipad",
        filename: "Icon-App-29x29@1x.png",
        scale: "1x",
      },
      {
        size: "29x29",
        idiom: "ipad",
        filename: "Icon-App-29x29@2x.png",
        scale: "2x",
      },
      {
        size: "40x40",
        idiom: "ipad",
        filename: "Icon-App-40x40@1x.png",
        scale: "1x",
      },
      {
        size: "40x40",
        idiom: "ipad",
        filename: "Icon-App-40x40@2x.png",
        scale: "2x",
      },
      {
        size: "76x76",
        idiom: "ipad",
        filename: "Icon-App-76x76@1x.png",
        scale: "1x",
      },
      {
        size: "76x76",
        idiom: "ipad",
        filename: "Icon-App-76x76@2x.png",
        scale: "2x",
      },
      {
        size: "83.5x83.5",
        idiom: "ipad",
        filename: "Icon-App-83.5x83.5@2x.png",
        scale: "2x",
      },
      {
        size: "1024x1024",
        idiom: "ios-marketing",
        filename: "ItunesArtwork@2x.png",
        scale: "1x",
      },
    ],
    info: { version: 1, author: "cimagen" },
  };
}

/**
 * Generate all app icons and create ZIP
 */
export async function generateAppIcons(sourceCanvas, options = {}) {
  const {
    zoom = 1.0,
    backgroundColor = "#ffffff",
    androidName = "ic_launcher",
    badge = null,
  } = options;

  const zip = new JSZip();

  // Generate Android icons
  const androidFolder = zip.folder("android");

  // Generate for each density
  for (const [density, spec] of Object.entries(ANDROID_SPECS)) {
    const folderName = density.startsWith("mipmap") ? density : null;
    const folder = folderName
      ? androidFolder.folder(folderName)
      : androidFolder;

    if (density === "playstore") {
      const canvas = generateIcon(
        sourceCanvas,
        spec.size,
        zoom,
        backgroundColor,
        badge,
      );
      const blob = await canvasToBlob(canvas);
      androidFolder.file("playstore-icon.png", blob);
    } else if (density === "web") {
      const canvas = generateIcon(
        sourceCanvas,
        spec.size,
        zoom,
        backgroundColor,
        badge,
      );
      const blob = await canvasToBlob(canvas);
      androidFolder.file(`${androidName}-web.png`, blob);
    } else {
      // Regular icon
      const canvas = generateIcon(
        sourceCanvas,
        spec.size,
        zoom,
        backgroundColor,
        badge,
      );
      const blob = await canvasToBlob(canvas);
      folder.file(`${androidName}.png`, blob);

      // Round icon
      const roundCanvas = generateRoundIcon(
        sourceCanvas,
        spec.size,
        zoom,
        backgroundColor,
        badge,
      );
      const roundBlob = await canvasToBlob(roundCanvas);
      folder.file(`${androidName}_round.png`, roundBlob);

      // Foreground (adaptive icon)
      if (spec.foreground) {
        const fgCanvas = generateIcon(
          sourceCanvas,
          spec.foreground,
          zoom,
          "transparent",
          badge,
        );
        const fgBlob = await canvasToBlob(fgCanvas);
        folder.file(`${androidName}_foreground.png`, fgBlob);
      }
    }
  }

  // Generate Android XML files
  const { launcherXML, backgroundXML } = generateAndroidXML(
    androidName,
    backgroundColor,
  );
  const anydpiFolder = androidFolder.folder("mipmap-anydpi-v26");
  anydpiFolder.file(`${androidName}.xml`, launcherXML);
  anydpiFolder.file(`${androidName}_round.xml`, launcherXML);

  const valuesFolder = androidFolder.folder("values");
  valuesFolder.file("ic_launcher_background.xml", backgroundXML);

  // Generate iOS icons
  const iosFolder = zip.folder("ios");
  const appiconsetFolder = iosFolder.folder("AppIcon.appiconset");

  for (const spec of IOS_SPECS) {
    const canvas = generateIcon(
      sourceCanvas,
      spec.size,
      zoom,
      backgroundColor,
      badge,
    );
    const blob = await canvasToBlob(canvas);
    appiconsetFolder.file(spec.name, blob);
  }

  // Additional iOS icons
  const ios1024 = generateIcon(
    sourceCanvas,
    1024,
    zoom,
    backgroundColor,
    badge,
  );
  const ios2048 = generateIcon(
    sourceCanvas,
    2048,
    zoom,
    backgroundColor,
    badge,
  );
  const ios3072 = generateIcon(
    sourceCanvas,
    3072,
    zoom,
    backgroundColor,
    badge,
  );

  iosFolder.file("iTunesArtwork@1x.png", await canvasToBlob(ios1024));
  iosFolder.file("iTunesArtwork@2x.png", await canvasToBlob(ios2048));
  iosFolder.file("iTunesArtwork@3x.png", await canvasToBlob(ios3072));

  // Contents.json
  const contentsJSON = generateIOSContentsJSON();
  appiconsetFolder.file("Contents.json", JSON.stringify(contentsJSON, null, 2));

  // Generate ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}

/**
 * Helper to convert canvas to blob
 */
function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

/**
 * Generate preview icons for UI
 */
export function generatePreviewIcons(
  sourceCanvas,
  zoom,
  backgroundColor,
  badge,
) {
  const round = generateRoundIcon(
    sourceCanvas,
    192,
    zoom,
    backgroundColor,
    badge,
  );
  const squircle = generateIcon(
    sourceCanvas,
    192,
    zoom,
    backgroundColor,
    badge,
  );
  const legacy = generateIcon(sourceCanvas, 192, zoom, backgroundColor, badge);

  return { round, squircle, legacy };
}
