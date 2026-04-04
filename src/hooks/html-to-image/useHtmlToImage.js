import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_HTML_TO_IMAGE_SETTINGS,
  EXPORT_FORMATS,
  SAMPLE_HTML_PATH,
  SOURCE_MODE_OPTIONS,
  THEME_OPTIONS,
  VIEWPORT_HEIGHT_OPTIONS,
  VIEWPORT_WIDTH_OPTIONS,
} from "../../utils/html-to-image/htmlConstants.js";
import {
  drawCanvasSurface,
  loadSampleMarkup,
} from "../../utils/html-to-image/index.js";
import useHtmlExport from "./useHtmlExport.js";
import useHtmlRenderer from "./useHtmlRenderer.js";
import useHtmlViewport from "./useHtmlViewport.js";

const FALLBACK_SAMPLE = `<section style="padding:48px;background:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;"><div style="max-width:840px;margin:0 auto;padding:32px;border-radius:24px;background:#ffffff;border:1px solid #e2e8f0;"><h1 style="margin:0 0 12px;color:#0f172a;font-size:42px;line-height:1.05;">HTML capture sample</h1><p style="margin:0;color:#64748b;font-size:18px;line-height:1.7;">This fallback sample is shown when the static sample file cannot be loaded.</p></div></section>`;

