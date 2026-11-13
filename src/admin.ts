import type { Product } from "./data";
import { escrowTotal, type Commission, type EscrowAction } from "./escrow";

/* --------------------------------- orders --------------------------------- */

export type ShopOrderStatus = "mpya" | "imeandaliwa" | "imesafirishwa" | "imefikiwa" | "imeghairiwa";

export type ShopOrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

export type ShopOrder = {
  id: string;
  createdAt: number;
  status: ShopOrderStatus;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postcode: string;
  };
  items: ShopOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  note?: string;
};

export type BadgeTone = "neutral" | "clay" | "olive" | "amber" | "dark" | "danger" | "stone";

export const orderStatusMeta: Record<
  ShopOrderStatus,
  { label: string; tone: BadgeTone; next?: ShopOrderStatus; nextLabel?: string }
> = {
  mpya: { label: "Mpya", tone: "amber", next: "imeandaliwa", nextLabel: "Anza kuandaa" },
  imeandaliwa: { label: "Imeandaliwa", tone: "clay", next: "imesafirishwa", nextLabel: "Safirisha" },
  imesafirishwa: { label: "Imesafirishwa", tone: "olive", next: "imefikiwa", nextLabel: "Imefikiwa" },
  imefikiwa: { label: "Imefikiwa", tone: "dark" },
  imeghairiwa: { label: "Imeghairiwa", tone: "stone" },
};

/* -------------------------------- settings -------------------------------- */

export type StoreSettings = {
  announcement: string;
  supportEmail: string;
  shippingFee: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  storeOpen: boolean;
  pin: string;
};

export const defaultSettings: StoreSettings = {
  announcement: "Usafirishaji bure kwa oda zaidi ya TSh 300,000",
  supportEmail: "studio@asiliudongo.co.tz",
  shippingFee: 20000,
  freeShippingThreshold: 300000,
  lowStockThreshold: 4,
  storeOpen: true,
  pin: "2468",
};

/* -------------------------------- activity -------------------------------- */

export type ActivityKind = "bidhaa" | "oda" | "escrow" | "mipangilio" | "mfumo";

export type ActivityEntry = {
  id: string;
  at: number;
  kind: ActivityKind;
  message: string;
  meta?: string;
};

export const activityMeta: Record<ActivityKind, { label: string; tone: BadgeTone }> = {
  bidhaa: { label: "Bidhaa", tone: "clay" },
  oda: { label: "Oda", tone: "olive" },
  escrow: { label: "Escrow", tone: "dark" },
  mipangilio: { label: "Mipangilio", tone: "neutral" },
  mfumo: { label: "Mfumo", tone: "stone" },
};

export const makeActivity = (kind: ActivityKind, message: string, meta?: string): ActivityEntry => ({
  id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  at: Date.now(),
  kind,
  message,
  meta,
});

/* --------------------------------- helpers -------------------------------- */

export const stockOf = (product: Product, fallback = 12) => product.stock ?? fallback;

export const itemCount = (order: ShopOrder) => order.items.reduce((sum, item) => sum + item.qty, 0);

export const makeOrderId = () => `OD-${Math.floor(1000 + Math.random() * 9000)}`;

export const shortDate = (value: string | number) =>
  new Intl.DateTimeFormat("sw-TZ", { day: "numeric", month: "short" }).format(new Date(value));

export const timeAgo = (value: number) => {
  const diff = Math.max(0, Date.now() - value);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "sasa hivi";
  if (mins < 60) return `dakika ${mins} zilizopita`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `saa ${hours} zilizopita`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "jana";
  if (days < 7) return `siku ${days} zilizopita`;
  return shortDate(value);
};

