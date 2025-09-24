import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      // Ponto de entrada da biblioteca
      entry: resolve(__dirname, 'src/index.ts'),
      // Nome global da biblioteca para UMD
      name: 'SimpleRrule',
      // Nome dos arquivos de saída
      fileName: (format) => `simple-rrule.${format}.js`
    },
    rollupOptions: {
      // Dependências externas que não devem ser incluídas no bundle
      external: ['zod'],
      output: {
        // Globals para dependências externas no formato UMD
        globals: {
          zod: 'Zod'
        }
      }
    },
    // Gerar source maps
    sourcemap: true,
    // Limpar diretório de saída antes do build
    emptyOutDir: true
  },
  // Configuração para desenvolvimento
  server: {
    port: 3000
  }
})