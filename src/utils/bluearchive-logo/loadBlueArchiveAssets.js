const BASE = import.meta.env.BASE_URL;

let assetsPromise = null;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image asset: ${src}`));
    image.src = src;
  });
}

export function loadBlueArchiveAssets() {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      loadImage(`${BASE}images/bluearchive-logo/halo.png`),
      loadImage(`${BASE}images/bluearchive-logo/cross.png`),
    ]).then(([halo, cross]) => ({ halo, cross }));
  }

  return assetsPromise;
}
