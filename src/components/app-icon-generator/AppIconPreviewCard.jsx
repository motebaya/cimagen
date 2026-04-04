import { Apple, ImageIcon, Smartphone } from "lucide-react";
import CreatorPreviewHeader from "../creator/CreatorPreviewHeader.jsx";

const hiddenInputStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const BASE = import.meta.env.BASE_URL;

const iconVariantCards = [
  {
    key: "round",
    label: "Round",
    canvasClassName: "block w-full h-auto rounded-full",
    wrapperClassName: "w-full max-w-[80px] sm:max-w-[96px] mx-auto",
    style: { border: "1px solid var(--border-color)" },
  },
  {
    key: "squircle",
    label: "Squircle",
    canvasClassName: "block w-full h-auto",
    wrapperClassName: "w-full max-w-[80px] sm:max-w-[96px] mx-auto",
    style: {
      border: "1px solid var(--border-color)",
      borderRadius: "20%",
    },
  },
  {
    key: "legacy",
    label: "Legacy",
    canvasClassName: "block w-full h-auto rounded-lg",
    wrapperClassName: "w-full max-w-[80px] sm:max-w-[96px] mx-auto",
    style: { border: "1px solid var(--border-color)" },
  },
];

const devicePreviewCards = [
  {
    key: "android",
    label: "Android",
    frameSrc: `${BASE}images/android_preview.png`,
    iconKey: "round",
    iconRadius: "50%",
    DeviceIcon: Smartphone,
  },
  {
    key: "iphone",
    label: "iPhone",
    frameSrc: `${BASE}images/iphone_preview.png`,
    iconKey: "squircle",
    iconRadius: "20%",
    DeviceIcon: Apple,
  },
];

function drawCanvasPreview(element, canvas, size) {
  if (!element || !canvas) {
    return;
  }

  element.width = size;
  element.height = size;

  const context = element.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, size, size);
  context.drawImage(canvas, 0, 0, size, size);
}

function PreviewCanvas({ canvas, className, size, style }) {
  return (
    <canvas
      ref={(element) => drawCanvasPreview(element, canvas, size)}
      className={className}
      style={style}
    />
  );
}

function DevicePreviewCard({ appName, device }) {
  const label = appName.trim();
  const DeviceIcon = device.DeviceIcon;

  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="relative w-full max-w-[240px] mx-auto">
        <img
          src={device.frameSrc}
          alt={`${device.label} preview`}
          className="block w-full h-auto"
        />

        {device.canvas ? (
          <div
            className="absolute flex flex-col items-center gap-1.5"
            style={{
              left: "20%",
              bottom: "70%",
              transform: "translateX(-50%)",
              width: "22%",
            }}
          >
            <PreviewCanvas
              canvas={device.canvas}
              size={96}
              className="block w-full h-auto"
              style={{
                borderRadius: device.iconRadius,
                boxShadow: "0 8px 16px rgba(15, 23, 42, 0.18)",
              }}
            />

            {label ? (
              <span
                className="block text-[11px] font-medium leading-tight text-center"
                style={{
                  color: "#ffffff",
                  maxWidth: "92px",
                  textShadow: "0 1px 3px rgba(15, 23, 42, 0.55)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-1 mt-2">
        <DeviceIcon size={12} style={{ color: "var(--text-tertiary)" }} />
        <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
          {device.label}
        </p>
      </div>
    </div>
  );
}

export default function AppIconPreviewCard({
  appName,
  fileInputRef,
  hasImage,
  imageFilename,
  inputAccept,
  onDragLeave,
  onDragOver,
  onDrop,
  onImageInputChange,
  onOpenImagePicker,
  onRemoveImage,
  previewIcons,
}) {
  const devicePreviews = devicePreviewCards.map((device) => ({
    ...device,
    canvas: previewIcons?.[device.iconKey] || null,
  }));

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-color)",
        boxShadow: "var(--card-shadow)",
        backgroundColor: "var(--card-bg)",
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        style={hiddenInputStyle}
        onChange={onImageInputChange}
      />

      <CreatorPreviewHeader
        fileLabel={hasImage ? imageFilename : "app-icon-preview"}
        hasReplace={hasImage}
        onOpenPicker={onOpenImagePicker}
        onRemove={onRemoveImage}
      />

      {hasImage ? (
        <div
          className="p-4 space-y-4"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          {previewIcons ? (
            <>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Icon Variants
                </label>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {iconVariantCards.map((variant) => (
                    <div key={variant.key} className="text-center min-w-0">
                      <div className={variant.wrapperClassName}>
                        <PreviewCanvas
                          canvas={previewIcons[variant.key]}
                          size={192}
                          className={variant.canvasClassName}
                          style={variant.style}
                        />
                      </div>
                      <p
                        className="text-xs mt-2 m-0"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {variant.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Device Preview
                </label>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {devicePreviews.map((device) => (
                    <DevicePreviewCard
                      key={device.key}
                      appName={appName}
                      device={device}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenImagePicker}
          className="w-full flex flex-col items-center justify-center py-24 border-none cursor-pointer"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "inherit" }}
        >
          <ImageIcon
            size={48}
            style={{ color: "var(--text-tertiary)" }}
            className="mb-3 opacity-40"
          />
          <p className="text-sm m-0" style={{ color: "var(--text-tertiary)" }}>
            Upload an image to see preview
          </p>
        </button>
      )}
    </div>
  );
}
