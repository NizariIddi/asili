import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  money,
  type Category,
  type Product,
} from "../../data";
import {
  exportCsv,
  fileToDataUrl,
  stockBadge,
  stockOf,
  type AdminViewProps,
} from "../../admin";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Trash,
  Upload,
} from "../Icons";
import {
  Badge,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Pagination,
  SearchInput,
  Select,
  Chips,
} from "./AdminUI";

const PAGE_SIZE = 8;

type FormState = {
  name: string;
  category: Category;
  price: number;
  stock: number;
  sku: string;
  badge: string;
  blurb: string;
  detail: string;
  maker: string;
  material: string;
  dimensions: string;
  palette: string;
  image: string;
  hoverImage: string;
  rating: number;
  reviewCount: number;
  visible: boolean;
};

const emptyForm: FormState = {
  name: "",
  category: "Vyungu",
  price: 45000,
  stock: 8,
  sku: "",
  badge: "",
  blurb: "",
  detail: "",
  maker: "",
  material: "",
  dimensions: "",
  palette: "",
  image: "",
  hoverImage: "",
  rating: 5,
  reviewCount: 0,
  visible: true,
};

const toForm = (product: Product): FormState => ({
  name: product.name,
  category: product.category,
  price: product.price,
  stock: stockOf(product),
  sku: product.sku ?? "",
  badge: product.badge ?? "",
  blurb: product.blurb,
  detail: product.detail,
  maker: product.maker,
  material: product.material,
  dimensions: product.dimensions,
  palette: product.palette,
  image: product.image,
  hoverImage: product.hoverImage,
  rating: product.rating,
  reviewCount: product.reviewCount,
  visible: product.visible !== false,
});

