import { normalizeUrlInput } from "./htmlHelpers.js";

export function validateFetchUrl(input) {
  const normalized = normalizeUrlInput(input);
  if (!normalized) {
    throw new Error("Enter a URL to render.");
  }

  const target = new URL(normalized, window.location.href);
  if (!/^https?:$/i.test(target.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  return target.toString();
}

export async function fetchUrlMarkup(inputUrl) {
  const url = validateFetchUrl(inputUrl);

  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    throw new Error(
      "This URL could not be fetched from the browser. Many external sites block client-side HTML capture with CORS restrictions. Use a CORS-enabled page, same-origin URL, or paste raw HTML instead.",
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch page HTML (${response.status}).`);
  }

  const html = await response.text();
  if (!html.trim()) {
    throw new Error("Fetched URL returned an empty HTML document.");
  }

  return {
    html,
    url: response.url || url,
  };
}
