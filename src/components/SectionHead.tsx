import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  light?: boolean;
};

export default function SectionHead({ eyebrow, title, description, actionLabel, onAction, href, light }: Props) {
  return (
    <div
      className={`flex flex-col gap-7 border-t pt-6 sm:flex-row sm:items-end sm:justify-between lg:gap-12 ${
        light ? "border-cream/15" : "border-ink/10"
      }`}
    >
      <div className="max-w-2xl">
        <p className={`eyebrow ${light ? "text-cream/60" : "text-clay"}`}>{eyebrow}</p>
        <h2
          className={`mt-4 text-balance font-display text-[clamp(1.9rem,3.6vw,3.15rem)] font-light leading-[1.04] tracking-[-0.02em] ${
            light ? "text-cream" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-4 max-w-xl text-sm leading-relaxed ${light ? "text-cream/65" : "text-ink-soft/80"}`}>
            {description}
          </p>
        )}
      </div>
      {actionLabel &&
        (href ? (
          <a
            href={href}
            className={`group inline-flex shrink-0 items-center gap-2.5 border-b pb-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] transition-colors ${
              light ? "border-cream/25 text-cream hover:border-cream" : "border-ink/20 text-ink hover:border-clay hover:text-clay"
            }`}
          >
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className={`group inline-flex shrink-0 items-center gap-2.5 border-b pb-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] transition-colors ${
              light ? "border-cream/25 text-cream hover:border-cream" : "border-ink/20 text-ink hover:border-clay hover:text-clay"
            }`}
          >
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ))}
    </div>
  );
}
