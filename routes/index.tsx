import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "../utils/sanity.ts";
import { JSX } from "preact";

// 定义类型接口
interface Post {
  _id: string;
  _createdAt: string;
  title?: string;
  content?: Block[];
  body?: Block[];
  categories?: CategoryRef[];
}

interface CategoryRef {
  _id: string;
  title?: string;
}

interface Block {
  _type: string;
  children?: Array<{ text: string }>;
}

interface PageData {
  posts: Post[];
  error: string | null;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      console.log("Fetching posts with essay category reference...");
      
      const query = `*[_type == "post"] | order(_createdAt desc) {
        _id,
        _createdAt,
        title,
        content,
        body,
        categories[]->{
          _id,
          title
        }
      }`;
      
      const posts = await client.fetch(query);
      console.log("Posts fetched:", posts);
      console.log("Posts count:", posts?.length || 0);
      
      // 过滤出有 essay category 的文章
      const essayPosts = posts?.filter((post: Post) => 
        post.categories?.some((cat: CategoryRef) => cat.title === "essay")
      ) || [];
      console.log("Essay posts:", essayPosts);
      console.log("Essay posts count:", essayPosts.length);

      if (!essayPosts) {
        console.warn("No essay posts returned from Sanity");
        return ctx.render({ posts: [], error: null });
      }

      return ctx.render({ posts: essayPosts, error: null });
    } catch (err) {
      console.error("Failed to fetch posts from Sanity:", err);
      return ctx.render({
        posts: [],
        error: "Failed to load content. Please try again later.",
      });
    }
  },
};

// 专门处理 Sanity 内容渲染，并加入字间距控制
function renderContent(blocks: Block[] | undefined): JSX.Element[] {
  if (!blocks || !Array.isArray(blocks)) return [];
  return blocks
    .map((block: Block, index: number) => {
      if (block._type !== "block" || !block.children) return null;
      return (
        <p key={index} class="mb-6 leading-[1.8] tracking-tight text-[#424245]">
          {block.children.map((child) =>
            child.text
          ).join("")}
        </p>
      );
    })
    .filter((element): element is JSX.Element => element !== null);
}

export default function Things({ data }: PageProps<PageData>) {
  const posts = data?.posts || [];
  const error = data?.error;

  return (
    <div class="min-h-screen bg-white font-sans antialiased selection:bg-black selection:text-white">
      {/* 导航栏：还原图一的轻盈感，改进移动端适配 */}
      <nav class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md">
        <div class="flex items-center justify-center gap-6 px-6 py-2 bg-[#F2F2F2]/80 backdrop-blur-xl rounded-full border border-white/20 shadow-sm">
          <a href="/" class="relative text-[14px] sm:text-[15px] text-black font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1.5px] after:bg-black">Things</a>
          <a href="/about" class="text-[14px] sm:text-[15px] text-black/50 hover:text-black transition-colors font-medium">About</a>
          <a href="/portfolio" class="text-[14px] sm:text-[15px] text-black/50 hover:text-black transition-colors font-medium">Portfolio</a>
        </div>
      </nav>

      <main class="max-w-[1100px] mx-auto pt-32 sm:pt-48 md:pt-56 px-4 sm:px-8 md:px-16 pb-20 sm:pb-32">
        {/* Hero Section：严格对齐图一排版 */}
        <section class="mb-20 sm:mb-32">
          <p class="text-[#86868B] text-[16px] sm:text-[18px] mb-8 sm:mb-12 tracking-tight">欢迎来到我的世界</p>
          
          <h1 class="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-bold leading-[1.1] tracking-tighter-extreme text-black mb-8 sm:mb-16">
            宋子杰の，<br />
            琐事和作品，<br />
            「恭临」，<br />
            祝你天天开心。
          </h1>
          
          <p class="text-[#86868B] text-[16px] sm:text-[18px] tracking-tight">还不知道说什么先放在这里。</p>
        </section>

        {/* 分割线：极淡的颜色 */}
        <div class="w-full h-[0.5px] bg-gray-100 mb-20" />

        {/* Posts 列表：对齐图一 Poem 部分的排版 */}
        <section class="max-w-2xl">
          <h2 class="text-[20px] sm:text-[22px] font-bold mb-8 sm:mb-10 text-black tracking-tight">全部博客</h2>

          {/* 错误状态显示 */}
          {error && (
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p class="text-red-600 text-[16px]">{error}</p>
            </div>
          )}

          {/* 加载状态 */}
          {!error && posts.length === 0 && (
            <div class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mb-4">
              </div>
              <p class="text-gray-400 text-[18px]">Loading content...</p>
            </div>
          )}

          {/* 文章列表 */}
          {posts.length > 0 && (
            <div class="space-y-16">
              {posts.map((post: Post) => (
                <div key={post._id} class="animate-fade-in">
                  {post.title && (
                    <h3 class="text-[20px] sm:text-[22px] md:text-[24px] font-bold text-black mb-3 sm:mb-4 tracking-tight">
                      {post.title}
                    </h3>
                  )}

                  <div class="text-[17px] sm:text-[18px] md:text-[19px] font-normal">
                    {renderContent(post.body || post.content)}
                  </div>

                  <p class="text-[12px] sm:text-[14px] text-gray-300 font-medium mt-4 sm:mt-6 tracking-wide uppercase">
                    {post._createdAt &&
                      new Date(post._createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 空状态 */}
          {!error && posts.length === 0 && (
            <p class="text-gray-300 italic text-[16px] sm:text-[18px]">
              这里是sanity的日记内容，而不是作品集内容
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
