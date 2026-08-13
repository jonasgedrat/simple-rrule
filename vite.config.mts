import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SimpleRrule',
      fileName: (format) => `simple-rrule.${format}.js`,
    },
    rollupOptions: {
      external: ['zod'],
      output: {
        globals: {
          zod: 'Zod',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
