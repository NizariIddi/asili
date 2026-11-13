import { useMemo, useState } from "react";
import {
  buildCustomers,
  exportCsv,
  itemCount,
  orderStatusMeta,
  seedOrders,
  timeAgo,
  type AdminViewProps,
  type ShopOrderStatus,
} from "../../admin";
import { escrowTotal, formatDate, moneyTZS, statusMeta, type EscrowStatus } from "../../escrow";
import {
  ArrowUpRight,
  Bag,
  Check,
  Download,
  Lock,
  Mail,
  Package,
  Shield,
  Truck,
  Users,
  Wallet,
} from "../Icons";
import {
  Badge,
  Card,
  CardHead,
  Chips,
  ConfirmDialog,
  Drawer,
  EmptyState,
  KpiGrid,
  Pagination,
  SearchInput,
  Stat,
} from "./AdminUI";

/* --------------------------------- orders --------------------------------- */

const orderFilters: { id: ShopOrderStatus | "zote"; label: string }[] = [
  { id: "zote", label: "Zote" },
  { id: "mpya", label: "Mpya" },
  { id: "imeandaliwa", label: "Imeandaliwa" },
  { id: "imesafirishwa", label: "Imesafirishwa" },
  { id: "imefikiwa", label: "Imefikiwa" },
  { id: "imeghairiwa", label: "Imeghairiwa" },
];

