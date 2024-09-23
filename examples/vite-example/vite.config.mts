import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        fetch: "./fetch.html",
        bundle: "./bundle.html",
      },
    },
  },
});