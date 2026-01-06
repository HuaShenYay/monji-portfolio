interface LinkProps {
  href: string;
  children: preact.JSX.Element | string;
  target?: "_blank" | "_self";
  rel?: string;
  class?: string;
}

export default function Link({ 
  href, 
  children, 
  target = "_blank", 
  rel = "noopener noreferrer",
  class: className = ""
}: LinkProps) {
  return (
    <a
      href={href}
      class={`inline-flex items-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded text-slate-600 hover:text-slate-800 border-b border-dotted border-slate-400 hover:border-solid hover:border-slate-600 focus:ring-slate-500 hover:border-4 ${className}`}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}
