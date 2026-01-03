import { JSX } from "preact";

interface NavigationProps {
  currentPage?: "things" | "about" | "portfolio";
}

export default function Navigation({ currentPage = "things" }: NavigationProps) {
  return (
    <nav class="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
      <div class="flex items-center gap-10 px-10 py-3 bg-[#F2F2F2]/90 backdrop-blur-2xl rounded-full border border-white/30 shadow-lg shadow-black/5">
        <a 
          href="/" 
          class={`text-[15px] transition-colors font-medium ${
            currentPage === "things" 
              ? "text-black font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1.5px] after:bg-black relative" 
              : "text-black/50 hover:text-black"
          }`}
        >
          Things
        </a>
        <a 
          href="/about" 
          class={`text-[15px] transition-colors font-medium ${
            currentPage === "about" 
              ? "text-black font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1.5px] after:bg-black relative" 
              : "text-black/50 hover:text-black"
          }`}
        >
          About
        </a>
        <a 
          href="/portfolio" 
          class={`text-[15px] transition-colors font-medium ${
            currentPage === "portfolio" 
              ? "text-black font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1.5px] after:bg-black relative" 
              : "text-black/50 hover:text-black"
          }`}
        >
          Portfolio
        </a>
      </div>
    </nav>
  );
}
