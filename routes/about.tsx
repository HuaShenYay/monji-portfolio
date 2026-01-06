import Navigation from "../islands/LiquidNavGlass.tsx";
import Reveal from "../islands/Reveal.tsx";
import Footer from "../components/Footer.tsx";

export default function AboutPage() {
  // 这里直接定义你的个人信息，方便以后修改
  const profile = {
    intro:
      "宋子杰，男，上海人，22岁，MBTI「一个很粗略了解我的人格的分类学」：INFJ（内向，情感，直觉，判断），喜欢大部分人类艺术，科技产品，比较喜欢新奇的事物和探索前沿的知识。",
    interestsIntro: "创意写作，超文本文学",
    experiences: [
      { name: "???", year: "2026" },
      { name: "上海杉达学院", year: "2024" },
      { name: "上海电子信息职业技术学院", year: "2021" },
      { name: "上海信息技术学校", year: "2018" },
    ],
  };

  return (
    <div class="min-h-screen bg-white font-sans antialiased text-black selection:bg-black selection:text-white">
      <Navigation currentPage="about" />

      <main class="max-w-[1100px] mx-auto pt-56 px-8 md:px-16 pb-8">
        <Reveal>
          <h1 class="text-[48px] md:text-[64px] font-bold tracking-tighter mb-20 text-black">
            About me
          </h1>
        </Reveal>

        {/* 2. Introduction 部分 - 左右结构 */}
        <Reveal delay={0.04}>
          <section class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-32">
            {/* 左侧大图：使用占位色块，你可以换成自己的 static 图片地址 */}
            <div class="aspect-[4/3] bg-[#D9F3C1] rounded-[40px] overflow-hidden shadow-sm">
              <img
                src="../../static/my-avatar.jpg"
                alt="Me"
                class="w-full h-full object-cover"
              />
            </div>
            {/* 右侧文本 */}
            <div class="pt-4">
              <h2 class="text-[24px] font-bold mb-6 tracking-tight">
                紹介
              </h2>
              <p class="text-[#424245] text-[18px] leading-[1.7] tracking-tight">
                {profile.intro}
              </p>
            </div>
          </section>
        </Reveal>

        {/* 3. Interests 部分 - 顶部文本 + 下方三列图片 */}
        <Reveal delay={0.06}>
          <section class="mb-32">
            <div class="max-w-xl mb-16">
              <h2 class="text-[24px] font-bold mb-6 tracking-tight">
                主要研究内容
              </h2>
              <p class="text-[#424245] text-[18px] leading-[1.7] tracking-tight">
                {profile.interestsIntro}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 三张兴趣图，对应设计稿中的不同色块/纹理 */}
              <div class="aspect-square bg-[#FFD6D6] rounded-[32px] shadow-sm hover:scale-[1.02] transition-transform duration-500">
              </div>
              <div class="aspect-square bg-[#D6E4FF] rounded-[32px] shadow-sm hover:scale-[1.02] transition-transform duration-500">
              </div>
              <div class="aspect-square bg-[#E8F5E9] rounded-[32px] shadow-sm hover:scale-[1.02] transition-transform duration-500">
              </div>
            </div>
          </section>
        </Reveal>

        {/* 4. Experience 部分 - 经典的列表排版 */}
        <Reveal delay={0.08}>
          <section>
            <div class="border-t border-gray-100">
              {profile.experiences.map((exp, i) => (
                <div
                  key={i}
                  class="flex justify-between items-center py-10 border-b border-gray-100 group"
                >
                  <span class="text-[24px] md:text-[32px] font-bold tracking-tight group-hover:pl-4 transition-all duration-300">
                    {exp.name}
                  </span>
                  <span class="text-[#86868B] text-[18px] font-medium tabular-nums">
                    {exp.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
