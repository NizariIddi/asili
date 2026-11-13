import { useEffect, useState } from "react";
import { articles, money, products, type Article, type Category, type Product } from "./data";
import {
  ART_TYPES,
  commissionUpdate,
  escrowFee,
  escrowTotal,
  makeRef,
  moneyTZS,
  type Commission,
  type EscrowAction,
} from "./escrow";
import {
  defaultSettings,
  makeOrderId,
  makeActivity,
  stockOf,
  type ActivityEntry,
  type ActivityKind,
  type ShopOrder,
  type StoreSettings,
} from "./admin";
import Header, { AnnouncementBar } from "./components/Header";
import Hero from "./components/Hero";
import Shop, { Collections } from "./components/Shop";
import { Journal, Newsletter, Reviews, Story, StudioStrip } from "./components/Editorial";
import { EscrowDashboard, EscrowSection, RequestWizard } from "./components/Escrow";
import AdminApp from "./components/AdminApp";
import { Lock } from "./components/Icons";
import Footer from "./components/Footer";
import {
  ArticleModal,
  CartDrawer,
  ProductModal,
  SearchOverlay,
  Toast,
  WishlistDrawer,
  type CartEntry,
  type OrderDraft,
  type ToastData,
} from "./components/Overlays";
import { ArrowRight } from "./components/Icons";

type CartLine = { id: string; qty: number };

function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* hifadhi haipatikani — endelea kwa kumbukumbu */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

const activeStatuses = ["inasubiri", "imefadhiliwa", "inaendelea", "imewasilishwa"];

