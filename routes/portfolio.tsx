import { Handlers, PageProps } from "$fresh/server.ts";
import { client, urlFor } from "../utils/sanity.ts";
import Navigation from "../islands/LiquidNavGlass.tsx";
import Reveal from "../islands/Reveal.tsx";
import Footer from "../components/Footer.tsx";

type SanityImage = Record<string, unknown> & {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
};

interface TextChild {
  text?: string;
}

interface Block {
  _type: string;
  children?: TextChild[];
}

interface SanityPost {
  _id: string;
  slug?: { current: string };
  title: string;
  _createdAt: string;
  mainImage?: SanityImage;
  body?: Block[];
  categories?: Array<{ _id: string; title?: string }>;
}

interface Project {
  _id: string;
  title: string;
  year: string;
  mainImage?: SanityImage;
  description?: string;
  _createdAt: string;
  slug?: { current: string };
  section: "literature" | "photograph" | "movie";
}

interface PortfolioData {
  projects: Project[];
}

export const handler: Handlers<PortfolioData> = {
  async GET(_req, ctx) {
    try {
      console.log("Fetching portfolio data with portfolio category...");

      // 获取同时包含 portfolio + (literature|photograph|movie) 的文章
      const query =
        `*[_type == "post" && "portfolio" in categories[]->title && (
        "literature" in categories[]->title ||
        "photograph" in categories[]->title ||
        "movie" in categories[]->title
      )] | order(_createdAt desc) {
        _id,
        slug,
        title,
        _createdAt,
        mainImage,
        body,
        categories[]->{
          _id,
          title
        }
      }`;
      const projects = await client.fetch(query);
      console.log("Portfolio projects fetched:", projects);
      console.log("Projects count:", projects?.length || 0);

      // 转换数据格式
      const formattedProjects = (projects as SanityPost[]).map((post) => {
        const categoryTitles = (post.categories ?? []).map((c) => c.title)
          .filter(Boolean) as string[];
        const section = (categoryTitles.includes("literature")
          ? "literature"
          : categoryTitles.includes("photograph")
          ? "photograph"
          : "movie") as Project["section"]; // fallback movie

        return {
          slug: post.slug,
          _id: post._id,
          title: post.title,
          year: new Date(post._createdAt).getFullYear().toString(),
          mainImage: post.mainImage,
          description: post.body?.find((block) =>
            block._type === "block"
          )?.children?.[0]?.text || "",
          _createdAt: post._createdAt,
          section,
        };
      });

      return ctx.render({ projects: formattedProjects });
    } catch (err) {
      console.error("Portfolio fetch error:", err);
      return ctx.render({ projects: [] });
    }
  },
};

const SECTION_META: Record<
  Project["section"],
  { title: string; kicker: string; description: string }
> = {
  literature: {
    title: "Literature",
    kicker: "Writing",
    description: "詩、小説",
  },
  photograph: {
    title: "Photograph",
    kicker: "Visual",
    description: "Photography sets and visual experiments.",
  },
  movie: {
    title: "Movie",
    kicker: "Motion",
    description: "Film / motion work, trailers, and edits.",
  },
};

export default function PortfolioPage({ data }: PageProps<PortfolioData>) {
  const { projects = [] } = data || {};

  const bySection = {
    literature: projects.filter((p) => p.section === "literature"),
    photograph: projects.filter((p) => p.section === "photograph"),
    movie: projects.filter((p) => p.section === "movie"),
  };

  const renderSection = (section: Project["section"], items: Project[]) => {
    const meta = SECTION_META[section];
    if (!items.length) return null;

    return (
      <section id={section} class="scroll-mt-32">
        <div class="flex items-end justify-between gap-8 mb-10">
          <div>
            <p class="text-[14px] text-gray-400 font-medium uppercase tracking-widest mb-3">
              {meta.kicker}
            </p>
            <h2 class="text-[28px] md:text-[36px] font-bold tracking-tight">
              {meta.title}
            </h2>
            <p class="text-[#86868B] text-[16px] mt-3 max-w-[70ch]">
              {meta.description}
            </p>
          </div>
          <a
            href={`#top`}
            class="text-[14px] text-black/40 hover:text-black/65 transition-colors"
          >
            Back to top
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
          {items.map((project, index) => {
            const isLarge = index % 3 === 0;
            const mainImage = project.mainImage;
            const hasImage = !!mainImage;

            return (
              <a
                href={`/portfolio/${project.slug?.current || project._id}`}
                key={project._id}
                class={`${
                  isLarge ? "md:col-span-2" : "md:col-span-1"
                } group cursor-pointer transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-[2px] active:translate-y-0`}
              >
                <div
                  class={`aspect-video rounded-[32px] overflow-hidden mb-6 ring-1 ring-black/5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-500 ease-out group-hover:shadow-[0_16px_44px_-30px_rgba(0,0,0,0.40)]
                    ${
                    !hasImage
                      ? "bg-[#F5F5F7] flex flex-col justify-center px-12 md:px-20"
                      : ""
                  }`}
                >
                  {hasImage
                    ? (
                      <img
                        src={urlFor(mainImage).width(isLarge ? 1200 : 600)
                          .url()}
                        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                        alt={project.title}
                      />
                    )
                    : (
                      <div class="max-w-2xl">
                        <p class="text-[14px] text-gray-400 font-medium mb-4 uppercase tracking-widest">
                          {meta.title}
                        </p>
                        <h3
                          class={`${
                            isLarge ? "text-[32px]" : "text-[24px]"
                          } font-bold leading-tight tracking-tight mb-4`}
                        >
                          {project.title}
                        </h3>
                        {project.description && (
                          <p class="text-[#86868B] text-[17px] line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    )}
                </div>

                <div class="flex justify-between items-start px-2">
                  <span class="text-[15px] text-[#86868B] font-medium tabular-nums ml-auto">
                    {new Date(project._createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div class="min-h-screen bg-white font-sans antialiased text-black">
      <Navigation currentPage="portfolio" />

      <main id="top" class="max-w-[1100px] mx-auto pt-56 px-8 md:px-16 pb-8">
        <Reveal>
          <div class="mb-16">
            <h1 class="text-[48px] md:text-[64px] font-bold tracking-tighter">
              Portfolio
            </h1>
            <p class="text-[#86868B] text-[18px] mt-6 max-w-[70ch]">
              Choose your favorite.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div class="sticky top-20 z-20 mb-16">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-3xl border border-white/60 ring-1 ring-black/5 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.25)] px-2 py-2">
              {(
                ["literature", "photograph", "movie"] as const
              ).map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  class="px-5 py-2 rounded-full text-[14px] font-medium text-black/60 hover:text-black transition-colors hover:bg-black/[0.04]"
                >
                  {SECTION_META[s].title}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div class="space-y-28">
            {renderSection("literature", bySection.literature)}
            {renderSection("photograph", bySection.photograph)}
            {renderSection("movie", bySection.movie)}
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
