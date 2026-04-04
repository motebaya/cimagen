export const OCR_LANGUAGE_OPTIONS = [
  {
    value: "eng",
    label: "English",
    description:
      "Optimized for English documents, screenshots, and Latin-character interfaces.",
    helper: "Use this for menus, documents, UI text, and captions in English.",
  },
  {
    value: "ind",
    label: "Indonesian",
    description:
      "Tuned for Bahasa Indonesia text with more reliable recognition for local words.",
    helper: "Best for Indonesian receipts, posters, articles, and screenshots.",
  },
];

export function getOcrLanguageOption(value) {
  return (
    OCR_LANGUAGE_OPTIONS.find((option) => option.value === value) ||
    OCR_LANGUAGE_OPTIONS[0]
  );
}
