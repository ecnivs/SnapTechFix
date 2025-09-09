// vite.config.ts
import { defineConfig } from "file:///C:/Users/Progton%20Admin/Documents/Snaptechfix/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Progton%20Admin/Documents/Snaptechfix/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Progton%20Admin/Documents/Snaptechfix/node_modules/lovable-tagger/dist/index.js";
import { compression } from "file:///C:/Users/Progton%20Admin/Documents/Snaptechfix/node_modules/vite-plugin-compression2/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Progton Admin\\Documents\\Snaptechfix";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
    open: true
  },
  plugins: [
    react(),
    mode === "development" ? componentTagger() : null,
    mode === "production" && compression({
      algorithms: ["gzip", "brotli"],
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
      deleteOriginalAssets: false
    })
  ].filter(Boolean),
  // Added type assertion
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true,
        collapse_vars: true,
        reduce_vars: true,
        passes: 2
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@/components/ui"],
          "vendor-utils": ["@/lib", "@/hooks"]
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      },
      treeshake: {
        moduleSideEffects: true,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    cssCodeSplit: true,
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    sourcemap: false,
    emptyOutDir: true
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: []
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    legalComments: "none"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQcm9ndG9uIEFkbWluXFxcXERvY3VtZW50c1xcXFxTbmFwdGVjaGZpeFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUHJvZ3RvbiBBZG1pblxcXFxEb2N1bWVudHNcXFxcU25hcHRlY2hmaXhcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1Byb2d0b24lMjBBZG1pbi9Eb2N1bWVudHMvU25hcHRlY2hmaXgvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgY29tcHJlc3Npb24gfSBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbjInO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiMTI3LjAuMC4xXCIsXHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyBjb21wb25lbnRUYWdnZXIoKSA6IG51bGwsXHJcbiAgICBtb2RlID09PSAncHJvZHVjdGlvbicgJiYgY29tcHJlc3Npb24oe1xyXG4gICAgICBhbGdvcml0aG1zOiBbJ2d6aXAnLCAnYnJvdGxpJ10sXHJcbiAgICAgIGV4Y2x1ZGU6IFsvXFwuKGJyKSQvLCAvXFwuKGd6KSQvXSxcclxuICAgICAgdGhyZXNob2xkOiAxMDI0LFxyXG4gICAgICBkZWxldGVPcmlnaW5hbEFzc2V0czogZmFsc2UsXHJcbiAgICB9KSxcclxuICBdLmZpbHRlcihCb29sZWFuKSBhcyBQbHVnaW5PcHRpb25bXSwgLy8gQWRkZWQgdHlwZSBhc3NlcnRpb25cclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxyXG4gICAgICAgIGRlYWRfY29kZTogdHJ1ZSxcclxuICAgICAgICBjb2xsYXBzZV92YXJzOiB0cnVlLFxyXG4gICAgICAgIHJlZHVjZV92YXJzOiB0cnVlLFxyXG4gICAgICAgIHBhc3NlczogMixcclxuICAgICAgfSxcclxuICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgY29tbWVudHM6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxyXG4gICAgICAgICAgJ3ZlbmRvci11aSc6IFsnQC9jb21wb25lbnRzL3VpJ10sXHJcbiAgICAgICAgICAndmVuZG9yLXV0aWxzJzogWydAL2xpYicsICdAL2hvb2tzJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJyxcclxuICAgICAgfSxcclxuICAgICAgdHJlZXNoYWtlOiB7XHJcbiAgICAgICAgbW9kdWxlU2lkZUVmZmVjdHM6IHRydWUsXHJcbiAgICAgICAgcHJvcGVydHlSZWFkU2lkZUVmZmVjdHM6IGZhbHNlLFxyXG4gICAgICAgIHRyeUNhdGNoRGVvcHRpbWl6YXRpb246IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcclxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LFxyXG4gICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICBleGNsdWRlOiBbXSxcclxuICB9LFxyXG4gIGVzYnVpbGQ6IHtcclxuICAgIGxvZ092ZXJyaWRlOiB7ICd0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc20nOiAnc2lsZW50JyB9LFxyXG4gICAgbGVnYWxDb21tZW50czogJ25vbmUnLFxyXG4gIH0sXHJcbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQWtVLFNBQVMsb0JBQW9CO0FBQy9WLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFFaEMsU0FBUyxtQkFBbUI7QUFMNUIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxnQkFBZ0IsZ0JBQWdCLElBQUk7QUFBQSxJQUM3QyxTQUFTLGdCQUFnQixZQUFZO0FBQUEsTUFDbkMsWUFBWSxDQUFDLFFBQVEsUUFBUTtBQUFBLE1BQzdCLFNBQVMsQ0FBQyxXQUFXLFNBQVM7QUFBQSxNQUM5QixXQUFXO0FBQUEsTUFDWCxzQkFBc0I7QUFBQSxJQUN4QixDQUFDO0FBQUEsRUFDSCxFQUFFLE9BQU8sT0FBTztBQUFBO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsV0FBVztBQUFBLFFBQ1gsZUFBZTtBQUFBLFFBQ2YsYUFBYTtBQUFBLFFBQ2IsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQyxpQkFBaUI7QUFBQSxVQUMvQixnQkFBZ0IsQ0FBQyxTQUFTLFNBQVM7QUFBQSxRQUNyQztBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULG1CQUFtQjtBQUFBLFFBQ25CLHlCQUF5QjtBQUFBLFFBQ3pCLHdCQUF3QjtBQUFBLE1BQzFCO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2Qsc0JBQXNCO0FBQUEsSUFDdEIsbUJBQW1CO0FBQUEsSUFDbkIsV0FBVztBQUFBLElBQ1gsYUFBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsSUFDbEQsU0FBUyxDQUFDO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsYUFBYSxFQUFFLDRCQUE0QixTQUFTO0FBQUEsSUFDcEQsZUFBZTtBQUFBLEVBQ2pCO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
