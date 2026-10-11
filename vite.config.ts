import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import wasm from 'vite-plugin-wasm'
// import devtools from 'solid-devtools/vite';

// wgsl-analyzer is built with -pthread, so it needs SharedArrayBuffer, which
// needs a cross-origin isolated page. Production gets these from public/_headers
// (Cloudflare: https://developers.cloudflare.com/pages/configuration/headers/).
const crossOriginIsolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
}

export default defineConfig({
  optimizeDeps: { exclude: ['wesl-rs-web', 'wgsl-analyzer-web'] },
  plugins: [
    // devtools(),
    wasm(),
    solid(),
  ],
  server: {
    port: 3000,
    headers: crossOriginIsolation,
    fs: {
      // here we allow the dev server to access files outside of the project root.
      // This is currently only needed when using a `file:` dependency for `wesl-rs-web` or
      // `wgsl-analyzer-web`, which would be linked to folders outside the root.
      strict: false
    }
  },
  preview: {
    headers: crossOriginIsolation,
  },
  build: {
    target: 'esnext',
  },
  // wgsl-analyzer-web's worker loads the emscripten glue with a dynamic import,
  // which needs code splitting.
  worker: {
    format: 'es',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})
