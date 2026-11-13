import { useMemo, useState } from "react";
import {
  CATEGORIES,
  collections,
  money,
  sortLabels,
  type Category,
  type Product,
  type SortKey,
} from "../data";
import { ArrowRight, ArrowUpRight, ChevronDown, Heart, Mark, Plus, Stars } from "./Icons";
import { stockOf } from "../admin";
import SectionHead from "./SectionHead";

/* ---------------------------------- cards --------------------------------- */

type CardProps = {
  product: Product;
  saved: boolean;
  onToggleSaved: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onQuickView: (product: Product) => void;
  index: number;
};

function ProductCard({ product, saved, onToggleSaved, onQuickAdd, onQuickView, index }: CardProps) {
  const stock = stockOf(product);
  const soldOut = stock <= 0;

  return (
    <article
      className="group relative animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
    >
      <div className="relative overflow-hidden rounded-[2px] bg-sand">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-clay"
          aria-label={`Tazama ${product.name}, ${money(product.price)}`}
        >
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
            />
          </div>
          <img
            src={product.hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
              {product.badge}
            </span>
          )}

          {soldOut && (
            <span className={`absolute left-3 rounded-full bg-ink px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.14em] text-cream ${product.badge ? "top-11" : "top-3"}`}>
              Imeisha stoo
            </span>
          )}

          <span className="absolute bottom-3 left-3 right-3 hidden translate-y-2 items-center justify-between rounded-[1px] bg-paper/95 py-3 pl-4 pr-3 text-[10px] font-medium uppercase tracking-[0.13em] text-ink opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
            Tazama kwa haraka
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/15">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onToggleSaved(product)}
          aria-label={saved ? `Ondoa ${product.name} kwenye vihifadhi` : `Hifadhi ${product.name}`}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        >
          <Heart className={`h-4 w-4 ${saved ? "animate-heart-pop text-clay" : ""}`} filled={saved} />
        </button>

        <button
          type="button"
          onClick={() => onQuickAdd(product)}
          disabled={soldOut}
          aria-label={soldOut ? `${product.name} imeisha stoo` : `Weka ${product.name} kwenye kikapu`}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-clay hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay disabled:cursor-not-allowed disabled:bg-paper/70 disabled:text-stone disabled:hover:bg-paper/70 disabled:hover:text-stone sm:bottom-4 sm:right-4"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[12.5px] font-medium leading-snug tracking-[-0.01em] sm:text-[13px]">
            <button type="button" onClick={() => onQuickView(product)} className="cursor-pointer text-left hover:text-clay">
              {product.name}
            </button>
          </h3>
          <p className="mt-1 text-[9.5px] uppercase tracking-[0.12em] text-stone sm:text-[10.5px]">
            {product.category}
            {!soldOut && stock <= 4 ? " · stoo ndogo" : ""}
          </p>
          <p className="mt-0.5 text-[10px] text-stone/80 sm:hidden">{product.palette}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11.5px] font-medium tabular-nums sm:text-[12.5px]">{money(product.price)}</p>
          <p className="mt-1 hidden text-[10px] text-stone sm:block">{product.palette}</p>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------- collections ------------------------------ */

