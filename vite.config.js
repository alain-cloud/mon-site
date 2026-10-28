import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative URLs keep assets working on both the GitHub project URL and a custom apex domain.
  base: './',
})