export function fileToDataUrl(file: File, max = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("type"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("decode"));
      image.onload = () => {
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas"));
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
  download(filename, `\ufeff${content}`, "text/csv;charset=utf-8;");
}

export function exportJson(filename: string, data: unknown) {
  download(filename, JSON.stringify(data, null, 2), "application/json");
}

/* ------------------------------- seed orders ------------------------------ */

const seedCustomers = [
  { name: "Neema Kessy", email: "neema.kessy@mfano.com", phone: "+255 754 118 220", address: "Mtaa wa Mikocheni 14", city: "Arusha", postcode: "14112" },
  { name: "Joseph Mrema", email: "joseph.mrema@mfano.com", phone: "+255 715 447 800", address: "Njiro Road 8", city: "Arusha", postcode: "23103" },
  { name: "Aisha Suleiman", email: "aisha.s@mfano.com", phone: "+255 777 900 145", address: "Shangani 22", city: "Zanzibar", postcode: "71100" },
  { name: "Baraka Mushi", email: "baraka.m@mfano.com", phone: "+255 786 223 019", address: "Kijichi 6", city: "Arusha", postcode: "14112" },
  { name: "Halima Bakari", email: "halima.b@mfano.com", phone: "+255 758 665 210", address: "Kariakoo 41", city: "Arusha", postcode: "14110" },
  { name: "Mads Rømer", email: "mads.r@mfano.com", phone: "+255 768 309 004", address: "Oyster Bay 12", city: "Arusha", postcode: "14111" },
];

const seedPlans: { days: number; status: ShopOrderStatus; customer: number; picks: [number, number][] }[] = [
  { days: 0, status: "mpya", customer: 0, picks: [[2, 2], [10, 1]] },
  { days: 1, status: "mpya", customer: 2, picks: [[8, 1]] },
  { days: 2, status: "imeandaliwa", customer: 4, picks: [[0, 1], [11, 1]] },
  { days: 3, status: "imesafirishwa", customer: 1, picks: [[5, 1]] },
  { days: 5, status: "imefikiwa", customer: 3, picks: [[6, 1], [9, 1]] },
  { days: 6, status: "imefikiwa", customer: 5, picks: [[1, 2]] },
  { days: 8, status: "imefikiwa", customer: 0, picks: [[3, 1], [7, 1]] },
  { days: 10, status: "imeghairiwa", customer: 2, picks: [[4, 1]] },
  { days: 12, status: "imefikiwa", customer: 1, picks: [[10, 2], [2, 1]] },
  { days: 15, status: "imefikiwa", customer: 4, picks: [[9, 1]] },
];

export function seedOrders(products: Product[], settings: StoreSettings): ShopOrder[] {
  const list = products.filter((product) => product.visible !== false);
  if (list.length === 0) return [];
  const now = Date.now();

  return seedPlans.map((plan, index) => {
    const items: ShopOrderItem[] = plan.picks.map(([position, qty]) => {
      const product = list[position % list.length];
      return { productId: product.id, name: product.name, price: product.price, qty, image: product.image };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    const created = now - plan.days * 86400000 - index * 3600000;
    return {
      id: `OD-${4820 + index * 7}`,
      createdAt: created,
      status: plan.status,
      customer: seedCustomers[plan.customer],
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  });
}

/* -------------------------------- analytics ------------------------------- */

export type RevenuePoint = { label: string; shop: number; escrow: number; orders: number };

export type Analytics = {
  shopRevenue: number;
  escrowRevenue: number;
  revenue: number;
  previousRevenue: number;
  orderCount: number;
  unitsSold: number;
  series: RevenuePoint[];
  topProducts: { id: string; name: string; image: string; qty: number; revenue: number }[];
  newCustomers: number;
};

const DAY = 86400000;

export function buildAnalytics(
  orders: ShopOrder[],
  commissions: Commission[],
  rangeDays: number | "zote",
): Analytics {
  const now = Date.now();
  const span = rangeDays === "zote" ? 90 : rangeDays;
  const from = now - span * DAY;
  const previousFrom = from - span * DAY;

  const commissionValue = (commission: Commission) => escrowTotal(commission);
  const commissionDate = (commission: Commission) => commission.fundedAt ?? commission.createdAt;

  const inRange = <T,>(list: T[], get: (item: T) => number) =>
    list.filter((item) => {
      const at = get(item);
      return at >= from && at <= now;
    });

  const currentOrders = inRange(orders, (order) => order.createdAt);
  const previousOrders = orders.filter((order) => {
    const at = order.createdAt;
    return at >= previousFrom && at < from;
  });
  const currentCommissions = commissions.filter((commission) => {
    const at = commissionDate(commission);
    return Boolean(commission.fundedAt) && at >= from && at <= now;
  });
  const previousCommissions = commissions.filter((commission) => {
    const at = commissionDate(commission);
    return Boolean(commission.fundedAt) && at >= previousFrom && at < from;
  });

  const shopRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0);
  const escrowRevenue = currentCommissions.reduce((sum, commission) => sum + commissionValue(commission), 0);
  const previousRevenue =
    previousOrders.reduce((sum, order) => sum + order.total, 0) +
    previousCommissions.reduce((sum, commission) => sum + commissionValue(commission), 0);

  const bucketCount = span <= 7 ? 7 : span <= 30 ? 10 : 9;
  const bucketSize = span / bucketCount;
  const series: RevenuePoint[] = Array.from({ length: bucketCount }, (_, index) => {
    const start = now - (bucketCount - index) * bucketSize * DAY;
    const end = now - (bucketCount - index - 1) * bucketSize * DAY;
    const label = shortDate(start);
    const shop = orders
      .filter((order) => order.createdAt >= start && order.createdAt < end)
      .reduce((sum, order) => sum + order.total, 0);
    const escrow = commissions
      .filter((commission) => {
        const at = commissionDate(commission);
        return Boolean(commission.fundedAt) && at >= start && at < end;
      })
      .reduce((sum, commission) => sum + commissionValue(commission), 0);
    const count = orders.filter((order) => order.createdAt >= start && order.createdAt < end).length;
    return { label, shop, escrow, orders: count };
  });

  const productMap = new Map<string, { id: string; name: string; image: string; qty: number; revenue: number }>();
  currentOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productMap.get(item.productId) ?? {
        id: item.productId,
        name: item.name,
        image: item.image,
        qty: 0,
        revenue: 0,
      };
      existing.qty += item.qty;
      existing.revenue += item.qty * item.price;
      productMap.set(item.productId, existing);
    });
  });

  const customers = new Map<string, number>();
  currentOrders.forEach((order) => {
    const first = customers.get(order.customer.email);
    if (first === undefined || order.createdAt < first) customers.set(order.customer.email, order.createdAt);
  });

  return {
    shopRevenue,
    escrowRevenue,
    revenue: shopRevenue + escrowRevenue,
    previousRevenue,
    orderCount: currentOrders.length,
    unitsSold: currentOrders.reduce((sum, order) => sum + itemCount(order), 0),
    series,
    topProducts: [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    newCustomers: [...customers.values()].filter((at) => at >= from).length,
  };
}