export function AdminOrders({ data, actions }: AdminViewProps) {
  const [filter, setFilter] = useState<ShopOrderStatus | "zote">("zote");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);

  const orders = useMemo(
    () =>
      [...data.orders]
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter((order) => filter === "zote" || order.status === filter)
        .filter((order) => {
          const term = query.trim().toLowerCase();
          return !term || `${order.id} ${order.customer.name} ${order.customer.email} ${order.customer.city}`.toLowerCase().includes(term);
        }),
    [data.orders, filter, query],
  );

  const pageSize = 8;
  const pages = Math.max(1, Math.ceil(orders.length / pageSize));
  const current = Math.min(page, pages);
  const rows = orders.slice((current - 1) * pageSize, current * pageSize);
  const selected = data.orders.find((order) => order.id === openId) ?? null;

  const revenue = data.orders.filter((order) => order.status !== "imeghairiwa").reduce((sum, order) => sum + order.total, 0);
  const newCount = data.orders.filter((order) => order.status === "mpya").length;
  const shipCount = data.orders.filter((order) => order.status === "imeandaliwa").length;

  const open = (id: string) => {
    setOpenId(id);
    setNote(data.orders.find((order) => order.id === id)?.note ?? "");
  };

  const advance = (status: ShopOrderStatus) => {
    if (!selected) return;
    actions.updateOrder(selected.id, { status });
    actions.log("oda", `Oda ${selected.id}: ${orderStatusMeta[status].label.toLowerCase()}`, selected.customer.name);
    actions.notify("Hali ya oda imesasishwa");
  };

  const seed = () => {
    const demo = seedOrders(data.products, data.settings);
    if (demo.length === 0) {
      actions.notify("Hakuna bidhaa za kuunda oda za mfano", "error");
      return;
    }
    actions.setOrders(demo);
    actions.log("mfumo", `Oda ${demo.length} za mfano zimewekwa`);
    actions.notify("Data ya mfano imewekwa kwenye oda");
  };

  const exportOrders = () => {
    exportCsv(
      "oda-asili-udongo.csv",
      ["Oda", "Tarehe", "Mteja", "Barua pepe", "Mji", "Vipande", "Jumla (TSh)", "Hali"],
      orders.map((order) => [
        order.id,
        new Date(order.createdAt).toISOString().slice(0, 10),
        order.customer.name,
        order.customer.email,
        order.customer.city,
        itemCount(order),
        order.total,
        orderStatusMeta[order.status].label,
      ]),
    );
    actions.notify("Oda zimehamishwa kwa CSV");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-clay">Uuzaji</p>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Oda za duka</h2>
          <p className="mt-1.5 text-[11px] text-stone">Fuatilia oda kutoka malipo hadi uwasilishaji.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportOrders} className="btn-outline px-3.5 py-2.5 text-[9px]">
            <Download className="h-3.5 w-3.5" /> Hamisha CSV
          </button>
          {data.orders.length === 0 && (
            <button type="button" onClick={seed} className="btn-clay px-4 py-2.5 text-[9.5px]">
              <Package className="h-3.5 w-3.5" /> Weka oda za mfano
            </button>
          )}
        </div>
      </div>

      <KpiGrid>
        <Stat label="Mapato yote" value={moneyTZS(revenue)} hint={`${data.orders.length} oda`} icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Oda mpya" value={String(newCount)} hint="Zinasubiri kuandaliwa" icon={<Bag className="h-4 w-4" />} />
        <Stat label="Zinasubiri kusafiri" value={String(shipCount)} hint="Zimeandaliwa tayari" icon={<Truck className="h-4 w-4" />} />
        <Stat
          label="Wastani wa oda"
          value={moneyTZS(data.orders.length > 0 ? Math.round(revenue / data.orders.length) : 0)}
          hint="Kwa oda"
          icon={<Wallet className="h-4 w-4" />}
        />
      </KpiGrid>

      <Card className="p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={(next) => { setQuery(next); setPage(1); }} placeholder="Tafuta oda, mteja, mji…" className="w-full lg:max-w-xs" />
          <Chips
            options={orderFilters.map((item) => ({
              id: item.id,
              label: item.label,
              count: item.id === "zote" ? data.orders.length : data.orders.filter((order) => order.status === item.id).length,
            }))}
            value={filter}
            onChange={(next) => { setFilter(next); setPage(1); }}
          />
        </div>
      </Card>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Bag className="h-5 w-5" />}
          title={data.orders.length === 0 ? "Hakuna oda bado." : "Hakuna oda inayolingana."}
          text={
            data.orders.length === 0
              ? "Oda mpya za wateja zitaonekana hapa mara baada ya malipo kukamilika. Unaweza pia kuweka oda za mfano kuona dashibodi ikifanya kazi."
              : "Badilisha kichujio au utafutaji."
          }
          action={
            <>
              {data.orders.length === 0 && (
                <button type="button" onClick={seed} className="btn-clay px-4 py-2.5 text-[9.5px]">
                  Weka oda za mfano
                </button>
              )}
              <button type="button" onClick={() => { setFilter("zote"); setQuery(""); }} className="cursor-pointer text-[9.5px] uppercase tracking-[0.1em] text-ink-soft underline underline-offset-4 hover:text-ink">
                Futa vichujio
              </button>
            </>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-ink/10 bg-cream/40 text-[8px] uppercase tracking-[0.11em] text-stone">
                  <th className="px-4 py-2.5 font-normal sm:px-5">Oda</th>
                  <th className="px-3 py-2.5 font-normal">Mteja</th>
                  <th className="px-3 py-2.5 font-normal">Vipande</th>
                  <th className="px-3 py-2.5 text-right font-normal">Jumla</th>
                  <th className="px-3 py-2.5 font-normal">Hali</th>
                  <th className="px-4 py-2.5 text-right font-normal sm:px-5"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {rows.map((order) => (
                  <tr
                    key={order.id}
                    tabIndex={0}
                    onClick={() => open(order.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") open(order.id);
                    }}
                    className="cursor-pointer transition-colors hover:bg-cream/40 focus:bg-cream/60 focus:outline-none"
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <p className="text-[11px] font-medium">{order.id}</p>
                      <p className="mt-0.5 text-[8.5px] text-stone">{timeAgo(order.createdAt)}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[11px]">{order.customer.name}</p>
                      <p className="mt-0.5 text-[8.5px] text-stone">{order.customer.city}</p>
                    </td>
                    <td className="px-3 py-3 text-[10.5px] tabular-nums">{itemCount(order)}</td>
                    <td className="px-3 py-3 text-right text-[11px] tabular-nums">{moneyTZS(order.total)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={orderStatusMeta[order.status].tone}>{orderStatusMeta[order.status].label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <button type="button" onClick={() => open(order.id)} className="inline-flex cursor-pointer items-center gap-1 text-[9px] uppercase tracking-[0.08em] text-ink-soft hover:text-clay">
                        Fungua <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={current} pages={pages} showing={rows.length} total={orders.length} onPage={setPage} />
        </Card>
      )}

      {selected && (
        <Drawer
          title={selected.id}
          subtitle={`Oda · ${timeAgo(selected.createdAt)}`}
          onClose={() => setOpenId(null)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone={orderStatusMeta[selected.status].tone}>{orderStatusMeta[selected.status].label}</Badge>
              <div className="flex flex-wrap items-center gap-2">
                {orderStatusMeta[selected.status].next && (
                  <button
                    type="button"
                    onClick={() => advance(orderStatusMeta[selected.status].next!)}
                    className="btn-clay px-4 py-2.5 text-[9px]"
                  >
                    {orderStatusMeta[selected.status].nextLabel}
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                )}
                {!["imefikiwa", "imeghairiwa"].includes(selected.status) && (
                  <button type="button" onClick={() => setCancelId(selected.id)} className="btn-outline px-3.5 py-2.5 text-[9px]">
                    Ghairi oda
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3 border border-ink/10 bg-cream/50 p-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay/10 text-clay">
                <Users className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11.5px] font-medium">{selected.customer.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-stone">{selected.customer.email}</p>
              </div>
              <a
                href={`mailto:${selected.customer.email}`}
                aria-label="Tuma barua pepe kwa mteja"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Anwani ya uwasilishaji</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed">
                {selected.customer.address}
                <br />
                {selected.customer.city}, {selected.customer.postcode}
                {selected.customer.phone ? (
                  <>
                    <br />
                    {selected.customer.phone}
                  </>
                ) : null}
              </p>
            </div>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Vitu ({itemCount(selected)})</p>
              <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
                {selected.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3 py-2.5">
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-[1px] bg-sand">
                      {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium">{item.name}</p>
                      <p className="mt-0.5 text-[9px] text-stone">
                        {moneyTZS(item.price)} × {item.qty}
                      </p>
                    </div>
                    <p className="text-[10.5px] tabular-nums">{moneyTZS(item.price * item.qty)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 text-[10.5px]">
                <div className="flex justify-between"><dt className="text-stone">Jumla ndogo</dt><dd className="tabular-nums">{moneyTZS(selected.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-stone">Usafirishaji</dt><dd className="tabular-nums">{selected.shipping === 0 ? "Bila malipo" : moneyTZS(selected.shipping)}</dd></div>
                <div className="flex justify-between border-t border-ink/10 pt-2 text-[13px] font-medium"><dt>Jumla</dt><dd className="tabular-nums">{moneyTZS(selected.total)}</dd></div>
              </dl>
            </div>

            <div>
              <label htmlFor="order-note" className="text-[8.5px] uppercase tracking-[0.11em] text-stone">
                Dokezo la ndani
              </label>
              <textarea
                id="order-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder="Mfano: mteja aliomba kufungwa kama zawadi…"
                className="field mt-1.5 resize-y text-[11px]"
              />
              <button
                type="button"
                onClick={() => {
                  actions.updateOrder(selected.id, { note: note.trim() || undefined });
                  actions.log("oda", `Dokezo limehifadhiwa: ${selected.id}`);
                  actions.notify("Dokezo limehifadhiwa");
                }}
                className="mt-2 cursor-pointer text-[9px] uppercase tracking-[0.09em] text-ink underline decoration-ink/25 underline-offset-4 hover:text-clay"
              >
                Hifadhi dokezo
              </button>
            </div>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Hatua za oda</p>
              <ol className="mt-2 space-y-1.5">
                {(["mpya", "imeandaliwa", "imesafirishwa", "imefikiwa"] as ShopOrderStatus[]).map((step) => {
                  const order = ["mpya", "imeandaliwa", "imesafirishwa", "imefikiwa"];
                  const reached = order.indexOf(selected.status) >= order.indexOf(step) && selected.status !== "imeghairiwa";
                  return (
                    <li key={step} className="flex items-center gap-2 text-[10.5px]">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${reached ? "border-olive bg-olive text-cream" : "border-ink/20 text-transparent"}`}>
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span className={reached ? "text-ink" : "text-stone"}>{orderStatusMeta[step].label}</span>
                    </li>
                  );
                })}
                {selected.status === "imeghairiwa" && (
                  <li className="flex items-center gap-2 text-[10.5px] text-clay-deep">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-clay-deep text-cream"><Check className="h-2.5 w-2.5" /></span>
                    Imeghairiwa
                  </li>
                )}
              </ol>
            </div>
          </div>
        </Drawer>
      )}

      {cancelId && (
        <ConfirmDialog
          title="Ghairi oda hii?"
          text="Oda itawekwa kama imeghairiwa. Hifadhi ya bidhaa haitarejeshwa kiotomatiki."
          confirmLabel="Ghairi oda"
          destructive
          onCancel={() => setCancelId(null)}
          onConfirm={() => {
            actions.updateOrder(cancelId, { status: "imeghairiwa" });
            actions.log("oda", `Oda imeghairiwa: ${cancelId}`);
            actions.notify("Oda imeghairiwa");
            setCancelId(null);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------- commissions ------------------------------ */

const commissionFilters: { id: EscrowStatus | "zote"; label: string }[] = [
  { id: "zote", label: "Zote" },
  { id: "inasubiri", label: "Zinasubiri" },
  { id: "inaendelea", label: "Zinaendelea" },
  { id: "imewasilishwa", label: "Zimewasilishwa" },
  { id: "mgogoro", label: "Migogoro" },
  { id: "imekamilika", label: "Zimekamilika" },
];

export function AdminCommissions({ data, actions }: AdminViewProps) {
  const [filter, setFilter] = useState<EscrowStatus | "zote">("zote");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; action: "resolve" | "refund" } | null>(null);

  const items = useMemo(
    () =>
      data.commissions
        .filter((commission) => filter === "zote" || commission.status === filter)
        .filter((commission) => {
          const term = query.trim().toLowerCase();
          return !term || `${commission.id} ${commission.title} ${commission.contactName} ${commission.artist}`.toLowerCase().includes(term);
        }),
    [data.commissions, filter, query],
  );

  const selected = data.commissions.find((commission) => commission.id === openId) ?? null;
  const held = data.commissions
    .filter((commission) => ["imefadhiliwa", "inaendelea", "imewasilishwa", "mgogoro"].includes(commission.status))
    .reduce((sum, commission) => sum + escrowTotal(commission), 0);
  const paid = data.commissions
    .filter((commission) => commission.status === "imekamilika")
    .reduce((sum, commission) => sum + commission.budget, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-clay">Sanaa maalum</p>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Maagizo ya escrow</h2>
          <p className="mt-1.5 text-[11px] text-stone">Usimamizi wa maagizo ya sanaa na fedha zilizoshikiliwa.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              exportCsv(
                "maagizo-escrow.csv",
                ["Kumbukumbu", "Kazi", "Msanii", "Mteja", "Barua pepe", "Bajeti", "Ada", "Escrow", "Hali", "Mwisho"],
                data.commissions.map((commission) => [
                  commission.id,
                  commission.title,
                  commission.artist,
                  commission.contactName,
                  commission.contactEmail,
                  commission.budget,
                  commission.fee,
                  escrowTotal(commission),
                  statusMeta[commission.status].label,
                  commission.deadline,
                ]),
              );
              actions.notify("Maagizo yamehamishwa");
            }}
            className="btn-outline px-3.5 py-2.5 text-[9px]"
          >
            <Download className="h-3.5 w-3.5" /> Hamisha CSV
          </button>
          <button type="button" onClick={actions.onOpenEscrow} className="btn-clay px-4 py-2.5 text-[9.5px]">
            Dashibodi ya mteja <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <KpiGrid>
        <Stat label="Maagizo yote" value={String(data.commissions.length)} hint={`${data.commissions.filter((c) => ["inaendelea", "imewasilishwa"].includes(c.status)).length} yanaendelea`} icon={<Shield className="h-4 w-4" />} />
        <Stat label="Fedha escrow" value={moneyTZS(held)} hint="Zimeshikiliwa" icon={<Lock className="h-4 w-4" />} />
        <Stat label="Zilizolipwa" value={moneyTZS(paid)} hint="Kwa wasanii" icon={<Check className="h-4 w-4" />} />
        <Stat label="Migogoro" value={String(data.commissions.filter((c) => c.status === "mgogoro").length)} hint="Yanahitaji suluhu" icon={<Shield className="h-4 w-4" />} />
      </KpiGrid>

      <Card className="p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Tafuta agizo, mteja, msanii…" className="w-full lg:max-w-xs" />
          <Chips
            options={commissionFilters.map((item) => ({
              id: item.id,
              label: item.label,
              count: item.id === "zote" ? data.commissions.length : data.commissions.filter((commission) => commission.status === item.id).length,
            }))}
            value={filter}
            onChange={setFilter}
          />
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-5 w-5" />}
          title={data.commissions.length === 0 ? "Hakuna maagizo ya sanaa bado." : "Hakuna maagizo yanayolingana."}
          text="Wateja wanaweza kuomba sanaa na kuweka fedha escrow kutoka ukurasa wa mwanzo wa duka."
          action={
            <button type="button" onClick={actions.onOpenEscrow} className="btn-outline px-4 py-2.5 text-[9.5px]">
              Fungua dashibodi ya escrow <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-ink/10 bg-cream/40 text-[8px] uppercase tracking-[0.11em] text-stone">
                  <th className="px-4 py-2.5 font-normal sm:px-5">Kazi</th>
                  <th className="px-3 py-2.5 font-normal">Mteja</th>
                  <th className="px-3 py-2.5 font-normal">Msanii</th>
                  <th className="px-3 py-2.5 text-right font-normal">Escrow</th>
                  <th className="px-3 py-2.5 font-normal">Hali</th>
                  <th className="px-4 py-2.5 text-right font-normal sm:px-5"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {items.map((commission) => (
                  <tr key={commission.id} className="transition-colors hover:bg-cream/40">
                    <td className="px-4 py-3 sm:px-5">
                      <p className="text-[11px] font-medium">{commission.title}</p>
                      <p className="mt-0.5 text-[8.5px] text-stone">{commission.id} · {commission.size}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-[10.5px]">{commission.contactName}</p>
                      <p className="mt-0.5 text-[8.5px] text-stone">{commission.contactEmail}</p>
                    </td>
                    <td className="px-3 py-3 text-[10.5px] text-ink-soft">{commission.artist}</td>
                    <td className="px-3 py-3 text-right text-[10.5px] tabular-nums">{moneyTZS(escrowTotal(commission))}</td>
                    <td className="px-3 py-3">
                      <Badge tone={commission.status === "mgogoro" ? "danger" : commission.status === "imekamilika" ? "dark" : "clay"}>
                        {statusMeta[commission.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <button type="button" onClick={() => setOpenId(commission.id)} className="inline-flex cursor-pointer items-center gap-1 text-[9px] uppercase tracking-[0.08em] text-ink-soft hover:text-clay">
                        Fungua <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selected && (
        <Drawer
          title={selected.title}
          subtitle={`${selected.id} · ${statusMeta[selected.status].label}`}
          onClose={() => setOpenId(null)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => { actions.onOpenEscrow(); }}
                className="inline-flex cursor-pointer items-center gap-1.5 text-[9px] uppercase tracking-[0.09em] text-ink underline decoration-ink/25 underline-offset-4 hover:text-clay"
              >
                Dashibodi ya mteja <ArrowUpRight className="h-3 w-3" />
              </button>
              {selected.status === "mgogoro" && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setConfirm({ id: selected.id, action: "resolve" })} className="btn-clay px-3.5 py-2.5 text-[9px]">Suluhisha</button>
                  <button type="button" onClick={() => setConfirm({ id: selected.id, action: "refund" })} className="btn-outline px-3.5 py-2.5 text-[9px]">Rejesha</button>
                </div>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 border border-ink/10 bg-cream/50 p-3">
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Iliyowekwa escrow</p>
                <p className="mt-1 font-display text-[1.35rem] leading-none tabular-nums">{moneyTZS(escrowTotal(selected))}</p>
              </div>
              <Badge tone={selected.status === "mgogoro" ? "danger" : "clay"}>{statusMeta[selected.status].label}</Badge>
            </div>

            <p className="text-[11.5px] leading-relaxed text-ink-soft/90">{selected.brief}</p>

            <dl className="grid grid-cols-2 gap-3 border-y border-ink/10 py-3 text-[10.5px]">
              <div><dt className="text-[8.5px] uppercase tracking-[0.1em] text-stone">Mteja</dt><dd className="mt-0.5">{selected.contactName}</dd><dd className="text-stone">{selected.contactEmail}</dd></div>
              <div><dt className="text-[8.5px] uppercase tracking-[0.1em] text-stone">Msanii</dt><dd className="mt-0.5">{selected.artist}</dd><dd className="text-stone">{selected.typeLabel}</dd></div>
              <div><dt className="text-[8.5px] uppercase tracking-[0.1em] text-stone">Bajeti</dt><dd className="mt-0.5 tabular-nums">{moneyTZS(selected.budget)}</dd></div>
              <div><dt className="text-[8.5px] uppercase tracking-[0.1em] text-stone">Ada</dt><dd className="mt-0.5 tabular-nums">{moneyTZS(selected.fee)}</dd></div>
              <div><dt className="text-[8.5px] uppercase tracking-[0.1em] text-stone">Mwisho</dt><dd className="mt-0.5">{formatDate(selected.deadline)}</dd></div>
              <div><dt className="text-[8.5px] uppercase tracking-[0.1em] text-stone">Ukubwa</dt><dd className="mt-0.5">{selected.size}</dd></div>
            </dl>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Historia ya escrow</p>
              <ol className="mt-2 space-y-2">
                {[...selected.updates].reverse().map((update) => (
                  <li key={update.id} className="flex gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay/60" />
                    <div>
                      <p className="text-[10.5px] leading-snug">{update.label}</p>
                      <p className="text-[8.5px] text-stone">{formatDate(update.at)}{update.note ? ` · ${update.note}` : ""}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Drawer>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.action === "refund" ? "Rejesha fedha?" : "Suluhisha mgogoro?"}
          text={
            confirm.action === "refund"
              ? "Fedha zote zitarudishwa kwa mteja na agizo litafungwa."
              : "Agizo litarudi kwenye hatua ya uwasilishaji ili mteja aikague tena."
          }
          confirmLabel={confirm.action === "refund" ? "Rejesha fedha" : "Suluhisha"}
          destructive={confirm.action === "refund"}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            actions.onEscrowAction(confirm.id, confirm.action);
            actions.notify(confirm.action === "refund" ? "Fedha zimerejeshwa" : "Mgogoro umesuluhishwa");
            setConfirm(null);
            setOpenId(null);
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------- customers ------------------------------- */

export function AdminCustomers({ data, actions }: AdminViewProps) {
  const [query, setQuery] = useState("");
  const [openEmail, setOpenEmail] = useState<string | null>(null);
  const customers = useMemo(() => buildCustomers(data.orders, data.commissions), [data.orders, data.commissions]);
  const filtered = customers.filter((customer) => {
    const term = query.trim().toLowerCase();
    return !term || `${customer.name} ${customer.email} ${customer.city}`.toLowerCase().includes(term);
  });
  const selected = customers.find((customer) => customer.email === openEmail) ?? null;
  const repeat = customers.filter((customer) => customer.orders.length + customer.commissions.length > 1).length;
  const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-clay">Wateja</p>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Wateja wa studio</h2>
          <p className="mt-1.5 text-[11px] text-stone">Wateja wa duka pamoja na waagizaji wa sanaa maalum.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            exportCsv(
              "wateja-asili-udongo.csv",
              ["Jina", "Barua pepe", "Simu", "Mji", "Oda", "Maagizo", "Alitumia (TSh)", "Mara ya mwisho"],
              customers.map((customer) => [
                customer.name,
                customer.email,
                customer.phone ?? "—",
                customer.city,
                customer.orders.length,
                customer.commissions.length,
                customer.spent,
                new Date(customer.lastAt).toISOString().slice(0, 10),
              ]),
            );
            actions.notify("Orodha ya wateja imehamishwa");
          }}
          className="btn-outline px-3.5 py-2.5 text-[9px]"
        >
          <Download className="h-3.5 w-3.5" /> Hamisha CSV
        </button>
      </div>

      <KpiGrid>
        <Stat label="Wateja wote" value={String(customers.length)} hint="Duka na escrow" icon={<Users className="h-4 w-4" />} />
        <Stat label="Wateja wa kudumu" value={String(repeat)} hint="Zaidi ya oda moja" icon={<Users className="h-4 w-4" />} />
        <Stat label="Alitumia" value={moneyTZS(totalSpent)} hint="Jumla ya oda za duka" icon={<Wallet className="h-4 w-4" />} />
        <Stat label="Waagizaji wa sanaa" value={String(customers.filter((customer) => customer.commissions.length > 0).length)} hint="Wameagiza kazi maalum" icon={<Shield className="h-4 w-4" />} />
      </KpiGrid>

      <Card className="p-3.5">
        <SearchInput value={query} onChange={setQuery} placeholder="Tafuta jina, barua pepe, mji…" className="w-full sm:max-w-xs" />
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="Hakuna wateja bado."
          text="Wateja wataonekana hapa mara baada ya kuweka oda au kuomba sanaa. Unaweza kuweka oda za mfano kwenye ukurasa wa oda."
          action={<button type="button" onClick={() => actions.notify("Nenda kwenye Oda na ubonyeze 'Weka oda za mfano'", "info")} className="btn-outline px-4 py-2.5 text-[9.5px]">Jinsi ya kuanza</button>}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-ink/10 bg-cream/40 text-[8px] uppercase tracking-[0.11em] text-stone">
                  <th className="px-4 py-2.5 font-normal sm:px-5">Mteja</th>
                  <th className="px-3 py-2.5 font-normal">Mji</th>
                  <th className="px-3 py-2.5 text-right font-normal">Oda</th>
                  <th className="px-3 py-2.5 text-right font-normal">Maagizo</th>
                  <th className="px-3 py-2.5 text-right font-normal">Alitumia</th>
                  <th className="px-4 py-2.5 text-right font-normal sm:px-5">Mara ya mwisho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filtered.map((customer) => (
                  <tr key={customer.email} className="cursor-pointer transition-colors hover:bg-cream/40" onClick={() => setOpenEmail(customer.email)}>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand/70 font-display text-[11px] text-ink-soft">
                          {customer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-medium">{customer.name}</p>
                          <p className="truncate text-[8.5px] text-stone">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[10.5px] text-ink-soft">{customer.city}</td>
                    <td className="px-3 py-3 text-right text-[10.5px] tabular-nums">{customer.orders.length}</td>
                    <td className="px-3 py-3 text-right text-[10.5px] tabular-nums">{customer.commissions.length}</td>
                    <td className="px-3 py-3 text-right text-[10.5px] tabular-nums">{moneyTZS(customer.spent)}</td>
                    <td className="px-4 py-3 text-right text-[9.5px] text-stone sm:px-5">{timeAgo(customer.lastAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selected && (
        <Drawer
          title={selected.name}
          subtitle={`Mteja · ${selected.email}`}
          onClose={() => setOpenEmail(null)}
          footer={
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9.5px] uppercase tracking-[0.09em] text-stone">
                Alitumia {moneyTZS(selected.spent)}
              </span>
              <a href={`mailto:${selected.email}`} className="btn-outline px-3.5 py-2.5 text-[9px]">
                <Mail className="h-3.5 w-3.5" /> Wasiliana
              </a>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="border border-ink/10 bg-cream/50 p-3">
                <p className="text-[8px] uppercase tracking-[0.1em] text-stone">Oda</p>
                <p className="mt-1 font-display text-[1.2rem] leading-none">{selected.orders.length}</p>
              </div>
              <div className="border border-ink/10 bg-cream/50 p-3">
                <p className="text-[8px] uppercase tracking-[0.1em] text-stone">Maagizo</p>
                <p className="mt-1 font-display text-[1.2rem] leading-none">{selected.commissions.length}</p>
              </div>
              <div className="border border-ink/10 bg-cream/50 p-3">
                <p className="text-[8px] uppercase tracking-[0.1em] text-stone">Alitumia</p>
                <p className="mt-1 font-display text-[1.2rem] leading-none tabular-nums">{moneyTZS(selected.spent)}</p>
              </div>
            </div>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Mawasiliano</p>
              <p className="mt-1.5 text-[11px] leading-relaxed">
                {selected.email}
                {selected.phone ? <><br />{selected.phone}</> : null}
                {selected.city !== "—" ? <><br />{selected.city}</> : null}
              </p>
            </div>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Historia ya oda</p>
              {selected.orders.length === 0 ? (
                <p className="mt-2 text-[10.5px] text-stone">Hakuna oda za duka.</p>
              ) : (
                <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
                  {selected.orders.map((order) => (
                    <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[10.5px] font-medium">{order.id}</p>
                        <p className="text-[8.5px] text-stone">{formatDate(order.createdAt)} · {itemCount(order)} vipande</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10.5px] tabular-nums">{moneyTZS(order.total)}</p>
                        <Badge tone={orderStatusMeta[order.status].tone}>{orderStatusMeta[order.status].label}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Historia ya maagizo</p>
              {selected.commissions.length === 0 ? (
                <p className="mt-2 text-[10.5px] text-stone">Hakuna maagizo ya sanaa.</p>
              ) : (
                <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
                  {selected.commissions.map((commission) => (
                    <li key={commission.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[10.5px] font-medium">{commission.title}</p>
                        <p className="text-[8.5px] text-stone">{commission.artist} · {formatDate(commission.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10.5px] tabular-nums">{moneyTZS(escrowTotal(commission))}</p>
                        <Badge tone={commission.status === "mgogoro" ? "danger" : "clay"}>{statusMeta[commission.status].label}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}

/* -------------------------------- shared bits ----------------------------- */

export function CommercePageHeader({ title, text }: { title: string; text: string }) {
  return <CardHead title={title} subtitle={text} />;
}
