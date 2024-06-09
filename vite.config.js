import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    svgr({ 
      svgrOptions: {
        // svgr options
      },

      // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
  include: "**/*.svg?react",
    }),
  ],
  server: {  
    port: 8090,  
    }, 
})
