self.onmessage = async (event) => {
  const { id } = event.data;
  self.postMessage({
    id,
    result: {
      ready: true,
      note: "Upscale worker scaffold is available for future model-backed processing.",
    },
  });
};
