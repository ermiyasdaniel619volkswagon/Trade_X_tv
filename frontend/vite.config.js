// // // import { defineConfig } from 'vite';
// // // import react from '@vitejs/plugin-react';

// // // export default defineConfig({
// // //   plugins: [react()],
// // //   server: {
// // //     port: 3000,
// // //     host: true,  // This allows access from network
// // //     strictPort: false,  // This will try another port if 3000 is in use
// // //     proxy: {
// // //       '/api': {
// // //         target: 'http://localhost:5000',
// // //         changeOrigin: true,
// // //         secure: false,
// // //       },
// // //     },
// // //   },
// // //   build: {
// // //     outDir: 'dist',
// // //     sourcemap: true,
// // //   },
// // // });
// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';

// // export default defineConfig({
// //   plugins: [react()],
// //   server: {
// //     port: 3000,
// //     host: true,
// //     strictPort: false,
// //     proxy: {
// //       '/api': {
// //         target: 'http://localhost:5000',
// //         changeOrigin: true,
// //         secure: false,
// //       },
// //     },
// //   },
// //   build: {
// //     outDir: 'dist',
// //     sourcemap: true,
// //   },
// // });
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     host: true,
//     strictPort: false,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//         rewrite: (path) => path,
//       },
//     },
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: true,
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    proxy: {
      // =============================================
      // FIX: Proxy to /api/v1 to match backend routes
      // =============================================
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});