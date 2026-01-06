import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "../utils/sanity.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      // 获取所有文章数据
      const posts = await client.fetch(`
        *[_type == "post"]{
          _id,
          title,
          mainImage,
          image,
          "categories": categories[]->title,
          slug
        }
      `);
      
      return new Response(JSON.stringify(posts, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
};
