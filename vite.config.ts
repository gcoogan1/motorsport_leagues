import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import svgr from "vite-plugin-svgr";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@app': path.resolve(__dirname, './src/app'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@components': path.resolve(__dirname, './src/app/components'),
      '@features': path.resolve(__dirname, './src/app/features'),
      '@pages': path.resolve(__dirname, './src/app/pages'),
      '@store': path.resolve(__dirname, './src/app/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/app/hooks'),
      '@services': path.resolve(__dirname, './src/app/services'),
    },
  },
})
