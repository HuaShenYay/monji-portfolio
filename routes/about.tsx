import { PageProps } from "$fresh/server.ts";
import Navigation from "../components/Navigation.tsx";

export default function AboutPage() {
  // 这里直接定义你的个人信息，方便以后修改
  const profile = {
    intro: "A little paragraph introduction that gives a sense of what you do, who you are, where you're from, and why you created this website. This is the most likely part of the page to be read in full.",
    interestsIntro: "A little section to round out the professional purpose of this webpage. Who's the person behind it, really? What do they like—and what are they like? Sections like this can go a little bit longer because it's nice to learn more about what makes someone tick.",
    experiences: [
      { name: "Agency name", year: "2025" },
      { name: "Studio name", year: "2024" },
      { name: "Company name", year: "2023" },
    ]
  };

  return (
    <div class="min-h-screen bg-white font-sans antialiased text-black selection:bg-black selection:text-white">
      <Navigation currentPage="about" />

      <main class="max-w-[1100px] mx-auto pt-56 px-8 md:px-16 pb-32">
        <h1 class="text-[48px] md:text-[64px] font-bold tracking-tighter mb-20 text-black">About me</h1>

        {/* 2. Introduction 部分 - 左右结构 */}
        <section class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-32">
          {/* 左侧大图：使用占位色块，你可以换成自己的 static 图片地址 */}
          <div class="aspect-[4/3] bg-[#D9F3C1] rounded-[40px] overflow-hidden shadow-sm">
            <img 
              src="/my-avatar.jpg" 
              alt="Me"
              class="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
          </div>
          {/* 右侧文本 */}
          <div class="pt-4">
            <h2 class="text-[24px] font-bold mb-6 tracking-tight">Introduction</h2>
            <p class="text-[#424245] text-[18px] leading-[1.7] tracking-tight">
              {profile.intro}
            </p>
          </div>
        </section>

        {/* 3. Interests 部分 - 顶部文本 + 下方三列图片 */}
        <section class="mb-32">
          <div class="max-w-xl mb-16">
            <h2 class="text-[24px] font-bold mb-6 tracking-tight">Interests and hobbies</h2>
            <p class="text-[#424245] text-[18px] leading-[1.7] tracking-tight">
              {profile.interestsIntro}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 三张兴趣图，对应设计稿中的不同色块/纹理 */}
            <div class="aspect-square bg-[#FFD6D6] rounded-[32px] shadow-sm hover:scale-[1.02] transition-transform duration-500"></div>
            <div class="aspect-square bg-[#D6E4FF] rounded-[32px] shadow-sm hover:scale-[1.02] transition-transform duration-500"></div>
            <div class="aspect-square bg-[#E8F5E9] rounded-[32px] shadow-sm hover:scale-[1.02] transition-transform duration-500"></div>
          </div>
        </section>

        {/* 4. Experience 部分 - 经典的列表排版 */}
        <section>
          <div class="border-t border-gray-100">
            {profile.experiences.map((exp, i) => (
              <div key={i} class="flex justify-between items-center py-10 border-b border-gray-100 group">
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
      </main>

      {/* 极简页脚 */}
      <footer class="py-20 text-center text-gray-400 text-sm tracking-tight">
        © 2026 Zijie Song. All rights reserved.
      </footer>
    </div>
  );
}