export default function App() {
  const [cart, setCart] = usePersistent<CartLine[]>("asili-udongo-kikapu-v1", []);
  const [wishlist, setWishlist] = usePersistent<string[]>("asili-udongo-vihifadhi-v1", []);
  const [commissions, setCommissions] = usePersistent<Commission[]>("asili-udongo-escrow-v1", []);
  const [catalogue, setCatalogue] = usePersistent<Product[]>("asili-udongo-bidhaa-v1", products);
  const [orders, setOrders] = usePersistent<ShopOrder[]>("asili-udongo-oda-v1", []);
  const [settings, setSettings] = usePersistent<StoreSettings>("asili-udongo-mipangilio-v1", defaultSettings);
  const [activity, setActivity] = usePersistent<ActivityEntry[]>("asili-udongo-kumbukumbu-v1", []);

  const storeSettings: StoreSettings = { ...defaultSettings, ...settings };

  const [category, setCategory] = useState<Category | "All">("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [escrowOpen, setEscrowOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestType, setRequestType] = useState<string | undefined>(undefined);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [toast, setToast] = useState<ToastData>(null);
  const [showTop, setShowTop] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const visibleProducts = catalogue.filter((product) => product.visible !== false);

  const entries: CartEntry[] = cart
    .map((line) => {
      const product = visibleProducts.find((p) => p.id === line.id);
      return product ? { product, qty: line.qty } : null;
    })
    .filter((entry): entry is CartEntry => entry !== null);

  const cartCount = entries.reduce((sum, entry) => sum + entry.qty, 0);
  const savedProducts = visibleProducts.filter((product) => wishlist.includes(product.id));
  const activeCommissions = commissions.filter((c) => activeStatuses.includes(c.status)).length;

  const log = (kind: ActivityKind, message: string, meta?: string) => {
    setActivity((previous) => [makeActivity(kind, message, meta), ...previous].slice(0, 80));
  };

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setAdminOpen(window.location.hash === "#admin");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const closeAdmin = () => {
    setAdminOpen(false);
    if (window.location.hash === "#admin") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  /* ---------------------------------- shop --------------------------------- */

  const addToCart = (product: Product, qty = 1) => {
    const stock = stockOf(product);
    const inCart = cart.find((line) => line.id === product.id)?.qty ?? 0;
    if (stock <= 0) {
      setToast({ id: Date.now(), message: "Bidhaa imeisha stoo", detail: `${product.name} haipatikani kwa sasa.`, tone: "error" });
      return;
    }
    if (inCart + qty > stock) {
      setToast({
        id: Date.now(),
        message: "Stoo haitoshi",
        detail: `Zipo ${stock} tu za ${product.name}.`,
        tone: "error",
      });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((line) => line.id === product.id);
      if (existing) {
        return prev.map((line) => (line.id === product.id ? { ...line, qty: line.qty + qty } : line));
      }
      return [...prev, { id: product.id, qty }];
    });
    setToast({
      id: Date.now(),
      message: `${product.name} imeongezwa kwenye kikapu chako`,
      detail: `${money(product.price * qty)} · ${product.maker}`,
      actionLabel: "Tazama kikapu",
      action: "cart",
    });
  };

  const handleQuickAdd = (product: Product) => addToCart(product, 1);

  const handleModalAdd = (product: Product, qty: number) => {
    addToCart(product, qty);
    setQuickView(null);
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((line) => line.id !== id));
      return;
    }
    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, qty } : line)));
  };

  const removeLine = (id: string) => setCart((prev) => prev.filter((line) => line.id !== id));

  const toggleSaved = (product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id],
    );
  };

  const goShop = (next: Category | "All" = "All") => {
    setCategory(next);
    setCartOpen(false);
    setWishlistOpen(false);
    window.setTimeout(() => {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const placeOrder = (draft: OrderDraft): string | null => {
    if (!storeSettings.storeOpen) {
      setToast({ id: Date.now(), message: "Duka limefungwa kwa muda", detail: "Huwezi kukamilisha oda sasa.", tone: "error" });
      return null;
    }
    const id = makeOrderId();
    const order: ShopOrder = {
      id,
      createdAt: Date.now(),
      status: "mpya",
      customer: draft.customer,
      items: draft.items,
      subtotal: draft.subtotal,
      shipping: draft.shipping,
      total: draft.total,
    };
    setOrders((previous) => [order, ...previous]);
    setCatalogue((previous) =>
      previous.map((product) => {
        const item = draft.items.find((line) => line.productId === product.id);
        if (!item) return product;
        return { ...product, stock: Math.max(0, stockOf(product) - item.qty) };
      }),
    );
    log("oda", `Oda mpya ${id} kutoka kwa ${draft.customer.name}`, moneyTZS(draft.total));
    return id;
  };

  const updateOrder = (id: string, patch: Partial<ShopOrder>) => {
    setOrders((previous) => previous.map((order) => (order.id === id ? { ...order, ...patch } : order)));
  };

  const resetAll = () => {
    setOrders([]);
    setCommissions([]);
    setCatalogue(products);
    setSettings(defaultSettings);
    setActivity([]);
    setCart([]);
    setWishlist([]);
  };

  /* --------------------------------- escrow -------------------------------- */

  const openRequest = (typeId?: string) => {
    setEscrowOpen(false);
    setRequestType(typeId);
    setRequestOpen(true);
  };

  const openDashboard = () => {
    setRequestOpen(false);
    setEscrowOpen(true);
  };

  const escrowToast = (message: string, detail?: string, tone: "success" | "error" = "success") =>
    setToast({ id: Date.now(), message, detail, actionLabel: "Fungua escrow", action: "escrow", tone });

  const submitCommission = (commission: Commission, funded: boolean) => {
    setCommissions((prev) => [commission, ...prev]);
    setRequestOpen(false);
    setEscrowOpen(true);
    escrowToast(
      funded ? "Ombi limeundwa na fedha zimewekwa escrow" : "Ombi limehifadhiwa bila malipo",
      `${commission.id} · ${moneyTZS(funded ? escrowTotal(commission) : commission.budget)} · ${commission.artist}`,
    );
    log(
      "escrow",
      `${funded ? "Agizo jipya la sanaa" : "Ombi la sanaa lililohifadhiwa"}: ${commission.title}`,
      `${commission.contactName} · ${moneyTZS(funded ? escrowTotal(commission) : commission.budget)}`,
    );
  };

  const runEscrowAction = (id: string, action: EscrowAction, note?: string) => {
    if (action === "delete") {
      setCommissions((prev) => prev.filter((c) => c.id !== id));
      escrowToast("Kumbukumbu ya agizo imefutwa");
      log("escrow", `Agizo limefutwa: ${id}`);
      return;
    }

    let message = "";
    let detail: string | undefined;

    setCommissions((prev) =>
      prev.map((commission) => {
        if (commission.id !== id) return commission;
        const next: Commission = { ...commission, updates: [...commission.updates] };
        const now = Date.now();

        switch (action) {
          case "fund":
            next.status = "inaendelea";
            next.fundedAt = now;
            next.updates.push(commissionUpdate("Fedha zimewekwa escrow", moneyTZS(escrowTotal(next))));
            next.updates.push(commissionUpdate(`${next.artist} amekubali kazi`));
            message = "Fedha zimewekwa escrow";
            detail = `${moneyTZS(escrowTotal(next))} zimeshikiliwa hadi ukubali kazi.`;
            break;
          case "deliver":
            next.status = "imewasilishwa";
            next.deliveredAt = now;
            next.updates.push(commissionUpdate("Kazi imewasilishwa", note));
            message = "Kazi imewasilishwa";
            detail = "Iangalie kisha ukubali ili kumlipa msanii.";
            break;
          case "release":
            next.status = "imekamilika";
            next.closedAt = now;
            next.updates.push(commissionUpdate("Fedha zimetolewa kwa msanii", moneyTZS(next.budget)));
            message = "Asante — fedha zimetolewa";
            detail = `${moneyTZS(next.budget)} kwa ${next.artist}.`;
            break;
          case "revision":
            next.status = "inaendelea";
            next.deliveredAt = undefined;
            next.updates.push(commissionUpdate("Marekebisho yameombwa", note));
            message = "Ombi la marekebisho limetumwa";
            detail = "Fedha zinabaki escrow hadi uwasilishaji mpya.";
            break;
          case "dispute":
            next.status = "mgogoro";
            next.updates.push(commissionUpdate("Mgogoro umefunguliwa", note));
            message = "Mgogoro umefunguliwa";
            detail = "Fedha zinashikiliwa hadi suluhu.";
            break;
          case "resolve":
            next.status = "imewasilishwa";
            next.updates.push(commissionUpdate("Mgogoro umesuluhishwa", note));
            message = "Mgogoro umesuluhishwa";
            detail = "Kazi imerudi kwenye ukaguzi.";
            break;
          case "refund":
            next.status = "imerejeshwa";
            next.closedAt = now;
            next.updates.push(commissionUpdate("Fedha zimerejeshwa kwa mteja", note));
            message = "Fedha zimerejeshwa";
            detail = `${moneyTZS(escrowTotal(next))} zimerudi kwako.`;
            break;
        }
        return next;
      }),
    );

    if (message) {
      escrowToast(message, detail);
      log("escrow", `${message}: ${id}`, detail);
    }
  };

  const seedDemo = () => {
    const type = ART_TYPES[0];
    const budget = 280000;
    const created = Date.now() - 1000 * 60 * 60 * 26;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 18);
    const stamp = () => `${Math.random().toString(36).slice(2, 7)}`;

    const demo: Commission = {
      id: makeRef(),
      typeId: type.id,
      typeLabel: type.label,
      title: "Mchoro wa familia yangu",
      brief:
        "Picha ya babu na bibi kwa penseli, wakiwa kwenye ukumbi wa nyumbani Bagamoyo. Napenda mistari laini na vivuli vya jioni.",
      size: "50 × 70 sm",
      style: "Asili",
      deadline: deadline.toISOString().slice(0, 10),
      budget,
      fee: escrowFee(budget),
      artist: type.artist,
      status: "inaendelea",
      createdAt: created,
      fundedAt: created,
      contactName: "Neema K.",
      contactEmail: "neema@mfano.com",
      updates: [
        { id: `demo-${stamp()}`, label: "Ombi la sanaa limewasilishwa", at: created },
        {
          id: `demo-${stamp()}`,
          label: "Fedha zimewekwa escrow",
          at: created + 600000,
          note: moneyTZS(budget + escrowFee(budget)),
        },
        { id: `demo-${stamp()}`, label: `${type.artist} amekubali kazi`, at: created + 3600000 },
        { id: `demo-${stamp()}`, label: "Msanii ameanza kuchora", at: created + 7200000 },
      ],
    };

    setCommissions((prev) => [demo, ...prev]);
    log("escrow", "Mfano wa agizo la sanaa umeongezwa", demo.title);
    escrowToast("Mfano wa agizo umeongezwa", "Mchoro wa familia · hatua ya uundaji");
  };

  const overlayOpen =
    cartOpen ||
    wishlistOpen ||
    searchOpen ||
    escrowOpen ||
    requestOpen ||
    adminOpen ||
    Boolean(quickView) ||
    Boolean(article);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a
        href="#shop"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Ruka hadi mkusanyo
      </a>

      <AnnouncementBar announcement={storeSettings.announcement} />
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        activeCommissions={activeCommissions}
        onOpenCart={() => {
          setToast(null);
          setCartOpen(true);
        }}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenEscrow={openDashboard}
      />

      {!storeSettings.storeOpen && (
        <div className="border-b border-clay/25 bg-clay/[0.07]">
          <div className="shell flex items-center justify-center gap-2 py-2.5 text-center text-[10px] uppercase tracking-[0.1em] text-clay-deep">
            <Lock className="h-3.5 w-3.5" /> Duka limefungwa kwa muda. Unaweza kuvinjari; malipo yatapatikana hivi karibuni.
          </div>
        </div>
      )}

      <main>
        <Hero onQuickView={(product) => setQuickView(product)} catalogue={visibleProducts} threshold={storeSettings.freeShippingThreshold} />
        <Collections onSelect={goShop} />
        <Shop
          products={visibleProducts}
          wishlist={wishlist}
          category={category}
          onCategoryChange={setCategory}
          onToggleSaved={toggleSaved}
          onQuickAdd={handleQuickAdd}
          onQuickView={(product) => setQuickView(product)}
        />
        <Story onOpenArticle={(next) => setArticle(next)} />
        <Journal onOpenArticle={(next) => setArticle(next)} />
        <Reviews />
        <StudioStrip />
        <EscrowSection activeCount={activeCommissions} onOpenRequest={openRequest} onOpenDashboard={openDashboard} />
        <Newsletter />
      </main>

      <Footer />

      {cartOpen && (
        <CartDrawer
          entries={entries}
          onClose={() => setCartOpen(false)}
          onQty={updateQty}
          onRemove={removeLine}
          onClear={() => setCart([])}
          onBrowse={() => goShop("All")}
          shippingFee={storeSettings.shippingFee}
          freeShippingThreshold={storeSettings.freeShippingThreshold}
          storeOpen={storeSettings.storeOpen}
          onPlaceOrder={placeOrder}
        />
      )}

      {wishlistOpen && (
        <WishlistDrawer
          items={savedProducts}
          onClose={() => setWishlistOpen(false)}
          onAdd={addToCart}
          onRemove={toggleSaved}
          onBrowse={() => goShop("All")}
        />
      )}

      {searchOpen && (
        <SearchOverlay
          products={visibleProducts}
          onClose={() => setSearchOpen(false)}
          onView={(product) => setQuickView(product)}
        />
      )}

      {requestOpen && (
        <RequestWizard
          initialType={requestType}
          onClose={() => setRequestOpen(false)}
          onSubmit={submitCommission}
        />
      )}

      {escrowOpen && (
        <EscrowDashboard
          commissions={commissions}
          onClose={() => setEscrowOpen(false)}
          onAction={runEscrowAction}
          onOpenRequest={openRequest}
          onSeedDemo={seedDemo}
        />
      )}

      {adminOpen && (
        <AdminApp
          products={catalogue}
          orders={orders}
          commissions={commissions}
          settings={storeSettings}
          activity={activity}
          onProducts={setCatalogue}
          onOrders={setOrders}
          onSettings={setSettings}
          onActivity={setActivity}
          log={log}
          updateOrder={updateOrder}
          onEscrowAction={runEscrowAction}
          onOpenEscrow={() => {
            closeAdmin();
            setEscrowOpen(true);
          }}
          onOpenStorefront={() => {
            closeAdmin();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onClose={closeAdmin}
          onResetAll={resetAll}
        />
      )}

      {quickView && (
        <ProductModal
          product={quickView}
          saved={wishlist.includes(quickView.id)}
          onClose={() => setQuickView(null)}
          onAdd={handleModalAdd}
          onToggleSaved={toggleSaved}
          freeShippingThreshold={storeSettings.freeShippingThreshold}
        />
      )}

      {article && <ArticleModal article={article} onClose={() => setArticle(null)} />}

      <Toast
        data={toast}
        onAction={() => {
          const destination = toast?.action;
          setToast(null);
          if (destination === "escrow") {
            setRequestOpen(false);
            setEscrowOpen(true);
          } else {
            setCartOpen(true);
          }
        }}
        onDismiss={() => setToast(null)}
      />

      {showTop && !overlayOpen && (
        <div className="fixed bottom-5 right-4 z-30 hidden sm:block lg:right-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Rudi juu"
            className="group flex items-center gap-2.5 rounded-full border border-ink/15 bg-paper/90 py-2.5 pl-3 pr-4 text-[9.5px] uppercase tracking-[0.14em] text-ink shadow-sm backdrop-blur-sm transition-all hover:border-ink/40"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream transition-transform group-hover:-translate-y-0.5">
              <ArrowRight className="h-3.5 w-3.5 -rotate-90" />
            </span>
            Juu
          </button>
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        Makala {articles.length} ya jarida yanapatikana. Vitu {visibleProducts.length} viko dukani. Maagizo{" "}
        {commissions.length} ya escrow.
      </div>
    </div>
  );
}
