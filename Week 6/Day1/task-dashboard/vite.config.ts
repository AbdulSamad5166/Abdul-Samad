import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Tailwind v4 ka Vite plugin: alag tailwind.config file ki zaroorat nahi
  plugins: [react(), tailwindcss()],
})