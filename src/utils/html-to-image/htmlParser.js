function absolutizeUrl(value, baseUrl) {
  if (!value || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function rewriteSrcset(value, baseUrl) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [urlPart, descriptor] = entry.split(/\s+/, 2);
      const absolute = absolutizeUrl(urlPart, baseUrl);
      return descriptor ? `${absolute} ${descriptor}` : absolute;
    })
    .join(", ");
}

function rewriteStyleUrls(styleValue, baseUrl) {
  return styleValue.replace(/url\((['"]?)(.*?)\1\)/g, (match, quote, url) => {
    if (!url || url.startsWith("data:") || url.startsWith("blob:")) {
      return match;
    }
    return `url(${quote}${absolutizeUrl(url, baseUrl)}${quote})`;
  });
}

function sanitizeSvgAttributes(element) {
  if (element.tagName !== "svg") {
    return;
  }

  ["width", "height"].forEach((attributeName) => {
    const value = element.getAttribute(attributeName);
    if (value && value.trim().toLowerCase() === "auto") {
      element.removeAttribute(attributeName);
    }
  });
}

function getDocumentDiagnostics(doc, scriptCount) {
  const body = doc.body;
  const normalizedText = body.textContent?.replace(/\s+/g, " ").trim() || "";
  const contentNodeCount = body.querySelectorAll(
    "img,svg,canvas,video,p,h1,h2,h3,h4,h5,h6,section,article,main,table,ul,ol,li,button,a,form",
  ).length;
  const visibleMediaCount = body.querySelectorAll(
    "img,svg,canvas,video",
  ).length;
  const hasAppShell = Boolean(
    body.querySelector(
      "#root, #app, #__next, #__nuxt, [data-reactroot], [id^='gatsby']",
    ),
  );
  const likelyScriptShell =
    hasAppShell &&
    scriptCount > 0 &&
    normalizedText.length < 140 &&
    contentNodeCount <= 4;
  const appearsEmpty =
    normalizedText.length < 24 &&
    visibleMediaCount === 0 &&
    contentNodeCount <= 1;

  return {
    appearsEmpty,
    contentNodeCount,
    hasAppShell,
    likelyScriptShell,
    scriptCount,
    textLength: normalizedText.length,
    visibleMediaCount,
  };
}

function sanitizeElementAttributes(element, baseUrl) {
  sanitizeSvgAttributes(element);

  [...element.attributes].forEach((attribute) => {
    if (/^on/i.test(attribute.name)) {
      element.removeAttribute(attribute.name);
      return;
    }

    if (["src", "href", "poster"].includes(attribute.name)) {
      element.setAttribute(
        attribute.name,
        absolutizeUrl(attribute.value, baseUrl),
      );
      return;
    }

    if (attribute.name === "srcset") {
      element.setAttribute(
        attribute.name,
        rewriteSrcset(attribute.value, baseUrl),
      );
      return;
    }

    if (attribute.name === "style") {
      element.setAttribute(
        attribute.name,
        rewriteStyleUrls(attribute.value, baseUrl),
      );
    }
  });

  if (element.tagName === "IMG") {
    element.setAttribute("loading", "eager");
    element.removeAttribute("srcset");
  }
}

export function buildMarkupDocument(markup, options = {}) {
  if (/<!doctype|<html[\s>]/i.test(markup)) {
    return buildFetchedHtmlDocument(markup, window.location.href).htmlDocument;
  }

  const shellBackground = options.theme === "dark" ? "#0f172a" : "transparent";
  const shellText = options.theme === "dark" ? "#f8fafc" : "inherit";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="${window.location.href}" />
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; min-height: 100%; }
      body {
        background: ${options.fullPage ? "transparent" : shellBackground};
        color: ${shellText};
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      img, svg, canvas, video { max-width: 100%; }
    </style>
  </head>
  <body>
    ${markup}
  </body>
</html>`;
}

export function buildFetchedHtmlDocument(rawHtml, sourceUrl) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(rawHtml, "text/html");
  const scriptCount = parsed.querySelectorAll("script").length;

  parsed
    .querySelectorAll("script, noscript, iframe, object, embed")
    .forEach((node) => {
      node.remove();
    });

  parsed.querySelectorAll("*").forEach((element) => {
    sanitizeElementAttributes(element, sourceUrl);
  });

  let base = parsed.querySelector("base");
  if (!base) {
    base = parsed.createElement("base");
    parsed.head.prepend(base);
  }
  base.setAttribute("href", sourceUrl);

  if (!parsed.querySelector("meta[charset]")) {
    const charset = parsed.createElement("meta");
    charset.setAttribute("charset", "utf-8");
    parsed.head.prepend(charset);
  }

  if (!parsed.querySelector("meta[name='viewport']")) {
    const viewport = parsed.createElement("meta");
    viewport.setAttribute("name", "viewport");
    viewport.setAttribute("content", "width=device-width, initial-scale=1");
    parsed.head.appendChild(viewport);
  }

  const hardeningStyle = parsed.createElement("style");
  hardeningStyle.textContent = `
    html, body { margin: 0; min-height: 100%; }
    img, svg, canvas, video { max-width: 100%; }
  `;
  parsed.head.appendChild(hardeningStyle);

  return {
    diagnostics: getDocumentDiagnostics(parsed, scriptCount),
    htmlDocument: `<!doctype html>\n${parsed.documentElement.outerHTML}`,
  };
}