export const rangeLabel: Record<string, string> = {
  "7": "Siku 7",
  "30": "Siku 30",
  "90": "Siku 90",
  zote: "Zote",
};

export const stockBadge = (stock: number, threshold: number) => {
  if (stock <= 0) return { label: "Imeisha", tone: "danger" as BadgeTone };
  if (stock <= threshold) return { label: "Stoo ndogo", tone: "amber" as BadgeTone };
  return { label: "Ipo stoo", tone: "olive" as BadgeTone };
};

export type Customer = {
  email: string;
  name: string;
  phone?: string;
  city: string;
  orders: ShopOrder[];
  commissions: Commission[];
  spent: number;
  lastAt: number;
};

export function buildCustomers(orders: ShopOrder[], commissions: Commission[]): Customer[] {
  const map = new Map<string, Customer>();

  orders.forEach((order) => {
    const key = order.customer.email.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.orders.push(order);
      existing.spent += order.total;
      existing.lastAt = Math.max(existing.lastAt, order.createdAt);
    } else {
      map.set(key, {
        email: order.customer.email,
        name: order.customer.name,
        phone: order.customer.phone,
        city: order.customer.city,
        orders: [order],
        commissions: [],
        spent: order.total,
        lastAt: order.createdAt,
      });
    }
  });

  commissions.forEach((commission) => {
    const key = commission.contactEmail.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.commissions.push(commission);
      existing.lastAt = Math.max(existing.lastAt, commission.createdAt);
    } else {
      map.set(key, {
        email: commission.contactEmail,
        name: commission.contactName,
        phone: commission.phone,
        city: "—",
        orders: [],
        commissions: [commission],
        spent: 0,
        lastAt: commission.createdAt,
      });
    }
  });

  return [...map.values()].sort((a, b) => b.lastAt - a.lastAt);
}

/* ----------------------------- admin contracts ---------------------------- */

export type AdminSection =
  | "dashboard"
  | "orders"
  | "products"
  | "commissions"
  | "customers"
  | "settings"
  | "activity";

export type AdminData = {
  products: Product[];
  orders: ShopOrder[];
  commissions: Commission[];
  settings: StoreSettings;
  activity: ActivityEntry[];
};

export type AdminActions = {
  setProducts: (next: Product[]) => void;
  setOrders: (next: ShopOrder[]) => void;
  setSettings: (next: StoreSettings) => void;
  setActivity: (next: ActivityEntry[]) => void;
  log: (kind: ActivityKind, message: string, meta?: string) => void;
  notify: (message: string, tone?: "success" | "error" | "info") => void;
  updateOrder: (id: string, patch: Partial<ShopOrder>) => void;
  onEscrowAction: (id: string, action: EscrowAction, note?: string) => void;
  onOpenEscrow: () => void;
  onOpenStorefront: () => void;
  onClose: () => void;
  onResetAll: () => void;
};

export type AdminViewProps = {
  data: AdminData;
  actions: AdminActions;
  navigate: (section: AdminSection) => void;
};
