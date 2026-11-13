import { useEffect, type ReactNode } from "react";
import type { BadgeTone, RevenuePoint } from "../../admin";
import { moneyTZS } from "../../escrow";
import { ChevronDown, ChevronRight, Close, Search } from "../Icons";

/* --------------------------------- basics --------------------------------- */

const toneStyles: Record<BadgeTone, string> = {
  neutral: "border-ink/15 bg-ink/[0.04] text-ink-soft",
  clay: "border-clay/30 bg-clay/10 text-clay-deep",
  olive: "border-olive/30 bg-olive/10 text-olive-deep",
  amber: "border-amber-700/25 bg-amber-500/10 text-amber-800",
  dark: "border-ink bg-ink text-cream",
  danger: "border-clay-deep/40 bg-clay-deep text-cream",
  stone: "border-stone/35 bg-stone/10 text-ink-soft",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-ink/10 bg-paper ${className}`}>{children}</div>;
}

export function CardHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 px-4 py-3.5 sm:px-5">
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.1em]">{title}</h3>
        {subtitle && <p className="mt-1 text-[10px] leading-snug text-stone">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="eyebrow text-[9px] text-clay">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-[11px] leading-relaxed text-stone">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  delta,
  icon,
  onClick,
  emphasis,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: number;
  icon?: ReactNode;
  onClick?: () => void;
  emphasis?: boolean;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group relative w-full border border-ink/10 bg-paper p-4 text-left sm:p-5 ${
        onClick ? "cursor-pointer transition-colors hover:border-ink/30" : ""
      } ${emphasis ? "border-clay/25 bg-clay/[0.03]" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[9px] uppercase leading-snug tracking-[0.11em] text-stone">{label}</p>
        <span className="text-clay">{icon}</span>
      </div>
      <p className="mt-2.5 font-display text-[1.5rem] leading-none tabular-nums sm:text-[1.75rem]">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        {typeof delta === "number" && (
          <span
            className={`text-[9px] font-medium tabular-nums ${delta >= 0 ? "text-olive" : "text-clay-deep"}`}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
        {hint && <p className="text-[9.5px] leading-snug text-stone">{hint}</p>}
      </div>
    </Tag>
  );
}

/* --------------------------------- charts --------------------------------- */

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
  const max = Math.max(1, ...series.map((point) => point.shop + point.escrow));

  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2.5" style={{ height: 190 }}>
        {series.map((point) => {
          const total = point.shop + point.escrow;
          const shopHeight = (point.shop / max) * 100;
          const escrowHeight = (point.escrow / max) * 100;
          return (
            <div key={point.label} className="group flex h-full flex-1 flex-col justify-end">
              <div className="relative flex h-full flex-col justify-end">
                <div
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-ink/15 bg-ink px-2.5 py-1.5 text-[9px] text-cream shadow-lg group-hover:block"
                >
                  <span className="block font-medium">{point.label}</span>
                  <span className="mt-0.5 block tabular-nums">{moneyTZS(total)}</span>
                  <span className="block text-cream/50">
                    Duka {moneyTZS(point.shop)} · Escrow {moneyTZS(point.escrow)}
                  </span>
                </div>
                {escrowHeight > 0 && (
                  <div
                    className="w-full rounded-t-[2px] bg-olive/70"
                    style={{ height: `${Math.max(escrowHeight, 1.5)}%` }}
                  />
                )}
                {shopHeight > 0 && (
                  <div
                    className={`w-full bg-clay ${escrowHeight > 0 ? "" : "rounded-t-[2px]"}`}
                    style={{ height: `${Math.max(shopHeight, 1.5)}%` }}
                  />
                )}
                {total === 0 && <div className="w-full border-t border-dashed border-ink/15" />}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5 border-t border-ink/10 pt-2 sm:gap-2.5">
        {series.map((point) => (
          <span key={point.label} className="flex-1 truncate text-center text-[8px] uppercase tracking-[0.04em] text-stone">
            {point.label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-[0.1em] text-stone">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[1px] bg-clay" /> Duka
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[1px] bg-olive/70" /> Escrow
        </span>
      </div>
    </div>
  );
}

export function ChannelDonut({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-[138px] w-[138px] shrink-0">
        <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
          <circle cx="55" cy="55" r={radius} fill="none" stroke="#e8ddcb" strokeWidth="12" />
          {segments.map((segment) => {
            const fraction = total > 0 ? segment.value / total : 0;
            const dash = fraction * circumference;
            const element = (
              <circle
                key={segment.label}
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return element;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <span className="text-[7.5px] uppercase tracking-[0.12em] text-stone">Jumla</span>
          <span className="mt-0.5 font-display text-[10.5px] leading-tight tabular-nums">{moneyTZS(total)}</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[10.5px] text-ink-soft">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className="text-[10.5px] tabular-nums text-ink">{moneyTZS(segment.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------- inputs --------------------------------- */

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string | ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow mb-1.5 block text-[9px] text-stone">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[10px] text-clay">{error}</p>
      ) : (
        hint && <div className="mt-1 text-[9.5px] leading-relaxed text-stone">{hint}</div>
      )}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field py-2.5 pl-10 text-[12px]"
      />
    </div>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9.5px] uppercase tracking-[0.08em] transition-colors ${
            value === option.id
              ? "border-ink bg-ink text-cream"
              : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40 hover:text-ink"
          }`}
        >
          {option.label}
          {typeof option.count === "number" && (
            <span className={`tabular-nums ${value === option.id ? "text-cream/55" : "text-stone"}`}>
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-paper py-2 pl-3.5 pr-8 text-[10px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink/40 focus:border-clay focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone" />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 border border-ink/12 bg-cream/50 px-3.5 py-3">
      <span>
        <span className="block text-[11.5px] font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-[10px] leading-relaxed text-stone">{description}</span>}
      </span>
      <span
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-olive" : "bg-ink/20"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`absolute h-4 w-4 rounded-full bg-paper shadow-sm transition-all ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </label>
  );
}

