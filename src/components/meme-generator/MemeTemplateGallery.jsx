import { ChevronDown, Upload } from "lucide-react";
import { useState } from "react";
import memeTemplates from "../../content/memeTemplates.js";
import { visuallyHiddenInputStyle } from "../../utils/meme-generator/editorHelpers.js";

function TemplateCard({ template, isSelected, subtitle, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.src)}
      className="w-full rounded-xl border overflow-hidden text-left cursor-pointer transition-colors"
      style={{
        borderColor: isSelected
          ? "var(--color-primary-500)"
          : "var(--border-color)",
        backgroundColor: isSelected
          ? "rgba(92,124,250,0.06)"
          : "var(--bg-secondary)",
      }}
    >
      <div className="p-2 pb-0">
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <img
            src={template.src}
            alt={template.title}
            className="w-full h-44 object-cover block"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        <div
          className="text-sm font-medium truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {template.title}
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}

export default function MemeTemplateGallery({
  customTemplate,
  selectedTemplateSrc,
  inputAccept,
  templateImageInputRef,
  onTemplateInputChange,
  onOpenTemplateImagePicker,
  onSelectTemplate,
}) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border p-4 space-y-4 w-full max-w-none mx-auto xl:sticky xl:top-6 xl:max-w-[340px]"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-sm font-medium m-0"
          style={{ color: "var(--text-secondary)" }}
        >
          Template Gallery
        </p>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {memeTemplates.length} built-in
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsMobileExpanded((current) => !current)}
        className="xl:hidden w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-left cursor-pointer"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-primary)",
        }}
      >
        <span className="text-sm font-medium">Template selections</span>
        <ChevronDown
          size={16}
          className="transition-transform"
          style={{
            color: "var(--text-tertiary)",
            transform: isMobileExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <button
        type="button"
        onClick={onOpenTemplateImagePicker}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer border"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-primary)",
        }}
      >
        <Upload size={16} />
        Upload Your Image
      </button>

      <input
        ref={templateImageInputRef}
        type="file"
        accept={inputAccept}
        style={visuallyHiddenInputStyle}
        onChange={onTemplateInputChange}
      />

      <div
        className={`${isMobileExpanded ? "block" : "hidden"} xl:block`}
      >
        <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
          {customTemplate && (
            <TemplateCard
              template={customTemplate}
              isSelected={selectedTemplateSrc === customTemplate.src}
              subtitle="Uploaded image template"
              onSelect={onSelectTemplate}
            />
          )}

          {memeTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateSrc === template.src}
              subtitle="Classic meme template"
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
