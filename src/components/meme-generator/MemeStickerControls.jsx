export default function MemeStickerControls({ layer, onUpdateLayer }) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        Sticker / Emoji
      </label>
      <input
        type="text"
        value={layer.text}
        onChange={(event) =>
          onUpdateLayer(layer.id, { text: event.target.value })
        }
        className="w-full px-3 py-2 rounded-lg border outline-none"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--input-bg)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}