export default function useHtmlToImage() {
  const [sourceMode, setSourceMode] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.sourceMode,
  );
  const [markup, setMarkup] = useState("");
  const [sampleMarkup, setSampleMarkup] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [scaleFactor, setScaleFactor] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.scaleFactor,
  );
  const [delay, setDelay] = useState(DEFAULT_HTML_TO_IMAGE_SETTINGS.delay);
  const [padding, setPadding] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.padding,
  );
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.backgroundColor,
  );
  const [theme, setTheme] = useState(DEFAULT_HTML_TO_IMAGE_SETTINGS.theme);
  const [deviceFrame, setDeviceFrame] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.deviceFrame,
  );
  const [shadow, setShadow] = useState(DEFAULT_HTML_TO_IMAGE_SETTINGS.shadow);
  const [fullPage, setFullPage] = useState(
    DEFAULT_HTML_TO_IMAGE_SETTINGS.fullPage,
  );
  const previewCanvasRef = useRef(null);

  const viewport = useHtmlViewport();
  const { exportCapture } = useHtmlExport();

  useEffect(() => {
    let active = true;

    loadSampleMarkup(SAMPLE_HTML_PATH)
      .then((sample) => {
        if (!active) return;
        setSampleMarkup(sample.trim());
        setMarkup(sample.trim());
      })
      .catch((error) => {
        console.error(error);
        if (!active) return;
        setSampleMarkup(FALLBACK_SAMPLE);
        setMarkup(FALLBACK_SAMPLE);
      });

    return () => {
      active = false;
    };
  }, []);

  const renderOptions = useMemo(
    () => ({
      width: viewport.viewportWidth,
      height: viewport.viewportHeight,
      scaleFactor,
      delay,
      padding,
      backgroundColor,
      theme,
      deviceFrame,
      shadow,
      fullPage,
    }),
    [
      backgroundColor,
      delay,
      deviceFrame,
      fullPage,
      padding,
      scaleFactor,
      shadow,
      theme,
      viewport.viewportHeight,
      viewport.viewportWidth,
    ],
  );

  const renderer = useHtmlRenderer({
    sourceMode,
    markup,
    urlInput,
    renderOptions,
  });

  useEffect(() => {
    if (!renderer.result?.canvas) {
      return;
    }

    drawCanvasSurface(previewCanvasRef.current, renderer.result.canvas);
  }, [renderer.result]);

  const exportMetadata = useMemo(() => {
    const canvas = renderer.result?.canvas;
    const metadata = [
      ["Image size", canvas ? `${canvas.width} x ${canvas.height}` : "-"],
      [
        "Viewport",
        `${renderer.result?.viewportWidth || viewport.viewportWidth} x ${renderer.result?.viewportHeight || viewport.viewportHeight}`,
      ],
      ["Capture", fullPage ? "Full page" : "Presentation"],
      ["Scale", `${scaleFactor}x`],
    ];

    if (renderer.result?.sourceMode === "url") {
      metadata.push(["Source", "Reconstructed from URL"]);
    }

    return metadata;
  }, [
    fullPage,
    renderer.result,
    scaleFactor,
    viewport.viewportHeight,
    viewport.viewportWidth,
  ]);

  const assetIssueNotice = useMemo(() => {
    const issues = renderer.result?.assetIssues || [];
    if (!issues.length) {
      return null;
    }

    const imageIssues = issues.filter((issue) => issue.type === "image").length;
    const stylesheetIssues = issues.filter(
      (issue) => issue.type === "stylesheet",
    ).length;
    const segments = [];

    if (imageIssues) {
      segments.push(`${imageIssues} image${imageIssues > 1 ? "s" : ""}`);
    }
    if (stylesheetIssues) {
      segments.push(
        `${stylesheetIssues} stylesheet${stylesheetIssues > 1 ? "s" : ""}`,
      );
    }

    const firstIssue = issues[0];
    const firstIssueUrl = firstIssue?.url
      ? firstIssue.url.length > 96
        ? `${firstIssue.url.slice(0, 93)}...`
        : firstIssue.url
      : null;

    return `Asset load issues detected: ${segments.join(" and ")}. The preview may not fully match the original page.${firstIssueUrl ? ` First failed asset: ${firstIssueUrl}` : ""}`;
  }, [renderer.result?.assetIssues]);

  return {
    error: renderer.error,
    previewCard: {
      canvasRef: previewCanvasRef,
      capturedCanvas: renderer.result?.canvas || null,
      isRendering: renderer.isRendering,
    },
    exportCard: {
      assetIssueNotice,
      capturedCanvas: renderer.result?.canvas || null,
      exportFormats: EXPORT_FORMATS,
      metadata: exportMetadata,
      onExport: (format) =>
        exportCapture(renderer.result?.canvas || null, format),
    },
    settingsCard: {
      backgroundColor,
      customHeight: viewport.customHeight,
      customWidth: viewport.customWidth,
      delay,
      deviceFrame,
      fullPage,
      heightOptions: VIEWPORT_HEIGHT_OPTIONS,
      heightPreset: viewport.heightPreset,
      loadSampleDisabled: !sampleMarkup,
      markup,
      onBackgroundColorChange: setBackgroundColor,
      onCustomHeightChange: viewport.setCustomHeight,
      onCustomWidthChange: viewport.setCustomWidth,
      onDelayChange: setDelay,
      onDeviceFrameChange: setDeviceFrame,
      onFullPageChange: setFullPage,
      onHeightPresetChange: viewport.setHeightPreset,
      onLoadSample: () => {
        if (sampleMarkup) setMarkup(sampleMarkup);
      },
      onMarkupChange: setMarkup,
      onModeChange: setSourceMode,
      onPaddingChange: setPadding,
      onResetSample: () => {
        if (sampleMarkup) {
          setSourceMode("html");
          setMarkup(sampleMarkup);
        }
      },
      onScaleFactorChange: setScaleFactor,
      onShadowChange: setShadow,
      onThemeChange: setTheme,
      onUrlChange: setUrlInput,
      onWidthPresetChange: viewport.setWidthPreset,
      padding,
      scaleFactor,
      shadow,
      sourceMode,
      sourceModes: SOURCE_MODE_OPTIONS,
      theme,
      themeOptions: THEME_OPTIONS,
      urlInput,
      widthOptions: VIEWPORT_WIDTH_OPTIONS,
      widthPreset: viewport.widthPreset,
    },
  };
}
