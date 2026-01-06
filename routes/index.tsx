import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "../utils/sanity.ts";
import Navigation from "../islands/LiquidNavGlass.tsx";
import Reveal from "../islands/Reveal.tsx";
import Footer from "../components/Footer.tsx";

// 定义类型接口
interface Post {
  _id: string;
  _createdAt: string;
  title?: string;
  content?: Block[];
  body?: Block[];
  categories?: CategoryRef[];
  slug?: { current: string };
}

interface CategoryRef {
  _id: string;
  title?: string;
}

interface Block {
  _type: string;
  children?: Array<{ text: string }>;
}

function excerptFromBlocks(blocks: Block[] | undefined, maxLen = 140): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  const text = blocks
    .filter((b) => b?._type === "block")
    .flatMap((b) => b.children ?? [])
    .map((c) => c.text ?? "")
    .join("");
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen)}…` : trimmed;
}

interface PageData {
  posts: Post[];
  error: string | null;
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      console.log("Fetching posts with essay category...");

      const query =
        `*[_type == "post" && "essay" in categories[]->title] | order(_createdAt desc) {
        _id,
        _createdAt,
        title,
        content,
        body,
        slug,
        categories[]->{
          _id,
          title
        }
      }`;

      const posts = await client.fetch(query);
      console.log("Posts fetched:", posts);
      console.log("Posts count:", posts?.length || 0);

      if (!posts) {
        console.warn("No posts returned from Sanity");
        return ctx.render({ posts: [], error: null });
      }

      return ctx.render({ posts, error: null });
    } catch (err) {
      console.error("Failed to fetch posts from Sanity:", err);
      return ctx.render({
        posts: [],
        error: "Failed to load content. Please try again later.",
      });
    }
  },
};

export default function Things({ data }: PageProps<PageData>) {
  const posts = data?.posts || [];
  const error = data?.error;

  return (
    <div class="min-h-screen bg-white font-sans antialiased selection:bg-black selection:text-white">
      <Navigation currentPage="things" />

      <main class="max-w-[1100px] mx-auto pt-32 sm:pt-48 md:pt-56 px-4 sm:px-8 md:px-16 pb-8 sm:pb-12">
        {/* Hero Section：严格对齐图一排版 */}
        <Reveal>
          <section class="mb-20 sm:mb-32">
            <p class="text-[#86868B] text-[16px] sm:text-[18px] mb-8 sm:mb-12 tracking-tight">
              欢迎来到我的世界
            </p>

            <h1 class="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-bold leading-[1.1] tracking-tighter-extreme text-black mb-8 sm:mb-16">
              Monjiの，<br />
              琐事和作品，<br />
              「恭临」，<br />
              祝你天天开心。
            </h1>

            <p class="text-[#86868B] text-[16px] sm:text-[18px] tracking-tight">
              还不知道说什么先放在这里。
            </p>
          </section>
        </Reveal>

        {/* 分割线：极淡的颜色 */}
        <div class="w-full h-[0.5px] bg-gray-100 mb-20" />

        {/* Posts 列表：对齐图一 Poem 部分的排版 */}
        <Reveal delay={0.04}>
          <section class="max-w-[1100px] mx-auto">
            <h2 class="text-[20px] sm:text-[22px] font-bold mb-8 sm:mb-10 text-black tracking-tight">
              全部博客
            </h2>

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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
                {posts.map((post: Post, index: number) => {
                  const isLarge = index % 3 === 0;
                  const href = `/essay/${post.slug?.current || post._id}`;
                  const title = post.title ?? "Untitled";
                  const preview = excerptFromBlocks(post.body || post.content);

                  return (
                    <a
                      href={href}
                      key={post._id}
                      class={`${
                        isLarge ? "md:col-span-2" : "md:col-span-1"
                      } group cursor-pointer transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-[2px] active:translate-y-0`}
                    >
                      <div
                        class={`aspect-video rounded-[32px] overflow-hidden mb-6 ring-1 ring-black/5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-500 ease-out group-hover:shadow-[0_16px_44px_-30px_rgba(0,0,0,0.40)] bg-[#F5F5F7] flex flex-col justify-center items-center px-12 md:px-20 text-center`}
                      >
                        <div class="max-w-3xl">
                          <p class="text-[14px] text-gray-400 font-medium mb-4 uppercase tracking-widest">
                            Essay
                          </p>
                          <h3
                            class={`${
                              isLarge ? "text-[32px]" : "text-[24px]"
                            } font-bold leading-tight tracking-tight mb-4 text-black`}
                          >
                            {title}
                          </h3>
                          {preview && (
                            <p class="text-[#86868B] text-[17px] leading-relaxed line-clamp-2">
                              {preview}
                            </p>
                          )}
                        </div>
                      </div>

                      <div class="flex justify-between items-start px-2">
                        <span class="text-[15px] text-[#86868B] font-medium tabular-nums ml-auto">
                          {post._createdAt &&
                            new Date(post._createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              },
                            )}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* 空状态 */}
            {!error && posts.length === 0 && (
              <p class="text-gray-300 italic text-[16px] sm:text-[18px]">
                这里是sanity的日记内容，而不是作品集内容
              </p>
            )}
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
