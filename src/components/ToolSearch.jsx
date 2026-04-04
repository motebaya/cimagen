import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function clampIndex(index, length) {
  if (!length) {
    return -1;
  }

  if (index < 0) {
    return length - 1;
  }

  if (index >= length) {
    return 0;
  }

  return index;
}

function getSearchScore(tool, query) {
  if (!query) {
    return 0;
  }

  const title = tool.searchTitle;
  const description = tool.searchDescription;
  const tags = tool.searchTags;
  const tokens = query.split(" ").filter(Boolean);
  let score = 0;

  if (title === query) {
    score += 1200;
  }

  if (title.startsWith(query)) {
    score += 700;
  }

  if (title.includes(query)) {
    score += 520 - title.indexOf(query);
  }

  tags.forEach((tag) => {
    if (tag === query) {
      score += 420;
    } else if (tag.startsWith(query)) {
      score += 300;
    } else if (tag.includes(query)) {
      score += 210;
    }
  });

  if (description.includes(query)) {
    score += 150;
  }

  tokens.forEach((token) => {
    if (!token) {
      return;
    }

    if (title.includes(token)) {
      score += 110;
    }

    if (tags.some((tag) => tag.includes(token))) {
      score += 90;
    }

    if (description.includes(token)) {
      score += 45;
    }
  });

  return score;
}

function SearchResultCard({ tool, isActive, onMouseEnter, onOpen }) {
  return (
    <Link
      to={tool.href}
      onClick={onOpen}
      onMouseEnter={onMouseEnter}
      className="flex items-center gap-3 px-3 py-3 no-underline transition-colors"
      style={{
        backgroundColor: isActive ? "var(--bg-tertiary)" : "transparent",
      }}
    >
      <div
        className="w-20 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg border"
        style={{ borderColor: "var(--border-color)", aspectRatio: "16/10" }}
      >
        <img
          src={tool.thumbnail}
          alt={tool.title}
          className="w-full h-full object-cover block"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-semibold m-0 mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {tool.title}
        </p>
        <p
          className="text-xs m-0 leading-relaxed"
          style={{
            color: "var(--text-secondary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {tool.description}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="flex-shrink-0"
        style={{ color: "var(--text-tertiary)" }}
      />
    </Link>
  );
}

export default function ToolSearch({ tools }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const indexedTools = useMemo(
    () =>
      tools.map((tool) => ({
        ...tool,
        searchTitle: normalizeText(tool.title),
        searchDescription: normalizeText(tool.description),
        searchTags: (tool.tags || []).map(normalizeText),
      })),
    [tools],
  );

  const normalizedQuery = useMemo(() => normalizeText(query), [query]);

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return indexedTools
      .map((tool) => ({
        ...tool,
        score: getSearchScore(tool, normalizedQuery),
      }))
      .filter((tool) => tool.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        return left.title.localeCompare(right.title);
      });
  }, [indexedTools, normalizedQuery]);

  const showPanel = isFocused && normalizedQuery.length > 0;
  const visibleResults = isExpanded ? results : results.slice(0, 5);

  useEffect(() => {
    setIsExpanded(false);
    setActiveIndex(results.length ? 0 : -1);
  }, [normalizedQuery, results.length]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsFocused(false);
        setIsExpanded(false);
        setActiveIndex(-1);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleKeyDown = (event) => {
    if (!showPanel || results.length === 0) {
      if (event.key === "Escape") {
        setIsFocused(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => {
        const nextIndex = clampIndex(current + 1, results.length);
        if (!isExpanded && results.length > 5 && nextIndex >= 5) {
          setIsExpanded(true);
        }
        return nextIndex;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => clampIndex(current - 1, results.length));
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      navigate(results[activeIndex].href);
      setIsFocused(false);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-2xl mx-auto mt-8 text-left"
    >
      <div
        className="relative border transition-all duration-200"
        style={{
          borderRadius: showPanel ? "20px 20px 0 0" : "20px",
          borderColor: isFocused
            ? "var(--color-primary-500)"
            : "var(--border-color)",
          backgroundColor: "var(--card-bg)",
          boxShadow: isFocused
            ? "0 0 0 4px rgba(92, 124, 250, 0.12), var(--card-shadow-hover)"
            : "var(--card-shadow)",
        }}
      >
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{
            color: isFocused
              ? "var(--color-primary-500)"
              : "var(--text-tertiary)",
          }}
        />
        <label
          htmlFor="tool-search"
          className="absolute left-12 pointer-events-none transition-all duration-200"
          style={{
            top: isFocused || query ? "0" : "50%",
            transform:
              isFocused || query
                ? "translateY(-50%) scale(0.9)"
                : "translateY(-50%) scale(1)",
            transformOrigin: "left center",
            color: isFocused
              ? "var(--color-primary-600)"
              : "var(--text-tertiary)",
            backgroundColor:
              isFocused || query ? "var(--card-bg)" : "transparent",
            padding: isFocused || query ? "0 8px" : "0",
            fontSize: isFocused || query ? "0.75rem" : "0.95rem",
            fontWeight: isFocused || query ? 600 : 500,
          }}
        >
          Search tools
        </label>
        <input
          id="tool-search"
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isFocused || query
              ? "Find a converter, generator, or effect..."
              : ""
          }
          className="w-full h-13 pl-12 pr-10 pt-6 pb-3 bg-transparent border-none outline-none text-base rounded-[20px]"
          style={{ color: "var(--text-primary)" }}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-md hover:bg-black/5"
            style={{ color: "var(--text-tertiary)" }}
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          className="border border-t-0 overflow-hidden animate-fade-in"
          style={{
            borderColor: "var(--color-primary-500)",
            borderRadius: "0 0 20px 20px",
            backgroundColor: "var(--card-bg)",
            boxShadow: "var(--card-shadow-hover)",
          }}
        >
          {results.length > 0 ? (
            <>
              <div
                className="px-4 py-3 border-b flex items-center justify-between gap-3"
                style={{ borderColor: "var(--border-color)" }}
              >
                <p
                  className="text-xs m-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {results.length} matching{" "}
                  {results.length === 1 ? "tool" : "tools"}
                </p>
                {results.length > 5 && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-xs font-medium cursor-pointer border-none bg-transparent px-0"
                    style={{ color: "var(--color-primary-600)" }}
                  >
                    Show More
                  </button>
                )}
              </div>

              <div className={isExpanded ? "max-h-96 overflow-y-auto" : ""}>
                {visibleResults.map((tool, index) => (
                  <SearchResultCard
                    key={tool.id}
                    tool={tool}
                    isActive={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onOpen={() => {
                      setIsFocused(false);
                      setIsExpanded(false);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-5">
              <p
                className="text-sm font-medium m-0 mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                No matching tools found.
              </p>
              <p
                className="text-xs m-0"
                style={{ color: "var(--text-tertiary)" }}
              >
                Try another keyword, tool name, or feature type.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
