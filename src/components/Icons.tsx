import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Ico({ children, className = "h-5 w-5", ...rest }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: P) => (
  <Ico {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Ico>
);

export const ArrowLeft = (p: P) => (
  <Ico {...p}>
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Ico>
);

export const ArrowUpRight = (p: P) => (
  <Ico {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Ico>
);

export const ChevronDown = (p: P) => (
  <Ico {...p}>
    <path d="m6 9 6 6 6-6" />
  </Ico>
);

export const Search = (p: P) => (
  <Ico {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </Ico>
);

export const Heart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Ico {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </Ico>
);

export const Bag = (p: P) => (
  <Ico {...p}>
    <path d="M6 7h12l1.2 13H4.8L6 7Z" />
    <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
  </Ico>
);

export const Menu = (p: P) => (
  <Ico {...p}>
    <path d="M4 8h16" />
    <path d="M4 16h16" />
  </Ico>
);

export const Close = (p: P) => (
  <Ico {...p}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </Ico>
);

export const Plus = (p: P) => (
  <Ico {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Ico>
);

export const Minus = (p: P) => (
  <Ico {...p}>
    <path d="M5 12h14" />
  </Ico>
);

export const Check = (p: P) => (
  <Ico {...p}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Ico>
);

export const Trash = (p: P) => (
  <Ico {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5h6v2" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M10 11v5M14 11v5" />
  </Ico>
);

export const Star = ({ className = "h-3.5 w-3.5", ...p }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...p}>
    <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9 2.9-6Z" />
  </svg>
);

export const Truck = (p: P) => (
  <Ico {...p}>
    <path d="M2 6h11v11H2z" />
    <path d="M13 9h4l4 4v4h-8" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </Ico>
);

export const Leaf = (p: P) => (
  <Ico {...p}>
    <path d="M4 20c0-9 6-15 16-16 0 10-6 16-14 16" />
    <path d="M4 20c2-5 6-8 11-10" />
  </Ico>
);

export const Hand = (p: P) => (
  <Ico {...p}>
    <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M11 10.5V4.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M14 11V6.5a1.5 1.5 0 0 1 3 0v8" />
    <path d="M17 10.5a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7V13a1.5 1.5 0 0 1 3 0v1" />
  </Ico>
);

export const Shield = (p: P) => (
  <Ico {...p}>
    <path d="M12 3 4.5 6v6c0 4.5 3.1 7.7 7.5 9 4.4-1.3 7.5-4.5 7.5-9V6L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </Ico>
);

export const Instagram = (p: P) => (
  <Ico {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </Ico>
);

export const Pinterest = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 18.5 12.4 9" />
    <path d="M8.5 13c-.7-2.2.5-4.6 3.1-5 2.3-.4 4.2 1 4.2 3.2 0 2-1.2 3.8-3 3.8-1 0-1.8-.6-2-1.4" />
  </Ico>
);

export const Mail = (p: P) => (
  <Ico {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Ico>
);

export const Clock = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Ico>
);

export const Lock = (p: P) => (
  <Ico {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    <path d="M12 14.5v2" />
  </Ico>
);

export const Users = (p: P) => (
  <Ico {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" />
    <path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
  </Ico>
);

export const Gear = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 2.6 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9.5 4.6a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4Z" />
  </Ico>
);

export const Bell = (p: P) => (
  <Ico {...p}>
    <path d="M18 8.5a6 6 0 1 0-12 0c0 4.5-1.5 5.5-1.5 5.5h15S18 13 18 8.5Z" />
    <path d="M10 18a2 2 0 0 0 4 0" />
  </Ico>
);

export const LogOut = (p: P) => (
  <Ico {...p}>
    <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M10 16l-4-4 4-4" />
    <path d="M6 12h9" />
  </Ico>
);

export const Download = (p: P) => (
  <Ico {...p}>
    <path d="M4 16v3h16v-3" />
    <path d="M12 4v12" />
    <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
  </Ico>
);

export const Alert = (p: P) => (
  <Ico {...p}>
    <path d="M12 3 2.8 19.5h18.4L12 3Z" />
    <path d="M12 9.5v4" />
    <path d="M12 16.5h.01" />
  </Ico>
);

export const ChevronRight = (p: P) => (
  <Ico {...p}>
    <path d="m9 5 7 7-7 7" />
  </Ico>
);

export const Wallet = (p: P) => (
  <Ico {...p}>
    <rect x="2.5" y="6" width="19" height="13" rx="2" />
    <path d="M2.5 10h19" />
    <path d="M16 14.5h2.5" />
  </Ico>
);

export const Pencil = (p: P) => (
  <Ico {...p}>
    <path d="M4 20h4L20 8a2.8 2.8 0 0 0-4-4L4 16v4Z" />
    <path d="m14.5 5.5 4 4" />
  </Ico>
);

export const Eye = (p: P) => (
  <Ico {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Ico>
);

export const EyeOff = (p: P) => (
  <Ico {...p}>
    <path d="M4 4l16 16" />
    <path d="M9.5 5.9A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7" />
    <path d="M6.2 7.8A17.6 17.6 0 0 0 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 4.2-.9" />
    <path d="M10 10a2.9 2.9 0 0 0 4 4" />
  </Ico>
);

export const Upload = (p: P) => (
  <Ico {...p}>
    <path d="M4 16v3h16v-3" />
    <path d="M12 16V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
  </Ico>
);

export const Package = (p: P) => (
  <Ico {...p}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="m4 7 8 4 8-4" />
    <path d="M12 11v10" />
  </Ico>
);

export const Layout = (p: P) => (
  <Ico {...p}>
    <rect x="3" y="3.5" width="18" height="17" rx="1.5" />
    <path d="M3 9h18" />
    <path d="M9 20V9" />
  </Ico>
);

export const Copy = (p: P) => (
  <Ico {...p}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="1.5" />
    <path d="M15.5 8.5v-3a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5.5v9A1.5 1.5 0 0 0 5 16h3" />
  </Ico>
);

export function Mark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M16 2.5v27" />
        <path d="M2.5 16h27" />
        <path d="M6.5 6.5l19 19" />
        <path d="M25.5 6.5l-19 19" />
        <path d="M16 8.5c2.6 2 4.6 4.4 7.5 7.5-2.9 3.1-4.9 5.5-7.5 7.5-2.6-2-4.6-4.4-7.5-7.5 2.9-3.1 4.9-5.5 7.5-7.5Z" />
      </g>
    </svg>
  );
}

export function Stars({ value = 5, className = "" }: { value?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[2px] text-clay ${className}`} aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`h-3 w-3 ${i + 0.5 < value ? "opacity-100" : "opacity-25"}`} />
      ))}
    </span>
  );
}
