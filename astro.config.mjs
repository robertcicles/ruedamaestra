import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ruedamaestra.example/",
  output: "static",
  markdown: {
    syntaxHighlight: false
  },
  vite: {
    ssr: {
      external: []
    }
  }
});
