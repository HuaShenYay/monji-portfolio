import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: Deno.env.get("SANITY_PROJECT_ID") || "y6sc85uh",
  dataset: Deno.env.get("SANITY_DATASET") || "production",
  useCdn: true, // 生产环境建议使用 CDN
  apiVersion: Deno.env.get("SANITY_API_VERSION") || "2021-03-25", // 使用稳定版本
});

// 添加调试信息
console.log("Sanity client configured with:", {
  projectId: Deno.env.get("SANITY_PROJECT_ID") || "y6sc85uh",
  dataset: Deno.env.get("SANITY_DATASET") || "production",
  useCdn: Deno.env.get("SANITY_USE_CDN") !== "false",
  apiVersion: Deno.env.get("SANITY_API_VERSION") || "2021-03-25",
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: Record<string, unknown>) =>
  builder.image(source);
