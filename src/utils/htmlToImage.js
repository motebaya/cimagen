import {
  HTML_SCREEN_PRESETS,
  captureSandboxDocument,
  renderHtmlMarkupCapture,
  renderMarkupToSandbox,
  renderUrlCapture,
  renderFetchedUrlToSandbox,
} from "./html-to-image/index.js";

export { HTML_SCREEN_PRESETS };

export async function renderHtmlMarkupToCanvas(markup, options) {
  const result = await renderHtmlMarkupCapture(markup, options);
  return result.canvas;
}

export async function renderUrlToCanvas(url, options) {
  const result = await renderUrlCapture(url, options);
  return result.canvas;
}

export {
  renderMarkupToSandbox,
  renderFetchedUrlToSandbox,
  captureSandboxDocument,
};