export function Collections({ onSelect }: { onSelect: (category: Category) => void }) {
  return (
    <section id="collections" className="scroll-mt-24 bg-paper py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          eyebrow="Njia nne za kuishi kwa vitu vichache, bora"
          title={
            <>
              Anza na <em className="italic text-clay">chumba,</em> si orodha ya bidhaa.
            </>
          }
          description="Mikusanyo midogo yenye fikira kwa nyakati zinazounda siku — kahawa ya kwanza, taa ya mwisho, Jumapili ndefu."
          href="#shop"
          actionLabel="Vinjari mkusanyo"
        />

        <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-x-6">
          {collections.map((collection, i) => (
            <button
              key={collection.id}
              type="button"
              onClick={() => onSelect(collection.category)}
              className={`group block text-left ${i === 1 ? "lg:mt-14" : i === 2 ? "lg:mt-6" : ""}`}
              aria-label={`Nunua ${collection.title}`}
            >
              <div className="relative overflow-hidden rounded-[2px] bg-sand">
                <img
                  src={collection.image}
                  alt={collection.title}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 text-[10px] font-medium tracking-[0.16em] text-paper/90">
                  0{i + 1}
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-paper/70">
                      Vitu {String(collection.count).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-display text-[1.5rem] leading-none text-paper sm:text-[1.7rem]">
                      {collection.title}
                    </h3>
                    <p className="mt-2 max-w-[15rem] text-[11.5px] leading-snug text-paper/75">{collection.caption}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/35 text-paper transition-all duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onSelect("Vitu")}
          className="group mt-12 flex w-full flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6 text-left lg:mt-16"
        >
          <span className="flex items-center gap-3.5">
            <Mark className="h-4 w-4 text-clay" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              Uchongaji wa Maisha — vitu vidogo vyenye uwezo
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-ink">
            Vinjari mkusanyo wa nne
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </section>
  );
}

/* ---------------------------------- shop ---------------------------------- */

type ShopProps = {
  products: Product[];
  wishlist: string[];
  category: Category | "All";
  onCategoryChange: (category: Category | "All") => void;
  onToggleSaved: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onQuickView: (product: Product) => void;
};

const filterOptions: (Category | "All")[] = ["All", ...CATEGORIES];

export default function Shop({
  products,
  wishlist,
  category,
  onCategoryChange,
  onToggleSaved,
  onQuickAdd,
  onQuickView,
}: ShopProps) {
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const filtered = category === "All" ? products : products.filter((p) => p.category === category);
    const next = [...filtered];
    if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
    if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name, "sw"));
    return next;
  }, [category, products, sort]);

  return (
    <section id="shop" className="scroll-mt-20 border-t border-ink/10 bg-cream py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          eyebrow="Mkusanyo kamili · 2026"
          title={
            <>
              Vitu vya <em className="italic text-clay">maisha ya kila siku.</em>
            </>
          }
          description="Vipande kumi na viwili, vyote vipo stoo na viko tayari kutumwa kutoka studio. Bei zinajumuisha VAT; kila kitu hutengenezwa kwa idadi ndogo, hivyo ukubwa na rangi hutofautiana kwa upole."
        />

        <div className="mt-9 flex flex-col gap-5 border-b border-ink/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
            {filterOptions.map((option) => {
              const active = category === option;
              const count = option === "All" ? products.length : products.filter((p) => p.category === option).length;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onCategoryChange(option)}
                  aria-pressed={active}
                  className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.11em] transition-all duration-300 ${
                    active
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {option === "All" ? "Vitu vyote" : option}
                  <span className={`text-[9px] tabular-nums ${active ? "text-cream/55" : "text-stone"}`}>
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-stone" aria-live="polite">
              {visible.length} {visible.length === 1 ? "kitu" : "vitu"}
            </p>
            <div className="relative">
              <label htmlFor="sort" className="sr-only">
                Panga vitu
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="max-w-[11rem] cursor-pointer appearance-none rounded-full border border-ink/15 bg-transparent py-2.5 pl-4 pr-9 text-[10.5px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-ink/40 focus:border-clay focus:outline-none sm:max-w-none"
              >
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {sortLabels[key]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft" />
            </div>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {visible.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                saved={wishlist.includes(product.id)}
                onToggleSaved={onToggleSaved}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-ink/20 px-6 py-16 text-center">
            <p className="font-display text-2xl">Hakuna kitu hapa bado.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone">
              Mkusanyo huu uko kati ya mikusanyo. Tazama vitu vingine, au tuandikie na tutakujulisha kipindi
              kinachofuata cha kupika vyungu.
            </p>
            <button type="button" onClick={() => onCategoryChange("All")} className="btn-ink mt-6">
              Tazama vitu vyote
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-6 border-t border-ink/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {products.slice(0, 4).map((p) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="h-8 w-8 rounded-full border-2 border-cream object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Stars value={4.9} />
                <span className="text-[11px] font-medium">4.9</span>
              </div>
              <p className="mt-0.5 text-[10.5px] text-stone">Maoni 2,400+ yaliyothibitishwa</p>
            </div>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed text-stone sm:text-right">
            Hujui kitu gani kinafaa? Andika kwa{" "}
            <a
              href="mailto:studio@asiliudongo.co.tz"
              className="text-ink underline decoration-ink/25 underline-offset-4 hover:text-clay"
            >
              studio@asiliudongo.co.tz
            </a>{" "}
            — mtu, si roboti, atakujibu ndani ya siku moja.
          </p>
        </div>
      </div>
    </section>
  );
}
