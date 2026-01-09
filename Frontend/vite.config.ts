import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";


type ProxyWithOn = {
  on: (event: "error" | "proxyReq" | "proxyRes", ...args: any[]) => void;
};

export default defineConfig({
  plugins: [react(), svgr()],

  // ✅ Behåll din base (viktig för GitHub Pages)
  base: "/ClearChoice_Annie_Olofsson_Exjobb/",

  server: {
    proxy: {
      // ✅ Allt som börjar med /api skickas till backend på :4000
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,

        // ✅ Extra debug-loggar (påverkar inte din app logiskt)
        configure: (proxy) => {
          const p = proxy as unknown as ProxyWithOn;

          p.on("error", (err: any, req: any) => {
            console.error("[proxy:error]", req?.method, req?.url, err?.message);
          });

          p.on("proxyReq", (_proxyReq: any, req: any) => {
            console.log("[proxy:req]", req?.method, req?.url);
          });

          p.on("proxyRes", (res: any, req: any) => {
            console.log("[proxy:res]", req?.method, req?.url, res?.statusCode);
          });
        },
      },
    },
  },
});
