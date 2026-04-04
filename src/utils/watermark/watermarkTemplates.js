import templateData from "../../content/watermark/templates.json";

const BASE = import.meta.env.BASE_URL;

export const WATERMARK_TEMPLATES = templateData.map((template) => ({
  ...template,
  thumbnail: template.thumbnail ? `${BASE}${template.thumbnail}` : null,
}));

export function getWatermarkTemplateGroups() {
  return WATERMARK_TEMPLATES.reduce((groups, template) => {
    if (!groups[template.category]) {
      groups[template.category] = [];
    }
    groups[template.category].push(template);
    return groups;
  }, {});
}

export default WATERMARK_TEMPLATES;
