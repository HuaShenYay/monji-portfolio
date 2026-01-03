import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "../utils/sanity.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const query = `*[_type == "post"] | order(_createdAt desc) {
        _id,
        _createdAt,
        title,
        content,
        body
      }`;
      const posts = await client.fetch(query);
      return ctx.render({ posts: posts || [] });
    } catch (err) {
      return ctx.render({ posts: [] });
    }
  },
};

// 专门处理 Sanity 内容渲染，并加入字间距控制
function renderContent(blocks: any) {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks.map((block) => {
    if (block._type !== "block" || !block.children) return null;
    return (
      <p class="mb-6 leading-[1.8] tracking-tight text-[#424245]">
        {block.children.map((child: any) => child.text).join("")}
      </p>
    );
  });
}

export default function Home({ data }: PageProps) {
  const posts = data?.posts || [];

  return (
    <div class="min-h-screen bg-white font-sans antialiased selection:bg-black selection:text-white">
      {/* 导航栏：还原图一的轻盈感 */}
      <nav class="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
        <div class="flex items-center gap-10 px-10 py-3 bg-[#F2F2F2]/80 backdrop-blur-xl rounded-full border border-white/20 shadow-sm">
          <a href="/things" class="text-[15px] text-black/50 hover:text-black transition-colors font-medium">Things</a>
          <a href="/about" class="relative text-[15px] text-black font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1.5px] after:bg-black">About</a>
          <a href="/portfolio" class="text-[15px] text-black/50 hover:text-black transition-colors font-medium">Portfolio</a>
        </div>
      </nav>

      <main class="max-w-[1100px] mx-auto pt-56 px-8 md:px-16 pb-32">
        {/* Hero Section：严格对齐图一排版 */}
        <section class="mb-32">
          <p class="text-[#86868B] text-[18px] mb-12 tracking-tight">欢迎来到我的世界</p>
          
          <h1 class="text-[56px] md:text-[80px] font-bold leading-[1.1] tracking-tighter-extreme text-black mb-16">
            宋子杰の，<br />
            琐事和作品，<br />
            「恭临」，<br />
            祝你天天开心。
          </h1>
          
          <p class="text-[#86868B] text-[18px] tracking-tight">还不知道说什么先放在这里。</p>
        </section>

        {/* 分割线：极淡的颜色 */}
        <div class="w-full h-[0.5px] bg-gray-100 mb-20" />

        {/* Posts 列表：对齐图一 Poem 部分的排版 */}
        <section class="max-w-2xl">
          <h2 class="text-[22px] font-bold mb-10 text-black tracking-tight">Poem</h2>
          <div class="space-y-16">
            {posts.length > 0 ? posts.map((post: any) => (
              <div key={post._id} class="animate-fade-in">
                {post.title && (
                  <h3 class="text-[24px] font-bold text-black mb-4 tracking-tight">
                    {post.title}
                  </h3>
                )}
                
                <div class="text-[19px] font-normal">
                  {renderContent(post.content || post.body)}
                </div>

                <p class="text-[14px] text-gray-300 font-medium mt-6 tracking-wide uppercase">
                  {post._createdAt && new Date(post._createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )) : (
              <p class="text-gray-300 italic text-[18px]">这里是sanity的日记内容，而不是作品集内容</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}