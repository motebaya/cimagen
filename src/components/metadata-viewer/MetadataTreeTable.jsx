import { Check, ChevronRight, Copy } from "lucide-react";
import { useState } from "react";

const DEPTH_ACCENTS = [
  "rgba(59, 130, 246, 0.9)",
  "rgba(16, 185, 129, 0.9)",
  "rgba(245, 158, 11, 0.9)",
  "rgba(244, 63, 94, 0.9)",
];

function MetadataTreeRow({ copiedKey, depth = 0, node, onCopyValue }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCopied = copiedKey === `row:${node.id}`;
  const accentColor = DEPTH_ACCENTS[depth % DEPTH_ACCENTS.length];

  return (
    <div
      style={{
        borderTop: depth === 0 ? "none" : "1px solid var(--border-color)",
      }}
    >
      <div
        className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)_52px] items-start"
        style={{
          borderLeft: `3px solid ${accentColor}`,
          backgroundColor:
            depth === 0 ? "var(--card-bg)" : "rgba(248, 250, 252, 0.72)",
        }}
      >
        <div className="px-3 py-3 min-w-0">
          {node.isExpandable ? (
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              className="flex items-start gap-2 text-left cursor-pointer border-none bg-transparent p-0 w-full"
              style={{ color: "var(--text-primary)" }}
            >
              <ChevronRight
                size={16}
                className={`mt-0.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                style={{ color: "var(--text-tertiary)" }}
              />
              <span
                className="text-sm font-medium break-all"
                style={{ paddingLeft: depth * 10 }}
              >
                {node.label}
              </span>
            </button>
          ) : (
            <div
              className="text-sm font-medium break-all"
              style={{
                color: "var(--text-primary)",
                paddingLeft: depth * 26 + 18,
              }}
            >
              {node.label}
            </div>
          )}
        </div>

        <div
          className="px-3 py-3 text-sm break-all whitespace-pre-wrap"
          style={{ color: "var(--text-secondary)" }}
        >
          {node.displayValue}
        </div>

        <div className="px-3 py-3 flex justify-end">
          <button
            type="button"
            onClick={() => onCopyValue(node.id, node.copyValue)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md cursor-pointer border"
            style={{
              borderColor: isCopied
                ? "rgba(16, 185, 129, 0.28)"
                : "var(--border-color)",
              backgroundColor: isCopied
                ? "rgba(16, 185, 129, 0.12)"
                : "var(--card-bg)",
              color: isCopied ? "#047857" : "var(--text-tertiary)",
            }}
            aria-label={`Copy ${node.label}`}
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {node.isExpandable && isExpanded ? (
        <div>
          {node.children.map((child) => (
            <MetadataTreeRow
              key={child.id}
              copiedKey={copiedKey}
              depth={depth + 1}
              node={child}
              onCopyValue={onCopyValue}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function MetadataTreeTable({ copiedKey, nodes, onCopyValue }) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "rgba(59, 130, 246, 0.22)" }}
    >
      <div
        className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)_52px] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
        style={{
          backgroundColor: "rgba(59, 130, 246, 0.06)",
          color: "var(--text-tertiary)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.18)",
        }}
      >
        <span>Field</span>
        <span>Value</span>
        <span className="text-right">Copy</span>
      </div>

      <div>
        {nodes.map((node) => (
          <MetadataTreeRow
            key={node.id}
            copiedKey={copiedKey}
            node={node}
            onCopyValue={onCopyValue}
          />
        ))}
      </div>
    </div>
  );
}
