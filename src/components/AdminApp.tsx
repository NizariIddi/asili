import { useEffect, useRef, useState } from "react";
import type { Product } from "../data";
import type { Commission, EscrowAction } from "../escrow";
import {
  defaultSettings,
  type ActivityEntry,
  type ActivityKind,
  type AdminActions,
  type AdminData,
  type AdminSection,
  type ShopOrder,
  type StoreSettings,
} from "../admin";
import {
  ArrowLeft,
  ArrowRight,
  Bag,
  Bell,
  Check,
  Clock,
  Close,
  Gear,
  Layout,
  Lock,
  LogOut,
  Mark,
  Menu,
  Package,
  Shield,
  Users,
} from "./Icons";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import { AdminCommissions, AdminCustomers, AdminOrders } from "./admin/AdminCommerce";
import { AdminActivity, AdminSettings } from "./admin/AdminSettings";

const SESSION_KEY = "asili-udongo-admin-session";

const sectionMeta: Record<AdminSection, { label: string; group: string; icon: typeof Layout }> = {
  dashboard: { label: "Dashibodi", group: "Muhtasari", icon: Layout },
  orders: { label: "Oda za duka", group: "Biashara", icon: Bag },
  products: { label: "Bidhaa", group: "Biashara", icon: Package },
  commissions: { label: "Maagizo ya sanaa", group: "Biashara", icon: Shield },
  customers: { label: "Wateja", group: "Biashara", icon: Users },
  settings: { label: "Mipangilio", group: "Mfumo", icon: Gear },
  activity: { label: "Kumbukumbu", group: "Mfumo", icon: Clock },
};

const groups: { label: string; sections: AdminSection[] }[] = [
  { label: "Muhtasari", sections: ["dashboard"] },
  { label: "Biashara", sections: ["orders", "products", "commissions", "customers"] },
  { label: "Mfumo", sections: ["settings", "activity"] },
];

type ToastItem = { id: number; message: string; tone: "success" | "error" | "info" };

type Props = {
  products: Product[];
  orders: ShopOrder[];
  commissions: Commission[];
  settings: StoreSettings;
  activity: ActivityEntry[];
  onProducts: (next: Product[]) => void;
  onOrders: (next: ShopOrder[]) => void;
  onSettings: (next: StoreSettings) => void;
  onActivity: (next: ActivityEntry[]) => void;
  log: (kind: ActivityKind, message: string, meta?: string) => void;
  updateOrder: (id: string, patch: Partial<ShopOrder>) => void;
  onEscrowAction: (id: string, action: EscrowAction, note?: string) => void;
  onOpenEscrow: () => void;
  onOpenStorefront: () => void;
  onClose: () => void;
  onResetAll: () => void;
};

/* ---------------------------------- login --------------------------------- */

