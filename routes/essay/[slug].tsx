import { Handlers, PageProps } from "$fresh/server.ts";
import { client, urlFor } from "../../utils/sanity.ts";
import Navigation from "../../islands/LiquidNavGlass.tsx";
import Reveal from "../../islands/Reveal.tsx";
import Footer from "../../components/Footer.tsx";
import Link from "../../components/Link.tsx";

interface Block {
  _type: string;
  style?: string;
  children?: Array<TextChild>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
    blank?: boolean;
  }>;
  asset?: { _ref: string; _type: "reference" };
}

interface TextChild {
  text?: string;
  _type?: string;
  marks?: string[];
}

interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

interface EssayPost {
  _id: string;
  title?: string;
  _createdAt: string;
  body?: Block[];
  content?: Block[];
  slug?: { current: string };
  author?: {
    name?: string;
    slug?: { current: string };
  } | null;
  mainImage?: SanityImage;
  image?: SanityImage;
}

interface EssayData {
  post: EssayPost;
}

export const handler: Handlers<EssayData> = {
  async GET(_req, ctx) {
    const { slug } = ctx.params;
    try {
      const query =
        `*[_type == "post" && (slug.current == $slug || _id == $slug) && "essay" in categories[]->title][0]{
        _id,
        title,
        _createdAt,
        mainImage,
        image,
        body,
        content,
        slug,
        author->{
          name,
          slug
        },
        categories[]->{
          _id,
          title
        }
      }`;
      const post = await client.fetch(query, { slug });

      if (!post) return ctx.renderNotFound();

      return ctx.render({ post });
    } catch (_err) {
      return ctx.renderNotFound();
    }
  },
};

// 辅助函数：根据 mark key 查找链接定义
function findLinkDefinition(block: Block, markKey: string) {
  return block.markDefs?.find(def => def._key === markKey && def._type === "link");
}

