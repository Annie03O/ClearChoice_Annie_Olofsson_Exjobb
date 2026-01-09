import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

type ProxyWithOn = {
  on: (event: "error" | "proxyReq" | "proxyRes", ...args: any[]) => void;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");


  const proxyTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:4000";

  return {
    plugins: [react(), svgr()],
    base: "/",

    // ✅ Proxy behövs bara vid `vite dev`
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,

          configure: (proxy) => {
            const p = proxy as unknown as ProxyWithOn;

            p.on("error", (err: any, req: any) => {
              console.error("[proxy:error]", req?.method, req?.url, err?.message);
            });

            p.on("proxyReq", (_proxyReq: any, req: any) => {
              console.log("[proxy:req]", req?.method, req?.url, "->", proxyTarget);
            });

            p.on("proxyRes", (res: any, req: any) => {
              console.log("[proxy:res]", req?.method, req?.url, res?.statusCode);
            });
          },
        },
      },
    },
  };
});