function ProductEditor({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [form, setForm] = useState<FormState>(product ? toForm(product) : emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const hoverRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const upload = async (file: File | undefined, target: "image" | "hoverImage") => {
    if (!file) return;
    setBusy(true);
    try {
      const data = await fileToDataUrl(file);
      set(target, data);
    } catch {
      setErrors((previous) => ({ ...previous, [target]: "Imeshindwa kusoma picha. Jaribu JPG au PNG." }));
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Weka jina la bidhaa.";
    if (!Number.isFinite(form.price) || form.price < 1000) next.price = "Bei ya chini ni TSh 1,000.";
    if (form.blurb.trim().length < 10) next.blurb = "Andika maelezo mafupi.";
    if (form.detail.trim().length < 20) next.detail = "Andika maelezo kamili.";
    if (!form.image.trim()) next.image = "Weka picha kuu.";
    if (!form.maker.trim()) next.maker = "Weka mtengenezaji.";
    if (!form.palette.trim()) next.palette = "Weka rangi.";
    if (!Number.isFinite(form.stock) || form.stock < 0) next.stock = "Stoo isiwe chini ya 0.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const id =
      product?.id ??
      `${form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32)}-${Math.random().toString(36).slice(2, 6)}`;

    onSave({
      id,
      name: form.name.trim(),
      price: Math.round(form.price),
      category: form.category,
      badge: form.badge.trim() || undefined,
      image: form.image.trim(),
      hoverImage: form.hoverImage.trim() || form.image.trim(),
      blurb: form.blurb.trim(),
      detail: form.detail.trim(),
      maker: form.maker.trim(),
      material: form.material.trim() || "Malighafi asilia",
      dimensions: form.dimensions.trim() || "Vipimo vinatofautiana",
      palette: form.palette.trim(),
      rating: Number(form.rating) || 5,
      reviewCount: Number(form.reviewCount) || 0,
      stock: Math.max(0, Math.round(form.stock)),
      sku: form.sku.trim() || `AU-${Math.floor(100 + Math.random() * 900)}`,
      visible: form.visible,
      custom: true,
    });
  };

  return (
    <Modal
      title={product ? "Hariri bidhaa" : "Ongeza bidhaa mpya"}
      subtitle="Paneli ya msimamizi · Katalogi"
      onClose={onClose}
      size="xl"
      footer={
        <>
          <button type="button" onClick={onClose} className="cursor-pointer text-[10px] uppercase tracking-[0.1em] text-stone hover:text-ink">
            Ghairi
          </button>
          <button type="button" onClick={save} className="btn-clay px-5 py-2.5 text-[9.5px]">
            {product ? "Hifadhi mabadiliko" : "Ongeza bidhaa"}
            <Check className="h-3.5 w-3.5" />
          </button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:gap-7">
        <div className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Jina la bidhaa" htmlFor="ap-name" error={errors.name}>
              <input id="ap-name" value={form.name} onChange={(event) => set("name", event.target.value)} className="field" placeholder="Mfano: Bakuli la Mapambo" aria-invalid={Boolean(errors.name)} />
            </Field>
            <Field label="Bei (TSh)" htmlFor="ap-price" error={errors.price} hint={money(form.price || 0)}>
              <input
                id="ap-price"
                inputMode="numeric"
                value={form.price ? Number(form.price).toLocaleString("en-US") : ""}
                onChange={(event) => set("price", Number(event.target.value.replace(/[^0-9]/g, "")) || 0)}
                className="field tabular-nums"
                placeholder="45,000"
                aria-invalid={Boolean(errors.price)}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Aina" htmlFor="ap-cat">
              <select id="ap-cat" value={form.category} onChange={(event) => set("category", event.target.value as Category)} className="field cursor-pointer">
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Stoo" htmlFor="ap-stock" error={errors.stock}>
              <input
                id="ap-stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => set("stock", Number(event.target.value))}
                className="field tabular-nums"
                aria-invalid={Boolean(errors.stock)}
              />
            </Field>
            <Field label="SKU" htmlFor="ap-sku" hint="Hutengwa kiotomatiki">
              <input id="ap-sku" value={form.sku} onChange={(event) => set("sku", event.target.value)} className="field" placeholder="AU-104" />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Mtengenezaji" htmlFor="ap-maker" error={errors.maker}>
              <input id="ap-maker" value={form.maker} onChange={(event) => set("maker", event.target.value)} className="field" placeholder="Neema Mwaikambo" aria-invalid={Boolean(errors.maker)} />
            </Field>
            <Field label="Beji (si lazima)" htmlFor="ap-badge">
              <input id="ap-badge" value={form.badge} onChange={(event) => set("badge", event.target.value)} className="field" placeholder="Kipya" />
            </Field>
          </div>

          <Field label="Maelezo mafupi" htmlFor="ap-blurb" error={errors.blurb}>
            <input id="ap-blurb" value={form.blurb} onChange={(event) => set("blurb", event.target.value)} className="field" placeholder="Sentensi moja inayoeleza bidhaa" aria-invalid={Boolean(errors.blurb)} />
          </Field>

          <Field label="Maelezo kamili" htmlFor="ap-detail" error={errors.detail}>
            <textarea id="ap-detail" value={form.detail} onChange={(event) => set("detail", event.target.value)} rows={4} className="field resize-y leading-relaxed" placeholder="Historia, malighafi, jinsi ilivyotengenezwa…" aria-invalid={Boolean(errors.detail)} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Malighafi" htmlFor="ap-material">
              <input id="ap-material" value={form.material} onChange={(event) => set("material", event.target.value)} className="field" placeholder="Udongo uliowekwa glasi" />
            </Field>
            <Field label="Vipimo" htmlFor="ap-dim">
              <input id="ap-dim" value={form.dimensions} onChange={(event) => set("dimensions", event.target.value)} className="field" placeholder="Kipenyo 28 × Urefu 9 sm" />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Rangi" htmlFor="ap-palette" error={errors.palette}>
              <input id="ap-palette" value={form.palette} onChange={(event) => set("palette", event.target.value)} className="field" placeholder="Mchanga" aria-invalid={Boolean(errors.palette)} />
            </Field>
            <Field label="Nyota" htmlFor="ap-rating">
              <input id="ap-rating" type="number" min={1} max={5} step={0.1} value={form.rating} onChange={(event) => set("rating", Number(event.target.value))} className="field tabular-nums" />
            </Field>
            <Field label="Maoni" htmlFor="ap-reviews">
              <input id="ap-reviews" type="number" min={0} value={form.reviewCount} onChange={(event) => set("reviewCount", Number(event.target.value))} className="field tabular-nums" />
            </Field>
          </div>

          <label htmlFor="ap-visible" className="flex cursor-pointer items-center justify-between gap-4 border border-ink/12 bg-cream/60 px-3.5 py-3">
            <span>
              <span className="block text-[11.5px] font-medium">Onyesha dukani</span>
              <span className="mt-0.5 block text-[10px] text-stone">Kama umekizima, bidhaa haitaonekana kwa wateja.</span>
            </span>
            <input id="ap-visible" type="checkbox" checked={form.visible} onChange={(event) => set("visible", event.target.checked)} className="h-4 w-4 cursor-pointer accent-[#a8502f]" />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <p className="eyebrow mb-1.5 text-[9px] text-stone">Picha kuu</p>
            <div className="relative overflow-hidden rounded-[2px] border border-ink/12 bg-sand">
              {form.image ? (
                <img src={form.image} alt="Onyesho la picha kuu" className="aspect-[4/5] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 p-4 text-center">
                  <Package className="h-6 w-6 text-ink/30" />
                  <p className="text-[10px] leading-snug text-stone">Hakuna picha bado</p>
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="absolute inset-x-2 bottom-2 flex cursor-pointer items-center justify-center gap-1.5 bg-paper/95 py-2 text-[9.5px] uppercase tracking-[0.1em] text-ink backdrop-blur-sm hover:bg-paper disabled:opacity-60">
                <Upload className="h-3.5 w-3.5" /> {busy ? "Inapakia…" : "Pakia picha"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0], "image")} />
            <input
              type="url"
              value={form.image.startsWith("data:") ? "" : form.image}
              onChange={(event) => set("image", event.target.value)}
              placeholder="Au bandika URL ya picha"
              aria-label="URL ya picha kuu"
              className="field mt-2 text-[11px]"
            />
            {form.image.startsWith("data:") && (
              <p className="mt-1 flex items-center gap-1.5 text-[9.5px] text-olive">
                <Check className="h-3 w-3" /> Picha imepakiwa kutoka kifaa chako
              </p>
            )}
            {errors.image && <p className="mt-1 text-[10px] text-clay">{errors.image}</p>}
          </div>

          <div>
            <p className="eyebrow mb-1.5 text-[9px] text-stone">Picha ya pili</p>
            <div className="relative overflow-hidden rounded-[2px] border border-ink/12 bg-sand">
              {form.hoverImage ? (
                <img src={form.hoverImage} alt="Picha ya pili" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center p-3 text-center text-[10px] text-stone">Inatumia picha kuu</div>
              )}
              <button type="button" onClick={() => hoverRef.current?.click()} disabled={busy} className="absolute inset-x-2 bottom-2 flex cursor-pointer items-center justify-center gap-1.5 bg-paper/95 py-1.5 text-[9px] uppercase tracking-[0.1em] text-ink backdrop-blur-sm hover:bg-paper disabled:opacity-60">
                <Upload className="h-3 w-3" /> Pakia
              </button>
            </div>
            <input ref={hoverRef} type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0], "hoverImage")} />
            {form.hoverImage && (
              <button type="button" onClick={() => set("hoverImage", "")} className="mt-1.5 cursor-pointer text-[9px] uppercase tracking-[0.1em] text-stone underline underline-offset-4 hover:text-clay">
                Ondoa picha ya pili
              </button>
            )}
          </div>

          <div className="border border-ink/10 bg-cream/60 p-3">
            <p className="text-[9px] uppercase tracking-[0.1em] text-stone">Onyesho la dukani</p>
            <div className="mt-2 flex gap-2.5">
              <div className="h-[70px] w-[56px] shrink-0 overflow-hidden rounded-[1px] bg-sand">
                {form.image && <img src={form.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium">{form.name || "Jina la bidhaa"}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-stone">{form.category}</p>
                <p className="mt-1 text-[10.5px] tabular-nums">{money(form.price || 0)}</p>
                <p className="mt-0.5 text-[9px] text-stone">Stoo {form.stock}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminProducts({ data, actions }: AdminViewProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Zote">("Zote");
  const [status, setStatus] = useState<"zote" | "hai" | "fichwa" | "stoo-ndogo" | "imeisha">("zote");
  const [sort, setSort] = useState("mpya");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [query, category, status, sort]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = data.products.filter((product) => {
      const stock = stockOf(product);
      const matchesTerm = !term || `${product.name} ${product.maker} ${product.palette} ${product.material} ${product.sku ?? ""}`.toLowerCase().includes(term);
      const matchesCategory = category === "Zote" || product.category === category;
      const matchesStatus =
        status === "zote" ||
        (status === "hai" && product.visible !== false) ||
        (status === "fichwa" && product.visible === false) ||
        (status === "stoo-ndogo" && stock > 0 && stock <= data.settings.lowStockThreshold) ||
        (status === "imeisha" && stock <= 0);
      return matchesTerm && matchesCategory && matchesStatus;
    });
    return list.sort((a, b) => {
      if (sort === "jina") return a.name.localeCompare(b.name, "sw");
      if (sort === "bei-juu") return b.price - a.price;
      if (sort === "bei-chini") return a.price - b.price;
      if (sort === "stoo") return stockOf(a) - stockOf(b);
      return 0;
    });
  }, [data.products, data.settings.lowStockThreshold, query, category, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const visibleCount = data.products.filter((product) => product.visible !== false).length;

  const saveProduct = (product: Product) => {
    const exists = data.products.some((item) => item.id === product.id);
    actions.setProducts(exists ? data.products.map((item) => (item.id === product.id ? product : item)) : [product, ...data.products]);
    actions.log("bidhaa", `${exists ? "Bidhaa imehaririwa" : "Bidhaa mpya imeongezwa"}: ${product.name}`, money(product.price));
    actions.notify(exists ? "Mabadiliko yamehifadhiwa" : "Bidhaa imeongezwa dukani");
    setEditing(null);
  };

  const patch = (ids: string[], changes: Partial<Product>) => {
    actions.setProducts(data.products.map((product) => (ids.includes(product.id) ? { ...product, ...changes } : product)));
  };

  const toggleVisible = (product: Product) => {
    patch([product.id], { visible: product.visible === false });
    actions.log("bidhaa", `${product.visible === false ? "Imeonyeshwa" : "Imefichwa"}: ${product.name}`);
  };

  const duplicate = (product: Product) => {
    const copy: Product = {
      ...product,
      id: `${product.id}-nakala-${Math.random().toString(36).slice(2, 5)}`,
      name: `${product.name} (Nakala)`,
      visible: false,
      custom: true,
    };
    actions.setProducts([copy, ...data.products]);
    actions.log("bidhaa", `Bidhaa imenakiliwa: ${product.name}`);
    actions.notify("Nakala imeundwa kama rasimu");
  };

  const remove = (ids: string[]) => {
    actions.setProducts(data.products.filter((product) => !ids.includes(product.id)));
    actions.log("bidhaa", ids.length === 1 ? `Bidhaa imefutwa: ${data.products.find((p) => p.id === ids[0])?.name ?? ""}` : `Bidhaa ${ids.length} zimefutwa`);
    actions.notify(ids.length === 1 ? "Bidhaa imefutwa" : `Bidhaa ${ids.length} zimefutwa`);
    setPendingDelete(null);
    setSelected([]);
  };

  const updateStock = (product: Product, next: number) => {
    patch([product.id], { stock: Math.max(0, Math.round(next)) });
  };

  const exportProducts = () => {
    exportCsv(
      "bidhaa-asili-udongo.csv",
      ["Jina", "Aina", "Bei (TSh)", "Stoo", "SKU", "Mtengenezaji", "Hali"],
      filtered.map((product) => [
        product.name,
        product.category,
        product.price,
        stockOf(product),
        product.sku ?? "—",
        product.maker,
        product.visible === false ? "Imehichwa" : "Inaonekana",
      ]),
    );
    actions.notify("Orodha ya bidhaa imehamishwa");
  };

  const allSelected = rows.length > 0 && rows.every((product) => selected.includes(product.id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-clay">Katalogi</p>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Bidhaa za duka</h2>
          <p className="mt-1.5 text-[11px] text-stone">
            {data.products.length} bidhaa · {visibleCount} dukani · {data.products.length - visibleCount} zimefichwa
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportProducts} className="btn-outline px-3.5 py-2.5 text-[9px]">
            <Download className="h-3.5 w-3.5" /> Hamisha CSV
          </button>
          <button type="button" onClick={() => setEditing("new")} className="btn-clay px-4 py-2.5 text-[9.5px]">
            <Plus className="h-3.5 w-3.5" /> Ongeza bidhaa
          </button>
        </div>
      </div>

      <Card className="p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Tafuta jina, mtengenezaji, SKU…" className="w-full lg:max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            <Select
              label="Aina ya bidhaa"
              value={category}
              onChange={(next) => setCategory(next as Category | "Zote")}
              options={[{ value: "Zote", label: "Aina zote" }, ...CATEGORIES.map((item) => ({ value: item, label: item }))]}
            />
            <Select
              label="Panga bidhaa"
              value={sort}
              onChange={setSort}
              options={[
                { value: "mpya", label: "Mpangilio wa awali" },
                { value: "jina", label: "Jina" },
                { value: "bei-juu", label: "Bei, juu hadi chini" },
                { value: "bei-chini", label: "Bei, chini hadi juu" },
                { value: "stoo", label: "Stoo, ndogo kwanza" },
              ]}
            />
          </div>
        </div>
        <div className="mt-3">
          <Chips
            options={[
              { id: "zote", label: "Zote", count: data.products.length },
              { id: "hai", label: "Zinaonekana", count: visibleCount },
              { id: "fichwa", label: "Zimefichwa", count: data.products.length - visibleCount },
              {
                id: "stoo-ndogo",
                label: "Stoo ndogo",
                count: data.products.filter((p) => stockOf(p) > 0 && stockOf(p) <= data.settings.lowStockThreshold).length,
              },
              { id: "imeisha", label: "Zimeisha", count: data.products.filter((p) => stockOf(p) <= 0).length },
            ]}
            value={status}
            onChange={setStatus}
          />
        </div>
      </Card>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border border-ink/15 bg-ink px-4 py-2.5 text-cream">
          <p className="text-[10px] uppercase tracking-[0.1em]">
            {selected.length} {selected.length === 1 ? "imechaguliwa" : "zimechaguliwa"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => { patch(selected, { visible: true }); actions.notify("Bidhaa zimeonyeshwa"); setSelected([]); }} className="cursor-pointer rounded-full border border-cream/25 px-3 py-1.5 text-[9px] uppercase tracking-[0.08em] hover:border-cream">
              Onyesha
            </button>
            <button type="button" onClick={() => { patch(selected, { visible: false }); actions.notify("Bidhaa zimefichwa"); setSelected([]); }} className="cursor-pointer rounded-full border border-cream/25 px-3 py-1.5 text-[9px] uppercase tracking-[0.08em] hover:border-cream">
              Ficha
            </button>
            <button type="button" onClick={() => setPendingDelete(selected)} className="cursor-pointer rounded-full bg-clay px-3 py-1.5 text-[9px] uppercase tracking-[0.08em] text-paper hover:bg-clay-deep">
              Futa
            </button>
            <button type="button" onClick={() => setSelected([])} className="cursor-pointer px-1 text-[9px] uppercase tracking-[0.08em] text-cream/60 hover:text-cream">
              Ondoa chaguo
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-5 w-5" />}
          title={data.products.length === 0 ? "Duka halina bidhaa bado." : "Hakuna bidhaa inayolingana."}
          text={
            data.products.length === 0
              ? "Ongeza bidhaa yako ya kwanza — itaonekana dukani mara moja."
              : "Badilisha utafutaji, aina au hali ya bidhaa."
          }
          action={
            <>
              <button type="button" onClick={() => setEditing("new")} className="btn-clay px-4 py-2.5 text-[9.5px]">
                <Plus className="h-3.5 w-3.5" /> Ongeza bidhaa
              </button>
              <button
                type="button"
                onClick={() => { setQuery(""); setCategory("Zote"); setStatus("zote"); setSort("mpya"); }}
                className="cursor-pointer text-[9.5px] uppercase tracking-[0.1em] text-ink-soft underline underline-offset-4 hover:text-ink"
              >
                Futa vichujio
              </button>
            </>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-ink/10 bg-cream/40 text-[8px] uppercase tracking-[0.11em] text-stone">
                  <th className="w-10 px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label="Chagua bidhaa zote"
                      checked={allSelected}
                      onChange={(event) => setSelected(event.target.checked ? rows.map((product) => product.id) : [])}
                      className="h-3.5 w-3.5 cursor-pointer accent-[#a8502f]"
                    />
                  </th>
                  <th className="px-2 py-2.5 font-normal">Bidhaa</th>
                  <th className="px-3 py-2.5 font-normal">Aina</th>
                  <th className="px-3 py-2.5 text-right font-normal">Bei</th>
                  <th className="px-3 py-2.5 font-normal">Stoo</th>
                  <th className="px-3 py-2.5 font-normal">Hali</th>
                  <th className="px-3 py-2.5 text-right font-normal">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {rows.map((product) => {
                  const stock = stockOf(product);
                  const stockInfo = stockBadge(stock, data.settings.lowStockThreshold);
                  const checked = selected.includes(product.id);
                  return (
                    <tr key={product.id} className={`align-middle transition-colors ${checked ? "bg-clay/[0.03]" : "hover:bg-cream/40"}`}>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          aria-label={`Chagua ${product.name}`}
                          checked={checked}
                          onChange={(event) =>
                            setSelected((previous) =>
                              event.target.checked ? [...previous, product.id] : previous.filter((id) => id !== product.id),
                            )
                          }
                          className="h-3.5 w-3.5 cursor-pointer accent-[#a8502f]"
                        />
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-11 w-9 shrink-0 overflow-hidden rounded-[1px] bg-sand">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="flex h-full items-center justify-center"><Package className="h-3.5 w-3.5 text-ink/25" /></span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="max-w-[190px] truncate text-[11.5px] font-medium">{product.name}</p>
                              {product.custom && <span className="text-[7.5px] uppercase tracking-[0.08em] text-clay">mpya</span>}
                            </div>
                            <p className="mt-0.5 truncate text-[9px] text-stone">
                              {product.sku ?? "—"} · {product.maker}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[10px] uppercase tracking-[0.08em] text-ink-soft">{product.category}</td>
                      <td className="px-3 py-2.5 text-right text-[11px] tabular-nums">{money(product.price)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            value={stock}
                            onChange={(event) => updateStock(product, Number(event.target.value))}
                            aria-label={`Stoo ya ${product.name}`}
                            className="w-14 border border-ink/15 bg-paper px-1.5 py-1 text-[10.5px] tabular-nums focus:border-clay focus:outline-none"
                          />
                          <Badge tone={stockInfo.tone}>{stockInfo.label}</Badge>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={product.visible === false ? "stone" : "olive"}>
                          {product.visible === false ? "Imefichwa" : "Dukani"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <button type="button" onClick={() => toggleVisible(product)} aria-label={product.visible === false ? `Onyesha ${product.name}` : `Ficha ${product.name}`} title={product.visible === false ? "Onyesha" : "Ficha"} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink">
                            {product.visible === false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button type="button" onClick={() => setEditing(product)} aria-label={`Hariri ${product.name}`} title="Hariri" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => duplicate(product)} aria-label={`Nakili ${product.name}`} title="Nakili" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => setPendingDelete([product.id])} aria-label={`Futa ${product.name}`} title="Futa" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-stone transition-colors hover:bg-clay/5 hover:text-clay">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={current} pages={pages} showing={rows.length} total={filtered.length} onPage={setPage} />
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-stone">
        <p className="inline-flex items-center gap-2">
          <ArrowRight className="h-3.5 w-3.5 text-clay" />
          Mabadiliko yanaonekana dukani papo hapo.
        </p>
        <button type="button" onClick={() => setEditing("new")} className="btn-outline px-4 py-2.5 text-[9px]">
          <Plus className="h-3.5 w-3.5" /> Bidhaa mpya
        </button>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title={pendingDelete.length > 1 ? `Futa bidhaa ${pendingDelete.length}?` : "Futa bidhaa hii?"}
          text="Bidhaa itaondolewa dukani mara moja. Hatua hii haiwezi kurudishwa."
          confirmLabel="Futa"
          destructive
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => remove(pendingDelete)}
        />
      )}

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}
