import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from '@arco-plugins/vite-plugin-svgr';
import vitePluginForArco from '@arco-plugins/vite-react';
import setting from './src/settings.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
    plugins: [
      react(),
      svgrPlugin({
        svgrOptions: {},
      }),
      vitePluginForArco({
        theme: '@arco-themes/react-arco-pro',
        modifyVars: {
          'arcoblue-6': setting.themeColor,
        },
      }),
    ],
    server: {
      port: 8010,
      proxy: {
        '/api': {
          target: `${env.VITE_API_URL}`,
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/api/, '/'),
        },
        '/base': {
          target: `${env.VITE_API_URL}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/base/, ''),
        },
        '/dyapi': {
          target: `http://121.89.237.232:28501`,
          changeOrigin: true,
          rewrite: (path) => {
            const r = path.replace(/^\/dyapi/, '/');
            console.log('r: ', r);
            return r;
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