// 辅助函数：检测文本中的 URL 并转换为链接
function parseUrlsInText(text: string): (string | preact.JSX.Element)[] {
  // URL 正则表达式
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: (string | preact.JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // 添加 URL 前的文本
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    // 添加链接
    const url = match[0];
    parts.push(
      <Link href={url}>
        {url}
      </Link>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // 添加剩余的文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 1 ? parts : [text];
}

function renderBlocks(blocks: Block[] | undefined) {
  if (!blocks) return [];

  return blocks
    .map((block, index) => {
      // 处理图片块
      if (block._type === "image" && block.asset) {
        const imageUrl = urlFor(block as any).width(800).url();
        console.log("Block image URL:", imageUrl);
        return (
          <div class="my-8 rounded-[24px] overflow-hidden" key={index}>
            <img
              src={imageUrl}
              alt="Essay Image"
              class="w-full h-auto"
            />
          </div>
        );
      }

      // 处理引用块
      if (block._type === "block" && block.style === "blockquote") {
        return (
          <blockquote
            key={index}
            class="border-l-4 border-gray-300 pl-6 py-2 my-6 italic text-gray-600"
          >
            {block.children?.map((child, childIndex) => {
              if (!child.text) return null;
              
              let content: preact.JSX.Element | string = child.text;
              
              // 处理内联标记 - marks 是字符串数组
              if (child.marks && child.marks.length > 0) {
                child.marks.forEach((mark) => {
                  if (mark === "strong") {
                    content = <strong key={childIndex}>{content}</strong>;
                  } else if (mark === "em") {
                    content = <em key={childIndex}>{content}</em>;
                  } else {
                    // 处理链接（mark 是链接的 _key）
                    const linkDef = findLinkDefinition(block, mark);
                    if (linkDef && linkDef.href) {
                      content = (
                        <Link
                          key={childIndex}
                          href={linkDef.href}
                          target={linkDef.blank ? "_blank" : "_self"}
                          rel={linkDef.blank ? "noopener noreferrer" : undefined}
                        >
                          {content}
                        </Link>
                      );
                    }
                  }
                });
              }
              
              // 如果没有内联标记，或者处理完后仍然是字符串，检测其中的 URL
              if (typeof content === "string") {
                const parsedContent = parseUrlsInText(content);
                if (parsedContent.length > 1 || parsedContent[0] !== content) {
                  content = (
                    <span key={childIndex}>
                      {parsedContent.map((part, partIndex) => (
                        <span key={partIndex}>{part}</span>
                      ))}
                    </span>
                  );
                }
              }
              
              return content;
            })}
          </blockquote>
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

      // 处理普通段落 - 包含内联格式
      if (block._type === "block" && (!block.style || block.style === "normal")) {
        return (
          <p
            key={index}
            class="text-[#424245] text-[17px] leading-[1.7] mb-6 tracking-tight"
          >
            {block.children?.map((child, childIndex) => {
              if (!child.text) return null;
              
              let content: preact.JSX.Element | string = child.text;
              
              // 处理内联标记 - marks 是字符串数组
              if (child.marks && child.marks.length > 0) {
                child.marks.forEach((mark) => {
                  if (mark === "strong") {
                    content = <strong key={childIndex}>{content}</strong>;
                  } else if (mark === "em") {
                    content = <em key={childIndex}>{content}</em>;
                  } else {
                    // 处理链接（mark 是链接的 _key）
                    const linkDef = findLinkDefinition(block, mark);
                    if (linkDef && linkDef.href) {
                      content = (
                        <Link
                          key={childIndex}
                          href={linkDef.href}
                          target={linkDef.blank ? "_blank" : "_self"}
                          rel={linkDef.blank ? "noopener noreferrer" : undefined}
                        >
                          {content}
                        </Link>
                      );
                    }
                  }
                });
              }
              
              // 如果没有内联标记，或者处理完后仍然是字符串，检测其中的 URL
              if (typeof content === "string") {
                const parsedContent = parseUrlsInText(content);
                if (parsedContent.length > 1 || parsedContent[0] !== content) {
                  content = (
                    <span key={childIndex}>
                      {parsedContent.map((part, partIndex) => (
                        <span key={partIndex}>{part}</span>
                      ))}
                    </span>
                  );
                }
              }
              
              return content;
            })}
          </p>
        );
      }

      return null;
    })
    .filter((el): el is preact.JSX.Element => el !== null);
}

export default function EssayPage({ data }: PageProps<EssayData>) {
  const { post } = data;

  // 调试信息
  console.log("Essay post data:", post);
  console.log("Main image:", post.mainImage);
  console.log("Image field:", post.image);

  const hasImage = !!(post.mainImage || post.image);
  const imageData = post.mainImage || post.image;

  // 调试图片 URL
  if (imageData) {
    const imageUrl = urlFor(imageData as any).width(1200).url();
    console.log("Generated image URL:", imageUrl);
  }

  return (
    <div class="min-h-screen bg-white font-sans antialiased text-black pb-8">
      {/* 导航栏保持一致 */}
      <Navigation currentPage="things" />

      <main class="max-w-[800px] mx-auto pt-48 px-6 md:px-0">
        {/* 文章头部信息 */}
        <Reveal>
          <header class="text-center mb-16">
            <p class="text-[#86868B] text-[14px] font-medium mb-4 uppercase tracking-widest">
              {new Date(post._createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 class="text-[48px] md:text-[64px] font-bold tracking-tighter leading-[1.1] mb-4">
              {post.title || "Untitled"}
            </h1>
            <p class="text-[#86868B] text-[16px] font-medium">
              {post.author?.name || "Zijie Song"}
            </p>
          </header>
        </Reveal>

        {/* 主图（大幅展示） */}
        {hasImage && (
          <Reveal delay={0.04}>
            <section class="mb-20">
              <div class="aspect-[16/10] bg-[#F5F5F7] rounded-[40px] overflow-hidden ring-1 ring-black/5 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.35)]">
                <img
                  src={urlFor(imageData as any).width(1200).url()}
                  class="w-full h-full object-cover"
                />
              </div>
            </section>
          </Reveal>
        )}

        {/* 正文内容 */}
        <Reveal delay={0.04}>
          <article class="max-w-[680px] mx-auto">
            {renderBlocks(post.body || post.content || [])}
          </article>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
