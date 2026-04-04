const worker = new Worker(
  new URL("../../workers/backgroundRemovalWorker.js", import.meta.url),
  { type: "module" },
);

let requestId = 0;
const pending = new Map();

worker.onmessage = (event) => {
  const { id, error, result } = event.data;
  const entry = pending.get(id);
  if (!entry) return;

  pending.delete(id);
  if (error) {
    entry.reject(new Error(error));
  } else {
    entry.resolve(result);
  }
};

export function runBackgroundRemovalWorker(task, payload) {
  return new Promise((resolve, reject) => {
    requestId += 1;
    pending.set(requestId, { resolve, reject });
    worker.postMessage({ id: requestId, task, payload });
  });
}
