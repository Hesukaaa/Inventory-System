import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: { host: true, port: 4000, proxy: { "/api": "http://localhost:5000" } },
  plugins: [react()],
});
