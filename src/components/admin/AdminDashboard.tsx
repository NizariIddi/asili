import { useMemo, useState } from "react";
import {
  buildAnalytics,
  orderStatusMeta,
  rangeLabel,
  stockOf,
  timeAgo,
  type AdminViewProps,
} from "../../admin";
import { escrowTotal, formatDate, moneyTZS, statusMeta } from "../../escrow";
import {
  Alert,
  ArrowRight,
  ArrowUpRight,
  Bag,
  Check,
  Clock,
  Lock,
  Mark,
  Package,
  Shield,
  Users,
  Wallet,
} from "../Icons";
import { Badge, Card, CardHead, ChannelDonut, Chips, KpiGrid, RevenueChart, RowLink, Stat } from "./AdminUI";

const ranges = ["7", "30", "90", "zote"] as const;
type Range = (typeof ranges)[number];

export default function AdminDashboard({ data, actions, navigate }: AdminViewProps) {
  const [range, setRange] = useState<Range>("7");
  const analytics = useMemo(
    () => buildAnalytics(data.orders, data.commissions, range === "zote" ? "zote" : Number(range)),
    [data.orders, data.commissions, range],
  );

  const visible = data.products.filter((product) => product.visible !== false);
  const outOfStock = visible.filter((product) => stockOf(product) <= 0);
  const lowStock = visible.filter((product) => {
    const stock = stockOf(product);
    return stock > 0 && stock <= data.settings.lowStockThreshold;
  });
  const newOrders = data.orders.filter((order) => order.status === "mpya");
  const toShip = data.orders.filter((order) => order.status === "imeandaliwa");
  const awaitingFunding = data.commissions.filter((commission) => commission.status === "inasubiri");
  const disputes = data.commissions.filter((commission) => commission.status === "mgogoro");
  const held = data.commissions
    .filter((commission) => ["imefadhiliwa", "inaendelea", "imewasilishwa", "mgogoro"].includes(commission.status))
    .reduce((sum, commission) => sum + escrowTotal(commission), 0);

  const delta =
    analytics.previousRevenue > 0
      ? Math.round(((analytics.revenue - analytics.previousRevenue) / analytics.previousRevenue) * 100)
      : analytics.revenue > 0
        ? 100
        : 0;

  const tasks = [
    { label: "Oda mpya zinazohitaji kuandaliwa", count: newOrders.length, section: "orders" as const, icon: Bag },
    { label: "Oda zilizoandaliwa, zinasubiri kusafirishwa", count: toShip.length, section: "orders" as const, icon: Package },
    { label: "Maagizo yanayohitaji ufadhili", count: awaitingFunding.length, section: "commissions" as const, icon: Clock },
    { label: "Migogoro ya escrow", count: disputes.length, section: "commissions" as const, icon: Shield },
    { label: "Bidhaa zilizoisha stoo", count: outOfStock.length, section: "products" as const, icon: Alert },
    { label: "Bidhaa zenye stoo ndogo", count: lowStock.length, section: "products" as const, icon: Alert },
  ].filter((task) => task.count > 0);

  const recentActivity = data.activity.slice(0, 6);
  const recentOrders = [...data.orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[9px] text-stone">
            {new Intl.DateTimeFormat("sw-TZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}
          </p>
          <h2 className="mt-1.5 font-display text-[1.55rem] leading-none sm:text-[1.9rem]">
            Karibu tena, Asha.
          </h2>
          <p className="mt-1.5 text-[11px] text-stone">
            Hapa kuna hali ya studio yako leo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={data.settings.storeOpen ? "olive" : "stone"}>
            {data.settings.storeOpen ? "Duka liko wazi" : "Duka limefungwa"}
          </Badge>
          <Chips
            options={ranges.map((item) => ({ id: item, label: rangeLabel[item] }))}
            value={range}
            onChange={setRange}
          />
        </div>
      </div>

      <KpiGrid>
        <Stat
          label={`Mapato · ${rangeLabel[range]}`}
          value={moneyTZS(analytics.revenue)}
          delta={delta}
          hint="ikilinganishwa na kipindi kilichopita"
          icon={<Wallet className="h-4 w-4" />}
          emphasis
        />
        <Stat
          label="Oda za duka"
          value={String(analytics.orderCount)}
          hint={`${analytics.unitsSold} vipande vimeuzwa`}
          icon={<Bag className="h-4 w-4" />}
          onClick={() => navigate("orders")}
        />
        <Stat
          label="Fedha escrow"
          value={moneyTZS(held)}
          hint="zimeshikiliwa kwa maagizo hai"
          icon={<Lock className="h-4 w-4" />}
          onClick={() => navigate("commissions")}
        />
        <Stat
          label="Wateja"
          value={String(new Set([...data.orders.map((o) => o.customer.email), ...data.commissions.map((c) => c.contactEmail)].map((e) => e.toLowerCase())).size)}
          hint={`${analytics.newCustomers} wapya katika kipindi`}
          icon={<Users className="h-4 w-4" />}
          onClick={() => navigate("customers")}
        />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHead
            title="Mapato kwa muda"
            subtitle="Oda za duka pamoja na fedha zilizowekwa escrow"
            action={
              <span className="text-[9.5px] uppercase tracking-[0.1em] text-stone">
                {analytics.orderCount} oda · {rangeLabel[range]}
              </span>
            }
          />
          <div className="px-4 pb-4 pt-5 sm:px-5">
            <RevenueChart series={analytics.series} />
          </div>
        </Card>

        <Card>
          <CardHead title="Vyanzo vya mapato" subtitle="Mgawanyo wa kipindi" />
          <div className="px-4 py-5 sm:px-5">
            <ChannelDonut
              total={analytics.shopRevenue + analytics.escrowRevenue}
              segments={[
                { label: "Duka la bidhaa", value: analytics.shopRevenue, color: "#a8502f" },
                { label: "Escrow ya sanaa", value: analytics.escrowRevenue, color: "#585d47" },
              ]}
            />
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4">
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Wastani wa oda</p>
                <p className="mt-1 font-display text-[1.15rem] tabular-nums">
                  {moneyTZS(analytics.orderCount > 0 ? Math.round(analytics.shopRevenue / analytics.orderCount) : 0)}
                </p>
              </div>
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.11em] text-stone">Escrow iliyolipwa</p>
                <p className="mt-1 font-display text-[1.15rem] tabular-nums">
                  {moneyTZS(
                    data.commissions
                      .filter((commission) => commission.status === "imekamilika")
                      .reduce((sum, commission) => sum + commission.budget, 0),
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHead
            title="Inahitaji makini"
            subtitle={tasks.length > 0 ? "Vitu vinavyosubiri uamuzi wako" : "Hakuna kinachosubiri — vizuri sana"}
            action={<RowLink label="Oda" onClick={() => navigate("orders")} />}
          />
          {tasks.length === 0 ? (
            <div className="flex items-start gap-3 px-5 py-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive text-cream">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] font-medium">Kila kitu kiko sawa.</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-stone">
                  Hakuna oda mpya, migogoro au bidhaa zilizoisha stoo kwa sasa.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {tasks.map((task) => (
                <li key={task.label}>
                  <button
                    type="button"
                    onClick={() => navigate(task.section)}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cream/60 sm:px-5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay/10 text-clay">
                      <task.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-[11px] leading-snug text-ink-soft">{task.label}</span>
                    <span className="shrink-0 font-display text-[15px] tabular-nums">{task.count}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-stone" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHead
            title="Bidhaa zinazoongoza"
            action={<RowLink label="Zote" onClick={() => navigate("products")} />}
          />
          {analytics.topProducts.length === 0 ? (
            <p className="px-5 py-8 text-center text-[10.5px] leading-relaxed text-stone">
              Hakuna mauzo bado katika kipindi hiki. Weka data ya mfano kwenye mipangilio kuona dashibodi ikifanya kazi.
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {analytics.topProducts.map((product, index) => (
                <li key={product.id} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                  <span className="w-3 shrink-0 text-[9px] tabular-nums text-stone">{index + 1}</span>
                  <div className="h-9 w-8 shrink-0 overflow-hidden rounded-[1px] bg-sand">
                    {product.image && <img src={product.image} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium">{product.name}</p>
                    <p className="mt-0.5 text-[9px] text-stone">{product.qty} vipande</p>
                  </div>
                  <p className="shrink-0 text-[10.5px] tabular-nums">{moneyTZS(product.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHead
            title="Oda za hivi karibuni"
            subtitle={`${newOrders.length} mpya · ${data.orders.length} jumla`}
            action={<RowLink label="Zote" onClick={() => navigate("orders")} />}
          />
          {recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-center text-[10.5px] text-stone">
              Hakuna oda bado. Oda za wateja zitaonekana hapa mara moja baada ya malipo.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b border-ink/10 text-[8px] uppercase tracking-[0.1em] text-stone">
                    <th className="px-4 py-2 font-normal sm:px-5">Oda</th>
                    <th className="px-3 py-2 font-normal">Mteja</th>
                    <th className="px-3 py-2 text-right font-normal">Jumla</th>
                    <th className="px-4 py-2 text-right font-normal sm:px-5">Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-[10.5px]">
                      <td className="px-4 py-2.5 sm:px-5">
                        <span className="font-medium">{order.id}</span>
                        <span className="block text-[8.5px] text-stone">{timeAgo(order.createdAt)}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="block truncate">{order.customer.name}</span>
                        <span className="block text-[8.5px] text-stone">{order.customer.city}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{moneyTZS(order.total)}</td>
                      <td className="px-4 py-2.5 text-right sm:px-5">
                        <Badge tone={orderStatusMeta[order.status].tone}>{orderStatusMeta[order.status].label}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHead
            title="Kumbukumbu"
            action={<RowLink label="Zote" onClick={() => navigate("activity")} />}
          />
          {recentActivity.length === 0 ? (
            <p className="px-5 py-8 text-center text-[10.5px] text-stone">
              Matukio ya msimamizi yataonekana hapa.
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {recentActivity.map((entry) => (
                <li key={entry.id} className="px-4 py-2.5 sm:px-5">
                  <p className="text-[10.5px] leading-snug text-ink-soft">{entry.message}</p>
                  <p className="mt-0.5 text-[8.5px] text-stone">
                    {timeAgo(entry.at)}
                    {entry.meta ? ` · ${entry.meta}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHead title="Maagizo ya sanaa" subtitle="Hali ya escrow kwa muhtasari" action={<RowLink label="Yote" onClick={() => navigate("commissions")} />} />
        {data.commissions.length === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
            <div className="flex items-center gap-3">
              <Mark className="h-4 w-4 text-clay" />
              <p className="text-[11px] text-stone">Hakuna maagizo ya sanaa bado.</p>
            </div>
            <button
              type="button"
              onClick={actions.onOpenEscrow}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-ink underline decoration-ink/25 underline-offset-4 hover:text-clay"
            >
              Fungua dashibodi ya escrow <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10">
            {data.commissions.slice(0, 3).map((commission) => (
              <li key={commission.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium">{commission.title}</p>
                  <p className="mt-0.5 text-[9px] text-stone">
                    {commission.contactName} · {commission.artist} · mwisho {formatDate(commission.deadline)}
                  </p>
                </div>
                <Badge tone={commission.status === "mgogoro" ? "danger" : commission.status === "imekamilika" ? "dark" : "clay"}>
                  {statusMeta[commission.status].label}
                </Badge>
                <p className="w-[110px] shrink-0 text-right text-[10.5px] tabular-nums">
                  {moneyTZS(escrowTotal(commission))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
