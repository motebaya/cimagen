import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/cimagen/",
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: [],
  },
  server: {
    fs: {
      strict: true,
      allow: [".."],
    },
  },
});
