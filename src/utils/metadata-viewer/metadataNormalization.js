function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function isPrimitiveValue(value) {
  return (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  );
}

function formatPrimitiveValue(value) {
  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  return serializeValue(value);
}

function summarizeValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    if (value.every(isPrimitiveValue) && value.length <= 4) {
      return value.map((item) => formatPrimitiveValue(item)).join(", ");
    }

    return `${value.length} items`;
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value);

    if (keys.length === 0) {
      return "{}";
    }

    for (const preferredKey of [
      "description",
      "value",
      "text",
      "label",
      "formatted",
      "computed",
    ]) {
      if (preferredKey in value && isPrimitiveValue(value[preferredKey])) {
        return formatPrimitiveValue(value[preferredKey]);
      }
    }

    return `${keys.length} fields`;
  }

  return formatPrimitiveValue(value);
}

function serializeValue(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function createChildEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [`[${index}]`, item]);
  }

  if (isPlainObject(value)) {
    return Object.entries(value);
  }

  return [];
}

function buildNode(key, value, path) {
  const children = createChildEntries(value).map(
    ([childKey, childValue], index) =>
      buildNode(childKey, childValue, `${path}.${String(childKey)}.${index}`),
  );
  const isExpandable = children.length > 0;

  return {
    id: path,
    label: String(key),
    rawValue: value,
    displayValue: isExpandable
      ? summarizeValue(value)
      : formatPrimitiveValue(value),
    copyValue: isExpandable
      ? serializeValue(value)
      : formatPrimitiveValue(value),
    isExpandable,
    children,
  };
}

export function normalizeMetadataTree(data) {
  if (data == null) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.map((item, index) =>
      buildNode(`[${index}]`, item, `root.${index}`),
    );
  }

  if (isPlainObject(data)) {
    return Object.entries(data).map(([key, value], index) =>
      buildNode(key, value, `root.${key}.${index}`),
    );
  }

  return [buildNode("value", data, "root.value")];
}
