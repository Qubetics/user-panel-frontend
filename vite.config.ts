import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/utils/functions.scss";`,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4003",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
