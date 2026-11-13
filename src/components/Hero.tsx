import { asSeenIn, img, money, type Product } from "../data";
import { ArrowRight, ArrowUpRight, Hand, Leaf, Mark, Shield, Stars, Truck } from "./Icons";

function SlowBadge() {
  return (
    <div className="absolute -left-5 bottom-24 z-20 hidden h-[104px] w-[104px] items-center justify-center rounded-full bg-cream shadow-soft md:flex lg:-left-10">
      <svg viewBox="0 0 100 100" className="slow-spin absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-ink/70 text-[8px] uppercase" style={{ letterSpacing: "0.16em" }}>
          <textPath href="#badge-path" startOffset="0%">
            Kwa mkono · Kundi dogo · Ya kudumu ·
          </textPath>
        </text>
      </svg>
      <Mark className="h-7 w-7 text-clay" />
    </div>
  );
}

type Props = {
  onQuickView: (product: Product) => void;
  catalogue: Product[];
  threshold?: number;
};

export default function Hero({ onQuickView, catalogue, threshold = 300000 }: Props) {
  const featured = catalogue[0];
  const avatars = catalogue.slice(0, 3);

  return (
    <section id="top" className="grain relative overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-sand/60 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/3 h-[420px] w-[420px] rounded-full bg-clay/[0.07] blur-[110px]"
      />

      <div className="shell relative z-10 pt-10 pb-12 sm:pt-14 lg:pt-16 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="relative lg:col-span-6 lg:pr-6">
            <div className="flex animate-fade-up items-center gap-3">
              <span className="h-px w-8 bg-clay" />
              <p className="eyebrow text-clay">Tangu 2014 — Dar es Salaam</p>
            </div>

            <h1
              className="mt-6 animate-fade-up text-balance font-display text-[clamp(2.75rem,5.8vw,5.2rem)] font-light leading-[0.94] tracking-[-0.03em]"
              style={{ animationDelay: "80ms" }}
            >
              Nyumba hujengwa
              <br className="hidden sm:block" /> kwa vitu{" "}
              <em className="relative inline-block font-normal italic text-clay">
                vitulivu.
                <svg
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2 w-full text-clay/35"
                  aria-hidden="true"
                >
                  <path d="M2 8c40-6 90-6 196-4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </em>
            </h1>

            <p
              className="mt-7 max-w-[31rem] animate-fade-up text-[15px] leading-[1.75] text-ink-soft/90 sm:text-base"
              style={{ animationDelay: "160ms" }}
            >
              Vyungu vilivyotengenezwa kwa mikono, vitambaa vya asili na vitu vidogo vya kipekee — kutoka studio
              kumi na mbili huru za Tanzania, vilivyochaguliwa kutumika kila siku, kisha kudumu miongo.
            </p>

            <div
              className="mt-9 flex animate-fade-up flex-col items-stretch gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "240ms" }}
            >
              <a href="#shop" className="btn-clay group">
                Nunua mkusanyo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#story"
                className="group inline-flex items-center justify-center gap-2 px-2 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:text-clay"
              >
                Wajue watengenezaji
                <span className="relative">
                  <span className="block h-px w-full bg-ink/30 transition-colors group-hover:bg-clay" />
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div
              className="mt-10 flex animate-fade-up flex-wrap items-center gap-x-5 gap-y-4 border-t border-ink/10 pt-6"
              style={{ animationDelay: "320ms" }}
            >
              {avatars.length > 0 && (
                <div className="flex -space-x-3">
                  {avatars.map((p) => (
                    <img
                      key={p.id}
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-10 w-10 rounded-full border-2 border-cream object-cover"
                    />
                  ))}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Stars value={4.9} />
                  <span className="text-[11px] font-medium tracking-wide">4.9 / 5</span>
                </div>
                <p className="mt-0.5 text-[11px] text-stone">Kutoka nyumba 2,400+ zenye fikira</p>
              </div>
              <div className="hidden h-9 w-px bg-ink/10 sm:block" />
              <p className="hidden max-w-[9.5rem] text-[11px] leading-snug text-stone sm:block">
                Usafirishaji bure kwa oda zaidi ya {money(threshold)}
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative ml-auto w-full max-w-[560px]">
              <div
                aria-hidden="true"
                className="absolute -right-3 -top-3 hidden h-full w-full rounded-t-[260px] border border-clay/25 sm:block"
              />
              <div
                className="group relative block w-full overflow-hidden rounded-t-[220px] rounded-b-[3px] bg-sand text-left shadow-soft sm:rounded-t-[260px]"
              >
                <img
                  src={img(33878988, 1000, 1350)}
                  alt="Chungu cha udongo wa Tanzania kilichotengenezwa kwa mkono, kikiwa kwenye rafu ya mti katika studio yenye joto"
                  className="img-zoom h-[440px] w-full object-cover object-center sm:h-[560px] lg:h-[620px]"
                />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute left-1/2 top-7 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-paper sm:top-9">
                  <Mark className="h-4 w-4" />
                  <span className="text-[9px] uppercase tracking-[0.22em]">Mkusanyo Mpya / 2026</span>
                </div>
                <div className="absolute bottom-6 left-6 hidden max-w-[13rem] text-paper sm:block">
                  <p className="font-display text-[1.45rem] italic leading-[1.1]">Maisha ya polepole</p>
                  <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-paper/70">Picha kutoka studio yetu</p>
                </div>
              </div>

              {featured && (
              <button
                type="button"
                onClick={() => onQuickView(featured)}
                className="group absolute -bottom-5 left-3 z-20 flex w-[286px] items-start gap-3 rounded-[2px] border border-ink/10 bg-paper p-3 text-left shadow-soft transition-transform duration-300 hover:-translate-y-1 sm:left-auto sm:-right-4 lg:-right-6"
              >
                <img
                  src={featured.image}
                  alt={featured.name}
                  loading="lazy"
                  className="h-[74px] w-[62px] rounded-[1px] object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-[8.5px] text-stone">Kipenzi cha studio</span>
                  <span className="mt-1 block font-display text-[15px] leading-[1.1]">{featured.name}</span>
                  <span className="mt-1.5 block text-[11px] text-ink-soft">
                    {money(featured.price)} · {featured.palette}
                  </span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-paper">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
              )}

              <SlowBadge />
            </div>

            <div className="mt-12 flex items-center justify-between gap-4 sm:mt-10 sm:pl-2">
              <p className="max-w-[15rem] text-[11px] leading-relaxed text-stone">
                Kila kitu huchaguliwa kwa mikono, uso kwa uso, katika studio ya mtengenezaji.
              </p>
              <a
                href="#journal"
                className="group inline-flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-clay"
              >
                Soma jarida
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-ink/10">
        <div className="shell grid divide-ink/10 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {[
            { icon: Hand, title: "Imetengenezwa kwa mkono", note: "Studio huru kumi na mbili" },
            { icon: Truck, title: `Bure zaidi ya ${money(threshold)}`, note: "Bila kaboni, bila plastiki" },
            { icon: Leaf, title: "Malighafi asilia", note: "Udongo, kitani, mninga, pamba" },
            { icon: Shield, title: "Kurudisha siku 30", note: "Ishi nayo kabla ya kuamua" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3.5 py-5 sm:px-5 sm:first:pl-0 lg:py-6">
              <item.icon className="h-[18px] w-[18px] shrink-0 text-clay" />
              <div>
                <p className="text-[10.5px] font-medium uppercase tracking-[0.1em]">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-stone">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-ink/10 bg-paper/50 py-3.5">
        <div className="relative flex overflow-hidden">
          <div className="marquee-track flex w-max shrink-0 items-center">
            {[0, 1].map((set) => (
              <div key={set} className="flex items-center">
                {asSeenIn.map((name) => (
                  <span key={`${set}-${name}`} className="flex items-center">
                    <span className="px-8 font-display text-lg tracking-wide text-ink/45 sm:px-12 sm:text-xl">{name}</span>
                    <Mark className="h-2.5 w-2.5 text-clay/50" />
                  </span>
                ))}
                <span className="px-8 text-[9px] uppercase tracking-[0.18em] text-stone sm:px-12">
                  Nyumba zenye fikira zimetutegemea tangu 2014
                </span>
                <Mark className="h-2.5 w-2.5 text-clay/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
