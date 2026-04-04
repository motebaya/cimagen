export default function PaletteImageOverlay({ overlay, selectedColor }) {
  if (!overlay || !selectedColor) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {overlay.bounds && (
        <div
          className="absolute rounded-xl border-2"
          style={{
            left: `${overlay.bounds.x * 100}%`,
            top: `${overlay.bounds.y * 100}%`,
            width: `${overlay.bounds.width * 100}%`,
            height: `${overlay.bounds.height * 100}%`,
            borderColor: selectedColor.hex,
            boxShadow: `0 0 0 2px ${selectedColor.hex}33 inset`,
            backgroundColor: `${selectedColor.hex}14`,
          }}
        />
      )}

      {overlay.hotspots.map((hotspot, index) => (
        <div
          key={`${selectedColor.id}-hotspot-${index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            left: `${hotspot.nx * 100}%`,
            top: `${hotspot.ny * 100}%`,
            width: `${18 + Math.min(18, hotspot.weight * 1.5)}px`,
            height: `${18 + Math.min(18, hotspot.weight * 1.5)}px`,
            borderColor: selectedColor.hex,
            backgroundColor: `${selectedColor.hex}33`,
            boxShadow: `0 0 0 3px ${selectedColor.hex}22`,
          }}
        />
      ))}

      <div
        className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-[11px] font-medium"
        style={{
          backgroundColor: "rgba(15,23,42,0.72)",
          color: "#ffffff",
        }}
      >
        {selectedColor.hex} highlighted in image
      </div>

      <div
        className="absolute top-3 left-3 px-2 py-1 rounded-md text-[11px] font-medium"
        style={{
          backgroundColor: "rgba(15,23,42,0.72)",
          color: "#ffffff",
        }}
      >
        Dots = color hotspots, box = dominant area estimate
      </div>
    </div>
  );
}
