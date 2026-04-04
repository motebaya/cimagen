export default function WatermarkTemplatePreview({ template }) {
  if (template.thumbnail) {
    return (
      <div
        className="h-20 overflow-hidden flex items-center justify-center p-2"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <img
          src={template.thumbnail}
          alt={template.label}
          className="max-w-full max-h-full object-contain block"
        />
      </div>
    );
  }

  if (template.type.startsWith("stamp")) {
    const shapeClass =
      template.type === "stamp-circle" || template.type === "stamp-seal"
        ? "rounded-full"
        : template.shape === "rounded"
          ? "rounded-xl"
          : "rounded-md";
    return (
      <div
        className="relative h-20 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div
          className={`px-3 py-2 border-4 ${shapeClass}`}
          style={{
            borderColor: template.stampColor,
            color: template.stampColor,
            transform: `rotate(${template.rotation}deg)`,
          }}
        >
          <span className="text-[10px] font-extrabold tracking-[0.24em]">
            {template.text}
          </span>
        </div>
      </div>
    );
  }

  if (template.type === "social-youtube-button") {
    return (
      <div
        className="h-20 p-3 flex items-center justify-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div
          className="w-full rounded-xl px-3 py-2"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
            border: `1px solid ${template.borderColor}`,
          }}
        >
          <div
            className="h-[2px] border-t border-dashed mb-2"
            style={{ borderColor: template.accentColor }}
          />
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-4 rounded-sm"
              style={{ backgroundColor: template.accentColor }}
            />
            <span
              className="text-[10px] font-bold"
              style={{ color: "#111827" }}
            >
              {template.text}
            </span>
          </div>
          <div
            className="h-[2px] border-t border-dashed mt-2"
            style={{ borderColor: template.accentColor }}
          />
        </div>
      </div>
    );
  }

  if (template.type === "social-twitch") {
    return (
      <div
        className="h-20 p-3 flex items-center justify-center"
        style={{ backgroundColor: "#f5f3ff" }}
      >
        <div className="flex w-full items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-violet-600" />
          <div className="flex-1 rounded-lg bg-slate-100 px-2 py-2 text-[10px] font-semibold text-slate-700">
            {template.text}
          </div>
          <div className="rounded-md bg-violet-600 px-2 py-1 text-[9px] font-bold text-white">
            FOLLOW
          </div>
        </div>
      </div>
    );
  }

  if (template.type === "social-tiktok") {
    return (
      <div
        className="h-20 p-3 flex items-center justify-center"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div
          className="w-full rounded-lg px-3 py-2 border"
          style={{ backgroundColor: "#111827", borderColor: "#22d3ee" }}
        >
          <div className="text-[10px] font-bold text-white">
            {template.text}
          </div>
          <div
            className="mt-1 h-[2px]"
            style={{ background: "linear-gradient(90deg, #22d3ee, #fb7185)" }}
          />
        </div>
      </div>
    );
  }

  if (template.type === "social-instagram") {
    return (
      <div
        className="h-20 p-3 flex items-center justify-center"
        style={{ backgroundColor: "#fff7ed" }}
      >
        <div className="flex w-full items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-300 via-pink-500 to-indigo-500" />
          <div className="flex-1 rounded-lg bg-slate-100 px-2 py-2 text-[10px] font-semibold text-slate-700">
            {template.text}
          </div>
          <div className="rounded-md bg-gradient-to-r from-yellow-300 via-pink-500 to-indigo-500 px-2 py-1 text-[9px] font-bold text-white">
            FOLLOW
          </div>
        </div>
      </div>
    );
  }

  if (template.type === "pattern-watermark") {
    return (
      <div
        className="h-20 overflow-hidden"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div
          className="w-[150%] text-[9px] font-bold tracking-[0.16em] opacity-55"
          style={{
            color: template.textColor,
            transform: `translate(-10px, 18px) rotate(${template.rotation}deg)`,
          }}
        >
          {(template.text + "   ").repeat(8)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-20 p-3 flex items-center justify-center"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div
        className="w-full rounded-xl px-3 py-3 border"
        style={{
          backgroundColor: template.backgroundColor || "#0f172a",
          borderColor:
            template.borderColor || template.accentColor || "#cbd5e1",
          color: template.textColor || "#ffffff",
        }}
      >
        <div className="text-[10px] font-bold truncate">{template.text}</div>
        {template.secondaryText ? (
          <div className="text-[8px] opacity-75 mt-1 truncate">
            {template.secondaryText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
