import {
  Crop,
  Facebook,
  Instagram,
  Linkedin,
  MonitorSmartphone,
  Package,
  PanelTop,
  RectangleHorizontal,
  ShoppingBag,
  Square,
  Store,
  Twitter,
  Youtube,
} from "lucide-react";

const ICON_MAP = {
  crop: Crop,
  square: Square,
  portrait: RectangleHorizontal,
  landscape: RectangleHorizontal,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  mobile: MonitorSmartphone,
  store: Store,
  package: Package,
  panel: PanelTop,
  "shopping-bag": ShoppingBag,
};

export default function CropTypeCard({
  presets,
  selectedAspectKey,
  onSelectAspect,
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="mb-4">
        <h2
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Crop Type
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const Icon = ICON_MAP[preset.iconKey] || Crop;
          const isSelected = selectedAspectKey === preset.key;

          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => onSelectAspect(preset.key)}
              className="inline-flex items-center gap-2 px-3 py-3 rounded-lg text-xs font-medium cursor-pointer border text-left w-fit"
              style={{
                borderColor: isSelected
                  ? "var(--color-primary-600)"
                  : "var(--border-color)",
                backgroundColor: isSelected
                  ? "var(--color-primary-600)"
                  : "var(--bg-tertiary)",
                color: isSelected ? "#fff" : "var(--text-secondary)",
              }}
            >
              <Icon size={15} />
              <span className="leading-tight">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
