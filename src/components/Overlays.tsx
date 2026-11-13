import { useEffect, useRef, useState } from "react";
import { money, type Article, type Product } from "../data";
import { stockOf } from "../admin";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bag,
  Check,
  Close,
  Heart,
  Leaf,
  Mark,
  Minus,
  Plus,
  Search,
  Shield,
  Stars,
  Trash,
  Truck,
} from "./Icons";

export type CartEntry = { product: Product; qty: number };

/* --------------------------------- helpers -------------------------------- */

function useDialog(onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, []);
}

function QtyControl({
  qty,
  onChange,
  compact,
}: {
  qty: number;
  onChange: (next: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={`inline-flex items-center border border-ink/20 ${compact ? "h-8" : "h-11"}`}>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        aria-label="Punguza idadi"
        className="flex h-full w-8 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className={`min-w-7 text-center tabular-nums ${compact ? "text-[11px]" : "text-xs"}`} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Ongeza idadi"
        className="flex h-full w-8 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-ink/5"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function FreeShippingMeter({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / Math.max(1, threshold)) * 100);

  return (
    <div className="mb-5">
      <p className="text-[10.5px] leading-relaxed text-ink-soft">
        {remaining > 0 ? (
          <>
            Umebaki <span className="font-medium text-ink">{money(remaining)}</span> kupata usafirishaji bure.
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-medium text-olive">
            <Check className="h-3 w-3" /> Umepata usafirishaji bure
          </span>
        )}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/10">
        <div className="h-full rounded-full bg-clay transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* -------------------------------- cart drawer ------------------------------ */

export type OrderDraft = {
  customer: { name: string; email: string; address: string; city: string; postcode: string };
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
  subtotal: number;
  shipping: number;
  total: number;
};

type CartProps = {
  entries: CartEntry[];
  onClose: () => void;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onBrowse: () => void;
  shippingFee: number;
  freeShippingThreshold: number;
  storeOpen: boolean;
  onPlaceOrder: (draft: OrderDraft) => string | null;
};

export function CartDrawer({
  entries,
  onClose,
  onQty,
  onRemove,
  onClear,
  onBrowse,
  shippingFee,
  freeShippingThreshold,
  storeOpen,
  onPlaceOrder,
}: CartProps) {
  useDialog(onClose);
  const [step, setStep] = useState<"bag" | "details" | "done">("bag");
  const [fields, setFields] = useState({ email: "", name: "", address: "", city: "", postcode: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderRef, setOrderRef] = useState("");
  const [firstName, setFirstName] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [paidTotal, setPaidTotal] = useState(0);

  const subtotal = entries.reduce((sum, entry) => sum + entry.product.price * entry.qty, 0);
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : shippingFee;
  const total = subtotal + shipping;
  const count = entries.reduce((sum, entry) => sum + entry.qty, 0);

  const update = (key: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) next.email = "Weka barua pepe sahihi.";
    if (fields.name.trim().length < 2) next.name = "Weka jina lako kamili.";
    if (fields.address.trim().length < 4) next.address = "Weka anwani ya mtaa.";
    if (fields.city.trim().length < 2) next.city = "Weka mji wako.";
    if (fields.postcode.trim().length < 3) next.postcode = "Weka msimbo sahihi wa posta.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const reference = onPlaceOrder({
      customer: {
        name: fields.name.trim(),
        email: fields.email.trim(),
        address: fields.address.trim(),
        city: fields.city.trim(),
        postcode: fields.postcode.trim(),
      },
      items: entries.map(({ product, qty }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
        image: product.image,
      })),
      subtotal,
      shipping,
      total,
    });
    if (!reference) return;
    setOrderRef(reference);
    setFirstName(fields.name.trim().split(" ")[0]);
    setEmailConfirm(fields.email.trim());
    setPaidTotal(total);
    setStep("done");
    onClear();
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label="Kikapu chako">
      <div className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-[452px] animate-slide-left flex-col bg-paper shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            {step === "details" && (
              <button
                type="button"
                onClick={() => setStep("bag")}
                aria-label="Rudi kwenye kikapu"
                className="icon-btn -ml-2 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="eyebrow text-[9px] text-stone">
                {step === "bag" ? "Asili & Udongo" : step === "details" ? "Malipo salama" : "Oda imethibitishwa"}
              </p>
              <h2 className="mt-0.5 font-display text-xl leading-none">
                {step === "bag"
                  ? `Kikapu chako${count ? ` (${count})` : ""}`
                  : step === "details"
                    ? "Tukutumie wapi?"
                    : "Asante"}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Funga kikapu" className="icon-btn -mr-2">
            <Close className="h-5 w-5" />
          </button>
        </div>

        {step === "bag" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {entries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/15 text-ink/60">
                    <Bag className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl">Kikapu chako ni kimya.</h3>
                  <p className="mt-2 max-w-[17rem] text-[12.5px] leading-relaxed text-stone">
                    Kijaze na kitu kinachofaa, kilichotengenezwa kwa mkono na cha kudumu.
                  </p>
                  <button type="button" onClick={onBrowse} className="btn-clay mt-6">
                    Vinjari mkusanyo
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <FreeShippingMeter subtotal={subtotal} threshold={freeShippingThreshold} />
                  <ul className="divide-y divide-ink/10 border-t border-ink/10">
                    {entries.map(({ product, qty }) => (
                      <li key={product.id} className="flex gap-3.5 py-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-[102px] w-[82px] shrink-0 rounded-[1px] object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate font-display text-[15.5px] leading-tight">{product.name}</p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-stone">
                                  {product.palette} · {product.category}
                                </p>
                              </div>
                              <p className="shrink-0 text-[12px] font-medium tabular-nums">
                                {money(product.price * qty)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <QtyControl compact qty={qty} onChange={(next) => onQty(product.id, next)} />
                            <button
                              type="button"
                              onClick={() => onRemove(product.id)}
                              className="inline-flex cursor-pointer items-center gap-1 text-[9.5px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-clay"
                            >
                              <Trash className="h-3.5 w-3.5" /> Ondoa
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-start gap-2.5 border border-olive/20 bg-olive/[0.05] p-3.5">
                    <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
                    <p className="text-[10.5px] leading-relaxed text-ink-soft/80">
                      Kila oda hufungwa kwa mkono katika karatasi iliyotumika tena, pamoja na zawadi ndogo ya studio.
                      Hakuna plastiki, kamwe.
                    </p>
                  </div>
                </>
              )}
            </div>

            {entries.length > 0 && (
              <div className="shrink-0 border-t border-ink/10 bg-paper px-5 py-4 sm:px-6">
                <dl className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Jumla ndogo</dt>
                    <dd className="tabular-nums">{money(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Usafirishaji</dt>
                    <dd className="tabular-nums">{shipping === 0 ? "Bila malipo" : money(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-2 text-[14px] font-medium">
                    <dt>Jumla</dt>
                    <dd className="tabular-nums">{money(total)}</dd>
                  </div>
                </dl>
                <button type="button" onClick={() => setStep("details")} className="btn-clay mt-4 w-full">
                  Endelea kulipa
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-stone">
                  <Shield className="h-3 w-3" /> Malipo salama · Kurudisha siku 30
                </p>
              </div>
            )}
          </>
        )}

        {step === "details" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="mb-5 flex items-center justify-between border border-ink/10 bg-cream/60 px-3.5 py-3 text-[11px]">
                <span className="text-ink-soft">
                  {count} {count === 1 ? "kitu" : "vitu"} · {shipping === 0 ? "usafirishaji bure" : money(shipping)}
                </span>
                <span className="font-medium tabular-nums">{money(total)}</span>
              </div>

              <form onSubmit={placeOrder} noValidate className="space-y-3.5">
                <div>
                  <label htmlFor="checkout-email" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Barua pepe
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    value={fields.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="wewe@mfano.com"
                    className="field"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="mt-1 text-[10px] text-clay">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-name" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Jina kamili
                  </label>
                  <input
                    id="checkout-name"
                    autoComplete="name"
                    value={fields.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Studio Asili"
                    className="field"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-[10px] text-clay">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-address" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Anwani ya mtaa
                  </label>
                  <input
                    id="checkout-address"
                    autoComplete="street-address"
                    value={fields.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Mtaa wa Mikocheni 14"
                    className="field"
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && <p className="mt-1 text-[10px] text-clay">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-postcode" className="eyebrow mb-1.5 block text-[9px] text-stone">
                      Msimbo wa posta
                    </label>
                    <input
                      id="checkout-postcode"
                      autoComplete="postal-code"
                      value={fields.postcode}
                      onChange={(e) => update("postcode", e.target.value)}
                      placeholder="14112"
                      className="field"
                      aria-invalid={Boolean(errors.postcode)}
                    />
                    {errors.postcode && <p className="mt-1 text-[10px] text-clay">{errors.postcode}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-city" className="eyebrow mb-1.5 block text-[9px] text-stone">
                      Mji
                    </label>
                    <input
                      id="checkout-city"
                      autoComplete="address-level2"
                      value={fields.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Arusha"
                      className="field"
                      aria-invalid={Boolean(errors.city)}
                    />
                    {errors.city && <p className="mt-1 text-[10px] text-clay">{errors.city}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-2.5 border border-ink/10 bg-cream/60 p-3">
                  <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay" />
                  <p className="text-[10.5px] leading-relaxed text-ink-soft/80">
                    Uwasilishaji bila kaboni katika siku 2–4 za kazi.{" "}
                    {shipping === 0 ? "Bila malipo kwa oda hii." : `${money(shipping)} ya usafirishaji.`}
                  </p>
                </div>
                {!storeOpen && (
                  <p className="border border-clay/25 bg-clay/[0.06] p-3 text-[10.5px] leading-relaxed text-clay-deep">
                    Duka limefungwa kwa muda. Huwezi kukamilisha oda sasa — tafadhali rudi baadaye.
                  </p>
                )}
                <button type="submit" disabled={!storeOpen} className="btn-clay mt-1 w-full">
                  Weka oda · {money(total)}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-[9.5px] leading-relaxed text-stone">
                  Huu ni mfano wa studio — hakuna kadi inayochukuliwa na hakuna malipo.
                </p>
              </form>
            </div>
            <div className="shrink-0 border-t border-ink/10 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setStep("bag")}
                className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.11em] text-stone transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Rudi kwenye kikapu chako
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-1 flex-col overflow-y-auto px-7 pb-8 pt-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive text-cream">
              <Check className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-[2rem] leading-tight">Asante, {firstName || "rafiki"}.</h3>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft/85">
              Oda yako imethibitishwa na inafungwa studio. Risiti na maelezo ya uwasilishaji yanaelekea{" "}
              <span className="text-ink">{emailConfirm}</span>.
            </p>
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-[11.5px]">
              <div className="flex justify-between gap-3 py-2.5">
                <dt className="text-stone">Namba ya oda</dt>
                <dd className="font-medium tracking-wide">{orderRef}</dd>
              </div>
              <div className="flex justify-between gap-3 py-2.5">
                <dt className="text-stone">Uwasilishaji</dt>
                <dd className="text-right">Siku 2–4 za kazi · bila kaboni</dd>
              </div>
              <div className="flex justify-between gap-3 py-2.5">
                <dt className="text-stone">Jumla iliyolipwa</dt>
                <dd className="font-medium tabular-nums">{money(paidTotal || total)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-start gap-2.5 bg-cream p-3.5">
              <Mark className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <p className="text-[10.5px] leading-relaxed text-ink-soft/80">
                Zawadi ndogo ya studio imewekwa ndani. Kama kitu hakiendi sawa, tuandikie ndani ya siku 30 na
                tutakirekebisha.
              </p>
            </div>
            <button type="button" onClick={onBrowse} className="btn-ink mt-6 w-full">
              Endelea kuvinjari
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 cursor-pointer text-[10px] uppercase tracking-[0.12em] text-stone underline underline-offset-4 hover:text-ink"
            >
              Funga
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- wishlist drawer ---------------------------- */

type WishlistProps = {
  items: Product[];
  onClose: () => void;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
  onBrowse: () => void;
};

export function WishlistDrawer({ items, onClose, onAdd, onRemove, onBrowse }: WishlistProps) {
  useDialog(onClose);

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label="Vitu vilivyohifadhiwa">
      <div className="absolute inset-0 animate-fade-in bg-ink/45 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-[420px] animate-slide-left flex-col bg-paper shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-6">
          <div>
            <p className="eyebrow text-[9px] text-stone">Asili &amp; Udongo</p>
            <h2 className="mt-0.5 font-display text-xl leading-none">
              Vilivyohifadhiwa{items.length ? ` (${items.length})` : ""}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Funga vihifadhi" className="icon-btn -mr-2">
            <Close className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/15 text-ink/60">
                <Heart className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl">Hakuna kitu kilichohifadhiwa bado.</h3>
              <p className="mt-2 max-w-[17rem] text-[12.5px] leading-relaxed text-stone">
                Gusa moyo kwenye kitu unachotaka kukirudia. Tutakihifadhi hapa kwa ajili yako.
              </p>
              <button type="button" onClick={onBrowse} className="btn-outline mt-6">
                Vinjari vitu
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {items.map((product) => (
                <li key={product.id} className="flex gap-3.5 py-4 first:pt-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[96px] w-[78px] shrink-0 rounded-[1px] object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-display text-[15.5px] leading-tight">{product.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-stone">{product.category}</p>
                      </div>
                      <p className="shrink-0 text-[11.5px] tabular-nums">{money(product.price)}</p>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onAdd(product)}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
                      >
                        <Plus className="h-3 w-3" /> Weka kikapuni
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(product)}
                        aria-label={`Ondoa ${product.name} kwenye vihifadhi`}
                        className="cursor-pointer p-1 text-stone transition-colors hover:text-clay"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-ink/10 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                items.forEach((item) => onAdd(item));
                onClose();
              }}
              className="btn-clay w-full"
            >
              Weka vyote kwenye kikapu
              <Bag className="h-4 w-4" />
            </button>
            <p className="mt-2.5 text-center text-[9.5px] text-stone">
              Unaweza kubadilisha mawazo — kurudisha siku 30.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ product modal ----------------------------- */

type ProductProps = {
  product: Product;
  saved: boolean;
  onClose: () => void;
  onAdd: (product: Product, qty: number) => void;
  onToggleSaved: (product: Product) => void;
  freeShippingThreshold?: number;
};

export function ProductModal({
  product,
  saved,
  onClose,
  onAdd,
  onToggleSaved,
  freeShippingThreshold = 300000,
}: ProductProps) {
  useDialog(onClose);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const gallery = [product.image, product.hoverImage];
  const stock = stockOf(product);
  const soldOut = stock <= 0;

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-ink/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative mx-auto my-0 w-full max-w-5xl animate-soft-in bg-paper shadow-2xl sm:my-6 sm:w-[calc(100%-3rem)] lg:my-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Funga maelezo ya kitu"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        >
          <Close className="h-4 w-4" />
        </button>

        <div className="grid lg:grid-cols-2">
          <div className="relative bg-sand">
            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[620px]">
              <img key={active} src={gallery[active]} alt={product.name} className="h-full w-full animate-fade-in object-cover" />
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1.5 text-[8.5px] font-medium uppercase tracking-[0.14em]">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2">
              {gallery.map((image, i) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Onyesha picha ${i + 1}`}
                  aria-pressed={active === i}
                  className={`h-12 w-10 cursor-pointer overflow-hidden rounded-[1px] border-2 transition-all ${
                    active === i ? "border-paper opacity-100" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2.5 text-[9.5px] uppercase tracking-[0.16em] text-stone">
              <span className="text-clay">{product.category}</span>
              <span className="h-1 w-1 rounded-full bg-stone/50" />
              <span>{product.palette}</span>
            </div>
            <h2 className="mt-2.5 font-display text-[clamp(1.7rem,2.6vw,2.3rem)] leading-[1.05]">{product.name}</h2>
            <div className="mt-2.5 flex items-center gap-2.5">
              <Stars value={product.rating} />
              <span className="text-[11px] text-stone">
                {product.rating} · maoni {product.reviewCount}
              </span>
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-lg font-medium tabular-nums">{money(product.price)}</p>
              <span className="text-[10.5px] text-stone">Bei inajumuisha VAT</span>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">{product.blurb}</p>
            <p className="mt-3 text-[12.5px] leading-[1.8] text-ink-soft/75">{product.detail}</p>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-ink/10 py-5">
              {[
                { label: "Mtengenezaji", value: product.maker },
                { label: "Malighafi", value: product.material },
                { label: "Ukubwa", value: product.dimensions },
                { label: "Rangi", value: product.palette },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="text-[8.5px] uppercase tracking-[0.14em] text-stone">{row.label}</dt>
                  <dd className="mt-1 text-[11.5px] leading-snug text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-stretch gap-2.5">
              <QtyControl qty={qty} onChange={setQty} />
              <button
                type="button"
                onClick={() => onAdd(product, qty)}
                disabled={soldOut}
                className="btn-clay flex-1 px-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {soldOut ? "Imeisha stoo" : `Weka · ${money(product.price * qty)}`}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onToggleSaved(product)}
                aria-pressed={saved}
                aria-label={saved ? "Ondoa kwenye vihifadhi" : "Hifadhi kitu"}
                className={`flex w-12 shrink-0 cursor-pointer items-center justify-center border transition-colors ${
                  saved ? "border-clay bg-clay/5 text-clay" : "border-ink/20 text-ink hover:border-ink"
                }`}
              >
                <Heart className="h-[18px] w-[18px]" filled={saved} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-stone">
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${soldOut ? "bg-clay" : "bg-olive"}`} />{" "}
                {soldOut ? "Imeisha stoo" : `Ipo stoo (${stock}) · hutumwa siku 1–2`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Bure zaidi ya {money(freeShippingThreshold)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5" /> Bila plastiki
              </span>
            </div>

            <div className="mt-5 bg-cream/70 p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-soft/80">
                <span className="font-medium text-ink">Hutengenezwa kwa makundi madogo.</span> Ukubwa, glasi na rangi
                hutofautiana kwa upole kati ya vipande — ndiyo maana yake. Kurudisha siku 30, kila wakati.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ search overlay ---------------------------- */

type SearchProps = {
  products: Product[];
  onClose: () => void;
  onView: (product: Product) => void;
};

const popular = ["Kikombe", "Kitani", "Taa", "Chombo", "Udongo"];

export function SearchOverlay({ products, onClose, onView }: SearchProps) {
  useDialog(onClose);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, []);

  const term = query.trim().toLowerCase();
  const results = term
    ? products.filter((p) =>
        `${p.name} ${p.category} ${p.material} ${p.maker} ${p.palette} ${p.blurb} ${p.detail}`
          .toLowerCase()
          .includes(term),
      )
    : products.filter((p) => ["halden-mug", "arlo-lamp", "terra-vessel", "field-throw"].includes(p.id));

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-cream" role="dialog" aria-modal="true" aria-label="Tafuta vitu">
      <div className="border-b border-ink/10">
        <div className="shell flex items-center gap-4 py-5 sm:py-7">
          <Search className="h-5 w-5 shrink-0 text-clay" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta vitu, malighafi, watengenezaji…"
            aria-label="Tafuta vitu"
            className="w-full border-none bg-transparent font-display text-[1.15rem] font-light text-ink placeholder:text-stone/60 focus:outline-none sm:text-[1.7rem]"
          />
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Funga utafutaji">
            <Close className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="shell flex-1 overflow-y-auto py-7 sm:py-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[9.5px] uppercase tracking-[0.14em] text-stone">Jaribu</span>
          {popular.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="cursor-pointer rounded-full border border-ink/15 px-3.5 py-1.5 text-[10.5px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-5">
          <h2 className="font-display text-xl">
            {term
              ? `Matokeo ${results.length} kwa “${query.trim()}”`
              : "Vipenzi vya studio"}
          </h2>
          {term && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 cursor-pointer text-[10px] uppercase tracking-[0.12em] text-stone underline underline-offset-4 hover:text-ink"
            >
              Futa
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  onClose();
                  onView(product);
                }}
                className="group text-left"
              >
                <div className="overflow-hidden rounded-[2px] bg-sand">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2.5 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-[15px] leading-tight group-hover:text-clay">{product.name}</p>
                    <p className="mt-1 text-[9.5px] uppercase tracking-[0.11em] text-stone">{product.category}</p>
                  </div>
                  <p className="shrink-0 text-[11px] tabular-nums">{money(product.price)}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-ink/20 px-6 py-14 text-center">
            <p className="font-display text-2xl">Hakuna kitu kinachoitwa “{query.trim()}”.</p>
            <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-stone">
              Jaribu malighafi — udongo, kitani, mninga — au tuandikie na tutakusaidia kupata kitu unachokifikiria.
            </p>
            <button type="button" onClick={() => setQuery("")} className="btn-outline mt-6">
              Onyesha vipenzi
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-[9.5px] uppercase tracking-[0.14em] text-stone">
          <ArrowUpRight className="h-3.5 w-3.5" /> Bonyeza ESC kufunga
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ article modal ----------------------------- */

export function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  useDialog(onClose);

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-ink/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <article className="relative mx-auto my-0 w-full max-w-3xl animate-soft-in bg-paper pb-10 shadow-2xl sm:my-6 sm:w-[calc(100%-3rem)] lg:my-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Funga makala"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        >
          <Close className="h-4 w-4" />
        </button>

        <div className="aspect-[16/10] overflow-hidden bg-sand">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>

        <div className="px-5 pt-7 sm:px-10 sm:pt-9 lg:px-14">
          <div className="flex flex-wrap items-center gap-2.5 text-[9px] uppercase tracking-[0.15em] text-stone">
            <span className="text-clay">{article.category}</span>
            <span className="h-1 w-1 rounded-full bg-stone/50" />
            <span>{article.readTime}</span>
            <span className="h-1 w-1 rounded-full bg-stone/50" />
            <span>{article.date}</span>
          </div>
          <h2 className="mt-3 text-balance font-display text-[clamp(1.8rem,3.6vw,2.9rem)] font-light leading-[1.05]">
            {article.title}
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{article.excerpt}</p>

          <div className="mt-6 flex items-center gap-3 border-y border-ink/10 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay/10 font-display text-sm text-clay">
              {article.author
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <p className="text-[11px] font-medium">{article.author}</p>
              <p className="text-[10px] text-stone">{article.role}</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-stone">
              <Mark className="h-3 w-3 text-clay" /> Makala ya jarida
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {article.body.map((paragraph, i) => (
              <div key={i}>
                <p
                  className={`text-[13.5px] leading-[1.85] text-ink-soft/90 ${
                    i === 0
                      ? "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-display first-letter:text-[3.4rem] first-letter:leading-[0.72] first-letter:text-clay"
                      : ""
                  }`}
                >
                  {paragraph}
                </p>
                {i === 1 && (
                  <blockquote className="my-7 border-l-2 border-clay pl-5">
                    <p className="font-display text-[clamp(1.25rem,2.2vw,1.7rem)] font-light italic leading-snug text-ink">
                      “{article.quote}”
                    </p>
                  </blockquote>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-stone">Asili &amp; Udongo · Jarida</p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:text-clay"
            >
              Rudi studio <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ---------------------------------- toast --------------------------------- */

export type ToastData = {
  id: number;
  message: string;
  detail?: string;
  actionLabel?: string;
  action?: "cart" | "escrow";
  tone?: "success" | "error";
} | null;

export function Toast({
  data,
  onAction,
  onDismiss,
}: {
  data: ToastData;
  onAction: () => void;
  onDismiss: () => void;
}) {
  if (!data) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-[430px] -translate-x-1/2 animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 bg-ink px-4 py-3.5 text-cream shadow-2xl">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream ${
            data.tone === "error" ? "bg-clay-deep" : "bg-olive"
          }`}
        >
          {data.tone === "error" ? <Close className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11.5px] font-medium">{data.message}</p>
          {data.detail && <p className="mt-0.5 truncate text-[10px] text-cream/50">{data.detail}</p>}
        </div>
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 cursor-pointer border-b border-cream/30 pb-0.5 text-[9.5px] uppercase tracking-[0.1em] text-cream/85 transition-colors hover:border-cream hover:text-cream"
        >
          {data.actionLabel ?? "Tazama kikapu"}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Funga arifa"
          className="shrink-0 cursor-pointer text-cream/50 transition-colors hover:text-cream"
        >
          <Close className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
