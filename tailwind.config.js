/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gh: {
          // Canvas
          'canvas-default': '#ffffff',
          'canvas-subtle': '#f6f8fa',
          'canvas-inset': '#f0f6ff',
          // Border
          'border-default': '#d0d7de',
          'border-muted': '#d8dee4',
          // Foreground
          'fg-default': '#1f2328',
          'fg-muted': '#656d76',
          'fg-subtle': '#6e7781',
          // Accent (blue)
          'accent-fg': '#0969da',
          'accent-emphasis': '#0969da',
          'accent-subtle': '#ddf4ff',
          // Success (green)
          'success-fg': '#1a7f37',
          'success-emphasis': '#1f883d',
          'success-subtle': '#dafbe1',
          // Attention (yellow)
          'attention-fg': '#9a6700',
          'attention-emphasis': '#bf8700',
          'attention-subtle': '#fff8c5',
          // Danger (red)
          'danger-fg': '#d1242f',
          'danger-emphasis': '#cf222e',
          'danger-subtle': '#ffebe9',
          // Dark canvas
          'dark-canvas-default': '#0d1117',
          'dark-canvas-subtle': '#161b22',
          'dark-canvas-inset': '#010409',
          // Dark border
          'dark-border-default': '#30363d',
          'dark-border-muted': '#21262d',
          // Dark foreground
          'dark-fg-default': '#e6edf3',
          'dark-fg-muted': '#848d97',
          'dark-fg-subtle': '#6e7781',
          // Dark accent
          'dark-accent-fg': '#2f81f7',
          'dark-accent-emphasis': '#1f6feb',
          'dark-accent-subtle': '#031d41',
          // Dark success
          'dark-success-fg': '#3fb950',
          'dark-success-emphasis': '#238636',
          'dark-success-subtle': '#0f2d18',
          // Dark attention
          'dark-attention-fg': '#d29922',
          'dark-attention-emphasis': '#9e6a03',
          'dark-attention-subtle': '#2d1d0e',
          // Dark danger
          'dark-danger-fg': '#f85149',
          'dark-danger-emphasis': '#da3633',
          'dark-danger-subtle': '#3d0912',
          // Neutral (purple for "in-progress")
          'done-fg': '#8250df',
          'done-subtle': '#fbefff',
          'dark-done-fg': '#a371f7',
          'dark-done-subtle': '#21063a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
