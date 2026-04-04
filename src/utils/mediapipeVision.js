let cachedVisionTasks = null;

function getMediaPipeRoot(path) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path}`.replace(/([^:]\/)\/+/, "$1");
}

export async function loadVisionTasks() {
  if (cachedVisionTasks) {
    return cachedVisionTasks;
  }

  const mediapipe = await import("@mediapipe/tasks-vision");
  const wasmRoot = getMediaPipeRoot("models/mediapipe/wasm");
  const vision = await mediapipe.FilesetResolver.forVisionTasks(wasmRoot);
  cachedVisionTasks = { ...mediapipe, vision, wasmRoot };
  return cachedVisionTasks;
}

export function getMediaPipeModelPath(relativePath) {
  return getMediaPipeRoot(relativePath);
}
