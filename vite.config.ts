import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

// Static-host friendly: outputs to ./dist
export default defineConfig(() => {
  const base = process.env.GITHUB_PAGES === "true" ? "./" : "/";

  return {
    base,
    plugins: [react(), tailwindcss(), metaImagesPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "public"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: {
      host: true,
      port: 5173,
    },
  };
});
