import { buildFetchedHtmlDocument, buildMarkupDocument } from "./htmlParser.js";
import { fetchUrlMarkup } from "./htmlFetcher.js";
import { wait } from "./htmlHelpers.js";
import { captureSandboxDocument } from "./htmlToCanvas.js";

function createHiddenIframe(width, height) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.setAttribute("sandbox", "allow-same-origin");
  document.body.appendChild(iframe);
  return iframe;
}

function getRenderabilityErrorMessage(diagnostics) {
  if (diagnostics?.likelyScriptShell) {
    return "This URL appears to rely on client-side JavaScript after load. In a static browser-only capture flow, the fetched HTML is mostly an empty app shell, so there is no real page content to render. Use pasted HTML or a server-rendered/CORS-enabled page instead.";
  }

  if (diagnostics?.appearsEmpty) {
    return "The fetched page does not contain enough static HTML content to render a meaningful preview. Try a simpler page, a same-origin document, or paste raw HTML instead.";
  }

  return null;
}

async function waitForImages(doc, timeoutMs = 1400) {
  const images = [...doc.images].filter((image) => !image.complete);
  if (!images.length) {
    return;
  }

  await Promise.race([
    Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
      ),
    ),
    wait(timeoutMs),
  ]);
}

function toAssetIssue(type, url, reason) {
  return { type, url, reason };
}

async function collectAssetIssues(doc, timeoutMs = 1600) {
  const issues = [];
  const pendingAssets = [];

  [...doc.images].forEach((image) => {
    const url = image.currentSrc || image.src || "Image asset";

    if (image.complete) {
      if (!image.naturalWidth) {
        issues.push(toAssetIssue("image", url, "failed"));
      }
      return;
    }

    pendingAssets.push(
      Promise.race([
        new Promise((resolve) => {
          image.addEventListener("load", () => resolve(null), { once: true });
          image.addEventListener(
            "error",
            () => resolve(toAssetIssue("image", url, "failed")),
            { once: true },
          );
        }),
        wait(timeoutMs).then(() => toAssetIssue("image", url, "timeout")),
      ]),
    );
  });

  [...doc.querySelectorAll("link[rel~='stylesheet']")].forEach((link) => {
    const url = link.href || "Stylesheet asset";

    if (link.sheet) {
      return;
    }

    pendingAssets.push(
      Promise.race([
        new Promise((resolve) => {
          link.addEventListener("load", () => resolve(null), { once: true });
          link.addEventListener(
            "error",
            () => resolve(toAssetIssue("stylesheet", url, "failed")),
            { once: true },
          );
        }),
        wait(timeoutMs).then(() => toAssetIssue("stylesheet", url, "timeout")),
      ]),
    );
  });

  const settled = await Promise.all(pendingAssets);
  settled.forEach((entry) => {
    if (entry) {
      issues.push(entry);
    }
  });

  return issues;
}

async function mountDocument(iframe, htmlDocument) {
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(htmlDocument);
  doc.close();
  await new Promise((resolve) => {
    if (doc.readyState === "complete") {
      resolve();
      return;
    }
    iframe.onload = () => resolve();
    setTimeout(resolve, 80);
  });
  return doc;
}

export async function renderMarkupToSandbox(markup, options) {
  const iframe = createHiddenIframe(options.width, options.height);

  try {
    const htmlDocument = buildMarkupDocument(markup, options);
    const doc = await mountDocument(iframe, htmlDocument);
    await wait(options.delay || 120);
    await waitForImages(doc);
    const assetIssues = await collectAssetIssues(doc);
    return { iframe, doc, sourceType: "markup", assetIssues };
  } catch (error) {
    iframe.remove();
    throw error;
  }
}

export async function renderFetchedUrlToSandbox(url, options) {
  const iframe = createHiddenIframe(options.width, options.height);

  try {
    const fetched = await fetchUrlMarkup(url);
    const parsed = buildFetchedHtmlDocument(fetched.html, fetched.url);
    const renderabilityError = getRenderabilityErrorMessage(parsed.diagnostics);
    if (renderabilityError) {
      throw new Error(renderabilityError);
    }

    const htmlDocument = parsed.htmlDocument;
    const doc = await mountDocument(iframe, htmlDocument);
    await wait(options.delay || 160);
    await waitForImages(doc, 1800);
    const assetIssues = await collectAssetIssues(doc, 2200);
    return {
      diagnostics: parsed.diagnostics,
      iframe,
      doc,
      assetIssues,
      fetchedUrl: fetched.url,
      sourceType: "url",
    };
  } catch (error) {
    iframe.remove();
    throw error;
  }
}

export async function renderHtmlMarkupCapture(markup, options) {
  const sandbox = await renderMarkupToSandbox(markup, options);

  try {
    const capture = await captureSandboxDocument(sandbox.doc, options);
    return {
      ...capture,
      assetIssues: sandbox.assetIssues || [],
      sourceType: sandbox.sourceType,
    };
  } finally {
    sandbox.iframe.remove();
  }
}

export async function renderUrlCapture(url, options) {
  const sandbox = await renderFetchedUrlToSandbox(url, options);

  try {
    const capture = await captureSandboxDocument(sandbox.doc, options);
    return {
      ...capture,
      assetIssues: sandbox.assetIssues || [],
      fetchedUrl: sandbox.fetchedUrl,
      sourceType: sandbox.sourceType,
    };
  } finally {
    sandbox.iframe.remove();
  }
}
