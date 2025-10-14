import { defineConfig } from 'vite';
import path from 'path';
import { builtinModules } from 'node:module';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, '.vite/preload'), // ✅ absolute path avoids double .vite
    minify: false,
    rollupOptions: {
      external: ['electron', ...builtinModules.map((m) => [m, `node:${m}`]).flat()],
      input: {
        preload: path.resolve(__dirname, 'src-renderer/preload.ts'), // ✅ template location
      },
      output: {
        format: 'cjs',
        inlineDynamicImports: true,
        entryFileNames: '[name].js',
      },
    },
  },
});
