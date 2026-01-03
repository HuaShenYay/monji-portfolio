import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req) {
    try {
      const response = await fetch("https://httpbin.org/get");
      const data = await response.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
