import { collections } from "../data";
import { ArrowRight, Instagram, Mark, Pinterest } from "./Icons";

const shopLinks = [
  ...collections.map((c) => ({ label: c.title, href: "#shop" })),
  { label: "Uchongaji wa Maisha", href: "#shop" },
];

const companyLinks = [
  { label: "Hadithi yetu", href: "#story" },
  { label: "Jarida", href: "#journal" },
  { label: "Watengenezaji wetu", href: "#story" },
  { label: "Tembelea studio", href: "#letter" },
  { label: "Escrow ya maagizo", href: "#escrow" },
];

const careLinks = [
  { label: "Usafirishaji na kurudisha", href: "#shop" },
  { label: "Utunzaji na ukarabati", href: "#story" },
  { label: "Kufunga zawadi", href: "#letter" },
  { label: "Sera ya escrow", href: "#escrow" },
  { label: "Kutatua mgogoro", href: "#escrow" },
  { label: "Wasiliana nasi", href: "mailto:studio@asiliudongo.co.tz" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="shell">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <Mark className="h-5 w-5 text-clay" />
              <span className="font-display text-[15px] tracking-[0.16em]">ASILI &amp; UDONGO</span>
            </a>
            <p className="mt-5 max-w-[17rem] text-[12px] leading-relaxed text-cream/50">
              Vitu kwa nyumba yenye fikira. Hununuliwa polepole, kutoka studio huru kumi na mbili
              tunazozifahamu kwa majina.
            </p>
            <address className="mt-6 space-y-1 text-[11.5px] not-italic leading-relaxed text-cream/45">
              <p>Mtaa wa Mkunguni 12, Oyster Bay</p>
              <p>Arusha, Tanzania</p>
              <p>Jumanne–Jumamosi, 11:00–17:00</p>
              <a
                href="mailto:studio@asiliudongo.co.tz"
                className="mt-2 inline-block text-cream/80 underline decoration-cream/25 underline-offset-4 transition-colors hover:text-cream"
              >
                studio@asiliudongo.co.tz
              </a>
            </address>
            <div className="mt-6 flex gap-2">
              {[Instagram, Pinterest].map((Icon, i) => (
                <a
                  key={i}
                  href="#top"
                  aria-label={i === 0 ? "Asili & Udongo kwenye Instagram" : "Asili & Udongo kwenye Pinterest"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-cream/60 hover:text-cream"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href="mailto:studio@asiliudongo.co.tz"
                aria-label="Tuma barua pepe kwa studio"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-cream/60 hover:text-cream"
              >
                <ArrowRight className="h-4 w-4 -rotate-45" />
              </a>
            </div>
          </div>

          {[
            { title: "Duka", links: shopLinks },
            { title: "Studio", links: companyLinks },
            { title: "Huduma", links: careLinks },
          ].map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <p className="eyebrow text-cream/35">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[12px] text-cream/65 transition-colors hover:text-cream">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="sm:col-span-2 lg:col-span-2">
            <p className="eyebrow text-cream/35">Barua ya polepole</p>
            <p className="mt-4 text-[11.5px] leading-relaxed text-cream/50">
              Maelezo ya studio na kazi mpya, mara mbili kwa mwezi.
            </p>
            <a
              href="#letter"
              className="group mt-4 inline-flex items-center gap-2 border-b border-cream/20 pb-1.5 text-[10px] uppercase tracking-[0.14em] text-cream/85 transition-colors hover:border-cream"
            >
              Jiandikishe
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-8 text-[9px] uppercase tracking-[0.16em] text-cream/30">Iliyoundwa Arusha</p>
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-cream/10 py-8">
          <p
            aria-hidden="true"
            className="select-none whitespace-nowrap text-center font-display text-[clamp(2rem,7.2vw,6.4rem)] font-light leading-none tracking-[0.02em] text-cream/[0.09]"
          >
            ASILI &amp; UDONGO
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/10 py-5 text-[9.5px] uppercase tracking-[0.12em] text-cream/35 sm:flex-row">
          <p>© 2026 Asili &amp; Udongo Ltd · Haki zote zimehifadhiwa</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#top" className="transition-colors hover:text-cream/70">
              Faragha
            </a>
            <a href="#top" className="transition-colors hover:text-cream/70">
              Masharti
            </a>
            <a href="#top" className="transition-colors hover:text-cream/70">
              Ufikivu
            </a>
            <a href="#admin" className="transition-colors hover:text-cream/70">
              Paneli ya msimamizi
            </a>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Mark className="h-2.5 w-2.5" /> Imeundwa kwa fikira
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
