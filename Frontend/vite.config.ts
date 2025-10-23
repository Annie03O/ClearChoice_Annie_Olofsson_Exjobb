import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

type ProxyWithOn = {
  on: (event: 'error' | 'proxyReq' | 'proxyRes', ...args: any[]) => void;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "//Annie03O/ClearChoice_Annie_Olofsson_Exjobb",
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
      configure: (proxy) => {
        const p = proxy as unknown as ProxyWithOn;
        p.on('error', (err: any, req: any) => 
          console.error('[proxy:error]', req?.method, req?.url, err?.message)
        );
        p.on('proxyReq', (_pr: any, req:any) =>
          console.error('[proxy:error]', req?.method, req?.url)
          
        );
        p.on('proxyRes', (res: any, req: any) =>
          console.error('[proxy:error]', req?.method, req?.url, res?.statusCode)
          
        );
      }
    },
  },
}

})
