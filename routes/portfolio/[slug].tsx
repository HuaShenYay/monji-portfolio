import { Handlers, PageProps } from "$fresh/server.ts";
import { client, urlFor } from "../../utils/sanity.ts";
import Navigation from "../../islands/LiquidNavGlass.tsx";
import Reveal from "../../islands/Reveal.tsx";
import Footer from "../../components/Footer.tsx";

interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

interface TextChild {
  text?: string;
}

interface Block {
  _type: string;
  style?: string;
  children?: TextChild[];
  asset?: { _ref: string; _type: "reference" };
}

interface Article {
  title: string;
  _createdAt: string;
  mainImage?: SanityImage;
  description?: string;
  body?: Block[];
  authorName: string;
  slug?: { current: string };
}

interface ArticleData {
  article: Article;
}

// Portable Text 渲染器组件
const components = {
  types: {
    image: ({ value }: { value: any }) => {
      return (
        <div class="my-8 rounded-[24px] overflow-hidden">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Portfolio Image"}
            class="w-full h-auto"
          />
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: { children: any }) => (
      <h2 class="text-[32px] font-bold mt-12 mb-6 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: any }) => (
      <h3 class="text-[24px] font-bold mt-8 mb-4 tracking-tight">
        {children}
      </h3>
    ),
    normal: ({ children }: { children: any }) => (
      <p class="text-[#424245] text-[17px] leading-[1.7] mb-6 tracking-tight">
        {children}
      </p>
    ),
  },
};

export const handler: Handlers<ArticleData> = {
  async GET(_req, ctx) {
    const { slug } = ctx.params;
    try {
      // 抓取单篇文章详情
      const query =
        `*[_type == "post" && (slug.current == $slug || _id == $slug) && "portfolio" in categories[]->title][0]{
        title,
        _createdAt,
        mainImage,
        description,
        body,
        "authorName": "Author, Founder of Namedly", 
        slug
      }`;
      const article = await client.fetch(query, { slug });

      if (!article) return ctx.renderNotFound();

      return ctx.render({ article });
    } catch (_err) {
      return ctx.renderNotFound();
    }
  },
};

function renderBlocks(blocks: Block[] | undefined) {
  if (!blocks) return [];

  return blocks
    .map((block, index) => {
      // 处理图片块
      if (block._type === "image" && block.asset) {
        const imageUrl = urlFor(block as any).width(800).url();
        console.log("Portfolio block image URL:", imageUrl);
        return (
          <div class="my-8 rounded-[24px] overflow-hidden" key={index}>
            <img
              src={imageUrl}
              alt="Portfolio Image"
              class="w-full h-auto"
            />
          </div>
        );
      }

      // 处理标题块
      if (block._type === "block" && block.style?.startsWith("h")) {
        const text = block.children?.map((child) => child.text).join("") || "";
        const Tag = block.style as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        
        if (Tag === "h2") {
          return (
            <h2 class="text-[32px] font-bold mt-12 mb-6 tracking-tight" key={index}>
              {text}
            </h2>
          );
        }
        
        if (Tag === "h3") {
          return (
            <h3 class="text-[24px] font-bold mt-8 mb-4 tracking-tight" key={index}>
              {text}
            </h3>
          );
        }
      }

      // 处理普通段落
      if (block._type === "block" && (!block.style || block.style === "normal")) {
        const text = block.children?.map((child) => child.text).join("") || "";
        return (
          <p
            key={index}
            class="text-[#424245] text-[17px] leading-[1.7] mb-6 tracking-tight"
          >
            {text}
          </p>
        );
      }

      return null;
    })
    .filter((el): el is preact.JSX.Element => el !== null);
}

export default function ArticlePage({ data }: PageProps<ArticleData>) {
  const { article } = data;

  // 调试信息
  console.log("Portfolio article data:", article);
  console.log("Main image:", article.mainImage);

  return (
    <div class="min-h-screen bg-white font-sans antialiased text-black pb-8">
      {/* 1. 导航栏保持一致 */}
      <Navigation currentPage="portfolio" />

      <main class="max-w-[800px] mx-auto pt-48 px-6 md:px-0">
        {/* 2. 文章头部信息 */}
        <Reveal>
          <header class="text-center mb-16">
            <p class="text-[#86868B] text-[14px] font-medium mb-4 uppercase tracking-widest">
              {new Date(article._createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h1 class="text-[48px] md:text-[64px] font-bold tracking-tighter leading-[1.1] mb-4">
              {article.title}
            </h1>
            <p class="text-[#86868B] text-[16px] font-medium">
              {article.authorName}
            </p>
          </header>
        </Reveal>

        {/* 3. 主图（大幅展示） */}
        {article.mainImage && (
          <Reveal delay={0.04}>
            <section class="mb-20">
              <div class="aspect-[16/10] bg-[#F5F5F7] rounded-[40px] overflow-hidden ring-1 ring-black/5 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.35)]">
                <img
                  src={urlFor(article.mainImage as any).width(1200).url()}
                  class="w-full h-full object-cover"
                />
              </div>
            </section>
          </Reveal>
        )}

        {/* 4. 正文内容 */}
        <Reveal delay={0.06}>
          <article class="max-w-[680px] mx-auto">
            {renderBlocks(article.body || [])}
          </article>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
