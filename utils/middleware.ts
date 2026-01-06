import { MiddlewareHandler } from "$fresh/server.ts";

export const handler: MiddlewareHandler = async (req, ctx) => {
  const resp = await ctx.next();
  
  // 修改 CSP 头部以允许 Sanity 图片
  const csp = resp.headers.get("Content-Security-Policy");
  if (csp) {
    const newCsp = csp.replace(
      "img-src 'self' data: https:",
      "img-src 'self' data: https: https://cdn.sanity.io"
    );
    resp.headers.set("Content-Security-Policy", newCsp);
  }
  
  return resp;
};