/* -------------------------------- overlays -------------------------------- */

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = "lg",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg" | "xl";
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const width = size === "sm" ? "max-w-md" : size === "xl" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-ink/55 p-0 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={`relative my-0 w-full ${width} animate-soft-in bg-paper shadow-2xl sm:my-4`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/10 bg-paper/97 px-5 py-4 backdrop-blur-sm sm:px-6">
          <div>
            {subtitle && <p className="eyebrow text-[9px] text-stone">{subtitle}</p>}
            <h2 className="mt-1 font-display text-[1.4rem] leading-none sm:text-[1.65rem]">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Funga" className="icon-btn -mr-2">
            <Close className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-paper/97 px-5 py-3.5 backdrop-blur-sm sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  text,
  confirmLabel,
  destructive,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  confirmLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm animate-soft-in border border-ink/10 bg-paper p-5 shadow-2xl">
        <h3 className="font-display text-[1.3rem] leading-tight">{title}</h3>
        <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft/85">{text}</p>
        <div className="mt-5 flex gap-2.5">
          <button type="button" onClick={onCancel} className="btn-outline flex-1 px-4 py-2.5 text-[9.5px]">
            Ghairi
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn flex-1 px-4 py-2.5 text-[9.5px] ${
              destructive ? "bg-clay-deep text-paper hover:bg-ink" : "bg-clay text-paper hover:bg-clay-deep"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Drawer({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-[520px] animate-slide-left flex-col bg-paper shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4">
          <div className="min-w-0">
            {subtitle && <p className="eyebrow text-[9px] text-stone">{subtitle}</p>}
            <h2 className="mt-1 truncate font-display text-[1.35rem] leading-tight">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Funga" className="icon-btn -mr-2 shrink-0">
            <Close className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-ink/10 px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-ink/20 bg-paper px-5 py-14 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/35">
        {icon}
      </span>
      <p className="mt-3 font-display text-[1.45rem] leading-tight">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[11.5px] leading-relaxed text-stone">{text}</p>
      {action && <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">{action}</div>}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  showing,
  total,
  onPage,
}: {
  page: number;
  pages: number;
  showing: number;
  total: number;
  onPage: (next: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-4 py-3">
      <p className="text-[9.5px] uppercase tracking-[0.09em] text-stone">
        {showing} kati ya {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="cursor-pointer rounded-full border border-ink/15 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          Nyuma
        </button>
        <span className="px-1 text-[9.5px] tabular-nums text-stone">
          {page} / {Math.max(1, pages)}
        </span>
        <button
          type="button"
          onClick={() => onPage(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="cursor-pointer rounded-full border border-ink/15 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-ink/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          Mbele
        </button>
      </div>
    </div>
  );
}

export function RowLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 text-[9px] uppercase tracking-[0.09em] text-ink-soft transition-colors hover:text-clay"
    >
      {label}
      <ChevronRight className="h-3 w-3" />
    </button>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