function AdminLogin({
  settings,
  onSuccess,
  onLeave,
}: {
  settings: StoreSettings;
  onSuccess: () => void;
  onLeave: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pin === settings.pin) {
      onSuccess();
    } else {
      setError("PIN si sahihi. Jaribu tena.");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-ink p-0 sm:p-6">
      <div className="grid w-full max-w-5xl overflow-hidden bg-paper shadow-2xl lg:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-olive-deep p-10 text-cream lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full border border-cream/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full border border-cream/[0.07]"
          />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <Mark className="h-5 w-5 text-clay" />
              <span className="font-display text-[15px] tracking-[0.2em]">ASILI &amp; UDONGO</span>
            </div>
            <p className="mt-12 font-display text-[2.4rem] font-light leading-[1.08]">
              Nyumba nzuri
              <br />
              huanza na <em className="italic text-sand">utunzaji.</em>
            </p>
            <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-cream/60">
              Paneli ya msimamizi kwa katalogi, oda, wateja na escrow ya sanaa — mahali pamoja.
            </p>
          </div>
          <ul className="relative mt-10 space-y-3 border-t border-cream/15 pt-6 text-[11px] text-cream/70">
            {["Simamia bidhaa na stoo papo hapo", "Fuatilia oda za duka na uwasilishaji", "Angalia fedha za escrow kwa uwazi"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cream/10">
                  <Check className="h-2.5 w-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="relative mt-10 text-[8px] uppercase tracking-[0.2em] text-cream/30">Arusha · Tangu 2014</p>
        </div>

        <div className="relative flex flex-col justify-center px-6 py-12 sm:px-12">
          <button
            type="button"
            onClick={onLeave}
            className="absolute right-5 top-5 inline-flex cursor-pointer items-center gap-1.5 text-[9px] uppercase tracking-[0.11em] text-stone transition-colors hover:text-ink"
          >
            <Close className="h-3.5 w-3.5" /> Funga
          </button>
          <div className="mx-auto w-full max-w-[320px]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-clay/10 text-clay">
              <Lock className="h-[18px] w-[18px]" />
            </span>
            <p className="eyebrow mt-5 text-[9px] text-clay">Paneli ya msimamizi</p>
            <h1 className="mt-2 font-display text-[2rem] leading-none">Karibu tena.</h1>
            <p className="mt-2 text-[11.5px] leading-relaxed text-stone">
              Weka PIN yako kuingia kwenye studio ya Asili &amp; Udongo.
            </p>

            <form onSubmit={submit} className="mt-7" noValidate>
              <label htmlFor="admin-pin" className="eyebrow mb-1.5 block text-[9px] text-stone">
                PIN ya msimamizi
              </label>
              <input
                ref={inputRef}
                id="admin-pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                value={pin}
                onChange={(event) => {
                  setPin(event.target.value.replace(/[^0-9]/g, "").slice(0, 6));
                  setError("");
                }}
                placeholder="••••"
                aria-invalid={Boolean(error)}
                aria-describedby="admin-pin-note"
                className="field py-3.5 text-center text-[1.2rem] tracking-[0.5em]"
              />
              {error && <p className="mt-2 text-[10.5px] text-clay" role="alert">{error}</p>}
              <button type="submit" disabled={pin.length < 4} className="btn-clay mt-4 w-full disabled:opacity-60">
                Ingia kwenye paneli
                <ArrowRight className="h-4 w-4" />
              </button>
              <p id="admin-pin-note" className="mt-3 text-center text-[9.5px] leading-relaxed text-stone">
                Mazingira ya majaribio — PIN ya mwanzo ni <span className="font-medium text-ink">2468</span>.
                Unaweza kuibadilisha kwenye Mipangilio.
              </p>
            </form>

            <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-ink/10 pt-4 text-[9px] uppercase tracking-[0.1em] text-stone">
              <button type="button" onClick={onLeave} className="inline-flex cursor-pointer items-center gap-1.5 hover:text-ink">
                <ArrowLeft className="h-3 w-3" /> Rudi dukani
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- shell --------------------------------- */

export default function AdminApp(props: Props) {
  const { products, orders, commissions, settings, activity, onClose } = props;
  const [authed, setAuthed] = useState(() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setNavOpen(false);
    setBellOpen(false);
  }, [section]);

  const notify = (message: string, tone: ToastItem["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((previous) => [...previous, { id, message, tone }]);
    window.setTimeout(() => setToasts((previous) => previous.filter((toast) => toast.id !== id)), 3800);
  };

  const enter = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setAuthed(true);
    props.log("mfumo", "Msimamizi ameingia kwenye paneli");
  };

  const lock = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setToasts([]);
  };

  const data: AdminData = { products, orders, commissions, settings, activity };

  const actions: AdminActions = {
    setProducts: props.onProducts,
    setOrders: props.onOrders,
    setSettings: props.onSettings,
    setActivity: props.onActivity,
    log: props.log,
    notify,
    updateOrder: props.updateOrder,
    onEscrowAction: props.onEscrowAction,
    onOpenEscrow: props.onOpenEscrow,
    onOpenStorefront: props.onOpenStorefront,
    onClose,
    onResetAll: props.onResetAll,
  };

  const navigate = (next: AdminSection) => {
    setSection(next);
    setNavOpen(false);
    setBellOpen(false);
  };

  if (!authed) {
    return <AdminLogin settings={settings ?? defaultSettings} onSuccess={enter} onLeave={onClose} />;
  }

  const newOrders = orders.filter((order) => order.status === "mpya").length;
  const toShip = orders.filter((order) => order.status === "imeandaliwa").length;
  const awaiting = commissions.filter((commission) => commission.status === "inasubiri").length;
  const disputes = commissions.filter((commission) => commission.status === "mgogoro").length;
  const attention = newOrders + toShip + awaiting + disputes;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-cream/10 px-5 py-5">
        <button type="button" onClick={() => navigate("dashboard")} className="flex items-center gap-2.5 text-left">
          <Mark className="h-4 w-4 text-clay" />
          <span>
            <span className="block font-display text-[12px] tracking-[0.16em] text-cream">ASILI &amp; UDONGO</span>
            <span className="mt-0.5 block text-[7.5px] uppercase tracking-[0.18em] text-cream/35">Studio dar es salaam</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setNavOpen(false)}
          aria-label="Funga menyu"
          className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 hover:text-cream lg:hidden"
        >
          <Close className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sehemu za msimamizi">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[7.5px] uppercase tracking-[0.18em] text-cream/30">{group.label}</p>
            <ul className="space-y-0.5">
              {group.sections.map((key) => {
                const meta = sectionMeta[key];
                const active = section === key;
                const count =
                  key === "orders"
                    ? newOrders
                    : key === "commissions"
                      ? awaiting + disputes
                      : key === "products"
                        ? products.length
                        : key === "customers"
                          ? new Set(orders.map((order) => order.customer.email)).size
                          : 0;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => navigate(key)}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-[2px] px-3 py-2.5 text-left text-[11px] tracking-[0.02em] transition-colors ${
                        active ? "bg-cream/12 text-cream" : "text-cream/55 hover:bg-cream/[0.06] hover:text-cream"
                      }`}
                    >
                      <meta.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{meta.label}</span>
                      {count > 0 && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[8px] tabular-nums ${active ? "bg-cream/15 text-cream" : "bg-cream/[0.07] text-cream/45"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-cream/10 p-3">
        <button
          type="button"
          onClick={props.onOpenStorefront}
          className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-[9.5px] uppercase tracking-[0.09em] text-cream/55 transition-colors hover:text-cream"
        >
          Tazama duka <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <div className="mt-2 flex items-center gap-2.5 rounded-[2px] bg-cream/[0.06] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay text-[10px] font-medium text-paper">
            AM
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10.5px] font-medium text-cream">Studio Asili</p>
            <p className="text-[8px] uppercase tracking-[0.1em] text-cream/35">Msimamizi mkuu</p>
          </div>
          <button type="button" onClick={lock} aria-label="Funga kwa usalama" title="Funga kwa usalama" className="cursor-pointer text-cream/45 transition-colors hover:text-cream">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed left-0 right-0 top-0 z-[85] flex h-screen max-h-screen overflow-hidden bg-cream" role="dialog" aria-modal="true" aria-label="Paneli ya msimamizi">
      <aside className="hidden w-[242px] shrink-0 bg-ink lg:block">{sidebar}</aside>

      {navOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setNavOpen(false)} aria-hidden="true" />
          <div className="relative h-full w-[280px] bg-ink shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-40 flex h-14 shrink-0 flex-nowrap items-center justify-between gap-2 border-b border-ink/10 bg-cream px-4 sm:h-[62px] sm:gap-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Fungua menyu"
              className="icon-btn -ml-2 h-9 w-9 shrink-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-[8.5px] uppercase tracking-[0.12em] text-stone">
                Paneli <span className="text-stone/40">/</span> {sectionMeta[section].group}
              </p>
              <h1 className="mt-0.5 truncate font-display text-[1.1rem] leading-tight sm:text-[1.35rem]">
                {sectionMeta[section].label}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <span className="mr-1 hidden items-center gap-1.5 text-[8.5px] uppercase tracking-[0.1em] text-stone 2xl:flex">
              <span className={`h-1.5 w-1.5 rounded-full ${settings.storeOpen ? "bg-olive" : "bg-stone"}`} />
              {settings.storeOpen ? "Duka liko wazi" : "Duka limefungwa"}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => setBellOpen((open) => !open)}
                aria-label={`Arifa, ${attention} zinahitaji makini`}
                aria-expanded={bellOpen}
                className="icon-btn relative h-9 w-9"
              >
                <Bell className="h-[18px] w-[18px]" />
                {attention > 0 && (
                  <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-clay px-0.5 text-[8px] font-medium text-paper">
                    {attention}
                  </span>
                )}
              </button>
              {bellOpen && (
                <>
                  <button type="button" aria-label="Funga arifa" className="fixed inset-0 z-[20] cursor-default" onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 top-11 z-[30] w-[280px] animate-soft-in border border-ink/12 bg-paper shadow-2xl">
                    <div className="border-b border-ink/10 px-4 py-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em]">Zinahitaji makini</p>
                    </div>
                    {attention === 0 ? (
                      <p className="px-4 py-5 text-[10.5px] leading-relaxed text-stone">Hakuna arifa. Kila kitu kiko sawa.</p>
                    ) : (
                      <ul className="divide-y divide-ink/10">
                        {[
                          { label: "Oda mpya", count: newOrders, target: "orders" as AdminSection },
                          { label: "Oda za kusafirisha", count: toShip, target: "orders" as AdminSection },
                          { label: "Maagizo yanayohitaji ufadhili", count: awaiting, target: "commissions" as AdminSection },
                          { label: "Migogoro ya escrow", count: disputes, target: "commissions" as AdminSection },
                        ]
                          .filter((item) => item.count > 0)
                          .map((item) => (
                            <li key={item.label}>
                              <button
                                type="button"
                                onClick={() => { setBellOpen(false); navigate(item.target); }}
                                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-cream/60"
                              >
                                <span className="text-[10.5px] text-ink-soft">{item.label}</span>
                                <span className="font-display text-[13px] tabular-nums">{item.count}</span>
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>

            <button type="button" onClick={props.onOpenStorefront} className="btn-outline hidden px-3.5 py-2 text-[9px] md:inline-flex">
              Duka <ArrowRight className="h-3 w-3" />
            </button>
            <button type="button" onClick={lock} className="icon-btn h-9 w-9" aria-label="Funga kwa usalama" title="Funga kwa usalama">
              <LogOut className="h-[18px] w-[18px]" />
            </button>
            <button type="button" onClick={onClose} className="icon-btn h-9 w-9" aria-label="Funga paneli">
              <Close className="h-[18px] w-[18px]" />
            </button>
          </div>
        </header>

        <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6">
            {section === "dashboard" && <AdminDashboard data={data} actions={actions} navigate={navigate} />}
            {section === "orders" && <AdminOrders data={data} actions={actions} navigate={navigate} />}
            {section === "products" && <AdminProducts data={data} actions={actions} navigate={navigate} />}
            {section === "commissions" && <AdminCommissions data={data} actions={actions} navigate={navigate} />}
            {section === "customers" && <AdminCustomers data={data} actions={actions} navigate={navigate} />}
            {section === "settings" && <AdminSettings data={data} actions={actions} navigate={navigate} />}
            {section === "activity" && <AdminActivity data={data} actions={actions} navigate={navigate} />}
          </div>

          <footer className="border-t border-ink/10 px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 text-[8.5px] uppercase tracking-[0.1em] text-stone">
              <p className="inline-flex items-center gap-2">
                <Lock className="h-3 w-3" /> Mazingira ya majaribio · data kwenye kifaa hiki
              </p>
              <p>Asili &amp; Udongo · Paneli ya msimamizi</p>
            </div>
          </footer>
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 z-[150] flex w-[calc(100%-2rem)] max-w-[340px] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex animate-toast-in items-center gap-2.5 px-4 py-3 text-cream shadow-2xl ${
              toast.tone === "error" ? "bg-clay-deep" : toast.tone === "info" ? "bg-olive-deep" : "bg-ink"
            }`}
            role="status"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream/15">
              {toast.tone === "error" ? <Close className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            <p className="flex-1 text-[10.5px] leading-snug">{toast.message}</p>
            <button type="button" onClick={() => setToasts((previous) => previous.filter((item) => item.id !== toast.id))} aria-label="Funga arifa" className="shrink-0 text-cream/50 hover:text-cream">
              <Close className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
