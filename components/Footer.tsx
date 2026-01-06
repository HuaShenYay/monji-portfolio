export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="mt-8">
      <div class="max-w-[1100px] mx-auto px-4 sm:px-8 md:px-16 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-[14px] text-[#86868B]">
        <div class="leading-relaxed">
          <div class="text-black/80 font-medium">© {year} Monji</div>
          <div>All rights reserved.</div>
        </div>

        <div class="flex flex-wrap gap-x-6 gap-y-2">
          <a
            class="text-black/70 hover:text-black transition-colors font-medium"
            href="/rights"
          >
            版权声明
          </a>
        </div>
      </div>
    </footer>
  );
}
