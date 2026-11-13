import { useEffect, useState } from "react";
import { ArrowRight, Bag, Close, Heart, Mark, Menu, Search, Shield } from "./Icons";

const announcements = [
  "Usafirishaji bure kwa oda zaidi ya TSh 300,000",
  "Zawadi ndogo ya studio katika kila oda",
  "Mkusanyo mpya — kazi mpya kutoka Bagamoyo",
];

const mobileAnnouncements = [
  "Usafirishaji bure zaidi ya TSh 300,000",
  "Zawadi ya studio katika kila oda",
  "Kazi mpya zimetua",
];

export function AnnouncementBar({ announcement }: { announcement?: string }) {
  const [index, setIndex] = useState(0);
  const messages = announcement ? [announcement, ...announcements.slice(1)] : announcements;

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4200);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div className="relative z-40 bg-ink text-cream">
      <div className="shell flex h-9 items-center justify-between gap-4 text-[9.5px] uppercase tracking-[0.18em]">
        <a href="#story" className="hidden text-cream/55 transition-colors hover:text-cream md:inline">
          Tangu 2014 · Arusha
        </a>
        <div className="relative mx-auto h-full flex-1 overflow-hidden md:mx-0 md:flex-none">
          <div className="flex h-full items-center justify-center">
            <p key={index} className="max-w-full animate-fade-in truncate text-center text-cream/90">
              <span className="sm:hidden">{announcement || mobileAnnouncements[index % mobileAnnouncements.length]}</span>
              <span className="hidden sm:inline">{messages[index % messages.length]}</span>
            </p>
          </div>
        </div>
        <a
          href="#shop"
          className="hidden items-center gap-1.5 text-cream/70 transition-colors hover:text-cream md:inline-flex"
        >
          Nunua mkusanyo <ArrowRight className="h-3 w-3" />
        </a>
        <div className="hidden items-center gap-1 md:hidden" aria-hidden="true">
          {messages.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full transition-colors ${i === index ? "bg-cream" : "bg-cream/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const links = [
  { label: "Duka", href: "#shop" },
  { label: "Mikusanyo", href: "#collections" },
  { label: "Hadithi Yetu", href: "#story" },
  { label: "Jarida", href: "#journal" },
  { label: "Escrow", href: "#escrow" },
];

type Props = {
  cartCount: number;
  wishlistCount: number;
  activeCommissions: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenEscrow: () => void;
};

export default function Header({
  cartCount,
  wishlistCount,
  activeCommissions,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenEscrow,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/10 bg-cream/92 shadow-[0_10px_40px_-30px_rgba(33,31,26,0.6)] backdrop-blur-md"
            : "border-b border-transparent bg-cream/80 backdrop-blur-sm"
        }`}
      >
        <div className="shell grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[78px]">
          <nav className="hidden items-center gap-4 lg:flex xl:gap-7" aria-label="Urambazaji mkuu">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-2 text-[11px] font-medium uppercase tracking-[0.13em] text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="icon-btn -ml-2.5 justify-self-start lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Fungua menyu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a href="#top" className="group flex flex-col items-center gap-1 px-1" aria-label="Asili na Udongo, ukurasa wa mwanzo">
            <Mark className="h-4 w-4 text-clay transition-transform duration-500 group-hover:rotate-90 lg:h-[18px] lg:w-[18px]" />
            <span className="whitespace-nowrap font-display text-[13px] leading-none tracking-[0.13em] text-ink min-[380px]:text-[14px] sm:text-[16px] sm:tracking-[0.17em] lg:text-[18px]">
              ASILI &amp; UDONGO
            </span>
            <span className="hidden text-[7px] uppercase tracking-[0.28em] text-stone lg:block">
              Vitu kwa nyumba yenye fikira
            </span>
          </a>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
            <button
              type="button"
              className="icon-btn relative hidden sm:inline-flex"
              onClick={onOpenEscrow}
              aria-label={`Escrow na maagizo, ${activeCommissions} hai`}
            >
              <Shield className="h-[19px] w-[19px]" />
              {activeCommissions > 0 && (
                <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[9px] font-medium text-cream">
                  {activeCommissions}
                </span>
              )}
            </button>
            <button
              type="button"
              className="icon-btn hidden sm:inline-flex"
              onClick={onOpenSearch}
              aria-label="Tafuta vitu"
            >
              <Search className="h-[19px] w-[19px]" />
            </button>
            <button
              type="button"
              className="icon-btn relative hidden sm:inline-flex"
              onClick={onOpenWishlist}
              aria-label={`Vitu vilivyohifadhiwa, ${wishlistCount}`}
            >
              <Heart className="h-[19px] w-[19px]" filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[9px] font-medium text-paper">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="icon-btn relative"
              onClick={onOpenCart}
              aria-label={`Fungua kikapu, vitu ${cartCount}`}
            >
              <Bag className="h-[20px] w-[20px]" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[9px] font-medium text-paper">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-cream lg:hidden" role="dialog" aria-modal="true" aria-label="Menyu">
          <div className="shell flex h-16 items-center justify-between border-b border-ink/10">
            <a href="#top" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
              <Mark className="h-4 w-4 text-clay" />
              <span className="font-display text-[13px] tracking-[0.16em]">ASILI &amp; UDONGO</span>
            </a>
            <button type="button" className="icon-btn -mr-2.5" onClick={() => setMenuOpen(false)} aria-label="Funga menyu">
              <Close className="h-5 w-5" />
            </button>
          </div>

          <div className="shell flex flex-1 flex-col justify-between overflow-y-auto py-10">
            <nav className="flex flex-col" aria-label="Menyu ya simu">
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex animate-fade-up items-baseline justify-between border-b border-ink/10 py-5"
                  style={{ animationDelay: `${80 + i * 60}ms` }}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-[10px] tracking-[0.2em] text-clay">0{i + 1}</span>
                    <span className="font-display text-[2rem] leading-none">{link.label}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 -rotate-45 text-stone transition-transform duration-300 group-hover:rotate-0 group-hover:text-clay" />
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenEscrow();
                }}
                className="btn-ink w-full px-4 py-3.5 text-[10px]"
              >
                <Shield className="h-4 w-4" /> Escrow na maagizo
                {activeCommissions > 0 ? ` (${activeCommissions})` : ""}
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenWishlist();
                  }}
                  className="btn-outline flex-1 px-3 py-3.5 text-[10px]"
                >
                  <Heart className="h-4 w-4" /> Vihifadhi {wishlistCount > 0 ? `(${wishlistCount})` : ""}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="btn-outline flex-1 px-3 py-3.5 text-[10px]"
                >
                  <Search className="h-4 w-4" /> Tafuta
                </button>
              </div>
              <p className="text-xs leading-relaxed text-stone">
                Duka letu la studio liko wazi Jumanne hadi Jumamosi, 11–17.
                <br />
                Mtaa wa Mkunguni 12, Oyster Bay, Arusha.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
