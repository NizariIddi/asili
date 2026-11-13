import { useEffect, useMemo, useState } from "react";
import {
  activityMeta,
  defaultSettings,
  exportCsv,
  exportJson,
  seedOrders,
  timeAgo,
  type ActivityKind,
  type AdminViewProps,
  type StoreSettings,
} from "../../admin";
import { formatDate, moneyTZS } from "../../escrow";
import {
  Alert,
  Check,
  Download,
  Lock,
  Package,
  Shield,
  Trash,
} from "../Icons";
import {
  Badge,
  Card,
  CardHead,
  Chips,
  ConfirmDialog,
  EmptyState,
  Field,
  SearchInput,
  Toggle,
} from "./AdminUI";

/* -------------------------------- settings -------------------------------- */

export function AdminSettings({ data, actions }: AdminViewProps) {
  const [form, setForm] = useState<StoreSettings>(data.settings);
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(data.settings);
  }, [data.settings]);

  const set = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
    setSaved(false);
  };

  const save = () => {
    const next: Record<string, string> = {};
    if (form.announcement.trim().length < 10) next.announcement = "Andika tangazo la angalau herufi 10.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.supportEmail.trim())) next.supportEmail = "Barua pepe sahihi inahitajika.";
    if (!Number.isFinite(form.shippingFee) || form.shippingFee < 0) next.shippingFee = "Ada sahihi inahitajika.";
    if (!Number.isFinite(form.freeShippingThreshold) || form.freeShippingThreshold < 0) next.freeShippingThreshold = "Kiwango sahihi kinahitajika.";
    if (!Number.isFinite(form.lowStockThreshold) || form.lowStockThreshold < 0) next.lowStockThreshold = "Kiwango sahihi kinahitajika.";
    if (pin && !/^\d{4,6}$/.test(pin)) next.pin = "PIN iwe tarakimu 4–6.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const nextSettings: StoreSettings = { ...form, pin: pin || form.pin };
    actions.setSettings(nextSettings);
    actions.log("mipangilio", "Mipangilio ya duka imehifadhiwa", pin ? "PIN imesasishwa" : undefined);
    actions.notify("Mipangilio imehifadhiwa");
    setPin("");
    setSaved(true);
  };

  const reset = () => {
    actions.onResetAll();
    setForm(defaultSettings);
    setConfirmReset(false);
    setSaved(false);
    actions.notify("Data yote ya majaribio imeondolewa");
  };

  const seed = () => {
    const demo = seedOrders(data.products, form);
    if (demo.length === 0) {
      actions.notify("Ongeza bidhaa kwanza ili kuunda oda za mfano", "error");
      return;
    }
    actions.setOrders(demo);
    actions.log("mfumo", `Oda ${demo.length} za mfano zimewekwa`);
    actions.notify("Oda za mfano zimewekwa");
  };

  const exportAll = () => {
    exportJson("asili-udongo-data.json", {
      imehamishwa: new Date().toISOString(),
      bidhaa: data.products,
      oda: data.orders,
      maagizo: data.commissions,
      mipangilio: { ...data.settings, pin: undefined },
      kumbukumbu: data.activity,
    });
    actions.notify("Nakala ya data imehamishwa");
  };

  const storageBytes = new Blob([
    JSON.stringify({ p: data.products, o: data.orders, c: data.commissions, a: data.activity, s: data.settings }),
  ]).size;
  const storageKb = Math.max(1, Math.round(storageBytes / 1024));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-clay">Mipangilio</p>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Mipangilio ya duka</h2>
          <p className="mt-1.5 text-[11px] text-stone">Haya hutumika moja kwa moja kwenye duka na kwenye kikapu.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.09em] text-olive">
              <Check className="h-3.5 w-3.5" /> Imehifadhiwa
            </span>
          )}
          <button type="button" onClick={save} className="btn-clay px-5 py-2.5 text-[9.5px]">
            Hifadhi mipangilio
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHead title="Duka" subtitle="Tangazo, mawasiliano na ufunguzi" />
            <div className="space-y-3.5 px-4 py-4 sm:px-5">
              <Field label="Tangazo la juu ya ukurasa" htmlFor="s-announcement" error={errors.announcement}>
                <input
                  id="s-announcement"
                  value={form.announcement}
                  onChange={(event) => set("announcement", event.target.value)}
                  className="field"
                  aria-invalid={Boolean(errors.announcement)}
                />
              </Field>
              <Field label="Barua pepe ya huduma" htmlFor="s-email" error={errors.supportEmail}>
                <input
                  id="s-email"
                  type="email"
                  value={form.supportEmail}
                  onChange={(event) => set("supportEmail", event.target.value)}
                  className="field"
                  aria-invalid={Boolean(errors.supportEmail)}
                />
              </Field>
              <Toggle
                checked={form.storeOpen}
                onChange={(next) => set("storeOpen", next)}
                label="Duka liko wazi"
                description="Kikizimwa, wateja wanaweza kuvinjari lakini hawawezi kukamilisha malipo."
              />
            </div>
          </Card>

          <Card>
            <CardHead title="Usafirishaji" subtitle="Hutumika kwenye kikapu na checkout" />
            <div className="grid gap-3.5 px-4 py-4 sm:grid-cols-2 sm:px-5">
              <Field label="Ada ya usafirishaji (TSh)" htmlFor="s-fee" error={errors.shippingFee} hint={moneyTZS(form.shippingFee || 0)}>
                <input
                  id="s-fee"
                  inputMode="numeric"
                  value={form.shippingFee ? Number(form.shippingFee).toLocaleString("en-US") : ""}
                  onChange={(event) => set("shippingFee", Number(event.target.value.replace(/[^0-9]/g, "")) || 0)}
                  className="field tabular-nums"
                  aria-invalid={Boolean(errors.shippingFee)}
                />
              </Field>
              <Field label="Kiwango cha usafirishaji bure (TSh)" htmlFor="s-threshold" error={errors.freeShippingThreshold} hint={moneyTZS(form.freeShippingThreshold || 0)}>
                <input
                  id="s-threshold"
                  inputMode="numeric"
                  value={form.freeShippingThreshold ? Number(form.freeShippingThreshold).toLocaleString("en-US") : ""}
                  onChange={(event) => set("freeShippingThreshold", Number(event.target.value.replace(/[^0-9]/g, "")) || 0)}
                  className="field tabular-nums"
                  aria-invalid={Boolean(errors.freeShippingThreshold)}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHead title="Katalogi" subtitle="Tahadhari za stoo" />
            <div className="px-4 py-4 sm:px-5">
              <Field
                label="Kiwango cha stoo ndogo"
                htmlFor="s-low"
                error={errors.lowStockThreshold}
                hint="Bidhaa zenye stoo chini au sawa na kiwango hiki zitaonyeshwa kama 'Stoo ndogo'."
              >
                <input
                  id="s-low"
                  type="number"
                  min={0}
                  value={form.lowStockThreshold}
                  onChange={(event) => set("lowStockThreshold", Number(event.target.value))}
                  className="field max-w-[140px] tabular-nums"
                  aria-invalid={Boolean(errors.lowStockThreshold)}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHead title="Usalama" subtitle="PIN ya kuingia kwenye paneli" />
            <div className="space-y-3 px-4 py-4 sm:px-5">
              <Field
                label="PIN mpya"
                htmlFor="s-pin"
                error={errors.pin}
                hint="Tarakimu 4–6. Acha wazi kama hutaki kubadilisha. PIN ya sasa ni ya majaribio."
              >
                <input
                  id="s-pin"
                  inputMode="numeric"
                  value={pin}
                  onChange={(event) => {
                    setPin(event.target.value.replace(/[^0-9]/g, "").slice(0, 6));
                    setErrors((previous) => ({ ...previous, pin: "" }));
                  }}
                  placeholder="••••"
                  className="field max-w-[160px] tracking-[0.4em] tabular-nums"
                  aria-invalid={Boolean(errors.pin)}
                />
              </Field>
              <div className="flex items-start gap-2.5 border border-ink/10 bg-cream/60 p-3">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
                <p className="text-[10px] leading-relaxed text-stone">
                  PIN hii inalinda paneli kwenye kifaa hiki pekee. Kwa matumizi halisi, tumia uthibitisho wa seva
                  (kama OTP au akaunti za wafanyakazi).
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHead title="Hifadhi ya data" subtitle="Kifaa hiki pekee" />
            <div className="space-y-3 px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between border-b border-ink/10 pb-2.5 text-[10.5px]">
                <span className="text-stone">Bidhaa</span>
                <span className="tabular-nums">{data.products.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-ink/10 pb-2.5 text-[10.5px]">
                <span className="text-stone">Oda</span>
                <span className="tabular-nums">{data.orders.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-ink/10 pb-2.5 text-[10.5px]">
                <span className="text-stone">Maagizo ya escrow</span>
                <span className="tabular-nums">{data.commissions.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-ink/10 pb-2.5 text-[10.5px]">
                <span className="text-stone">Matukio ya kumbukumbu</span>
                <span className="tabular-nums">{data.activity.length}</span>
              </div>
              <div className="flex items-center justify-between pb-1 text-[10.5px]">
                <span className="text-stone">Ukubwa wa hifadhi</span>
                <span className="tabular-nums">~{storageKb} KB</span>
              </div>
              <div className="grid gap-2 pt-1">
                <button type="button" onClick={exportAll} className="btn-outline w-full px-4 py-2.5 text-[9px]">
                  <Download className="h-3.5 w-3.5" /> Hamisha data (JSON)
                </button>
                <button type="button" onClick={seed} className="btn-outline w-full px-4 py-2.5 text-[9px]">
                  <Package className="h-3.5 w-3.5" /> Weka oda za mfano
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="Muhtasari wa mipangilio" />
            <div className="space-y-2.5 px-4 py-4 text-[10.5px] sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone">Hali ya duka</span>
                <Badge tone={form.storeOpen ? "olive" : "stone"}>{form.storeOpen ? "Wazi" : "Imefungwa"}</Badge>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone">Usafirishaji bure</span>
                <span className="text-right tabular-nums">{moneyTZS(form.freeShippingThreshold || 0)}+</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone">Ada ya usafirishaji</span>
                <span className="text-right tabular-nums">{moneyTZS(form.shippingFee || 0)}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone">Stoo ndogo</span>
                <span className="text-right tabular-nums">≤ {form.lowStockThreshold}</span>
              </div>
            </div>
          </Card>

          <Card className="border-clay/25 bg-clay/[0.03]">
            <CardHead title="Eneo la hatari" />
            <div className="px-4 py-4 sm:px-5">
              <p className="text-[10px] leading-relaxed text-ink-soft/80">
                Ondoa oda zote, maagizo, kumbukumbu na bidhaa za kifaa hiki. Katalogi ya studio itarejeshwa.
              </p>
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="mt-3 inline-flex cursor-pointer items-center gap-1.5 border border-clay-deep/30 px-3.5 py-2 text-[9px] uppercase tracking-[0.09em] text-clay-deep transition-colors hover:bg-clay-deep hover:text-paper"
              >
                <Trash className="h-3.5 w-3.5" /> Ondoa data yote
              </button>
            </div>
          </Card>

          <div className="flex items-start gap-2.5 border border-olive/20 bg-olive/[0.06] p-3.5">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
            <p className="text-[10px] leading-relaxed text-ink-soft/80">
              Mazingira ya majaribio: mabadiliko huhifadhiwa kwenye kivinjari chako. Hakuna seva au malipo halisi.
            </p>
          </div>
        </div>
      </div>

      {confirmReset && (
        <ConfirmDialog
          title="Ondoa data yote?"
          text="Oda, maagizo, kumbukumbu na mipangilio yako vitaondolewa. Katalogi ya awali ya studio itarejeshwa. Hatua hii haiwezi kurudishwa."
          confirmLabel="Ndiyo, ondoa yote"
          destructive
          onCancel={() => setConfirmReset(false)}
          onConfirm={reset}
        />
      )}
    </div>
  );
}

/* ------------------------------- activity log ----------------------------- */

const kinds: (ActivityKind | "zote")[] = ["zote", "oda", "bidhaa", "escrow", "mipangilio", "mfumo"];

export function AdminActivity({ data, actions }: AdminViewProps) {
  const [filter, setFilter] = useState<ActivityKind | "zote">("zote");
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const entries = useMemo(
    () =>
      data.activity
        .filter((entry) => filter === "zote" || entry.kind === filter)
        .filter((entry) => {
          const term = query.trim().toLowerCase();
          return !term || `${entry.message} ${entry.meta ?? ""}`.toLowerCase().includes(term);
        }),
    [data.activity, filter, query],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-clay">Ufuatiliaji</p>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Kumbukumbu ya matukio</h2>
          <p className="mt-1.5 text-[11px] text-stone">Kila hatua muhimu ya msimamizi, kwa mpangilio wa muda.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              exportCsv(
                "kumbukumbu-asili-udongo.csv",
                ["Tarehe", "Aina", "Tukio", "Maelezo"],
                entries.map((entry) => [new Date(entry.at).toISOString(), activityMeta[entry.kind].label, entry.message, entry.meta ?? ""]),
              );
              actions.notify("Kumbukumbu imehamishwa");
            }}
            className="btn-outline px-3.5 py-2.5 text-[9px]"
          >
            <Download className="h-3.5 w-3.5" /> Hamisha CSV
          </button>
          {data.activity.length > 0 && (
            <button type="button" onClick={() => setConfirmClear(true)} className="btn-outline px-3.5 py-2.5 text-[9px]">
              <Trash className="h-3.5 w-3.5" /> Safisha
            </button>
          )}
        </div>
      </div>

      <Card className="p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Tafuta tukio…" className="w-full lg:max-w-xs" />
          <Chips
            options={kinds.map((kind) => ({
              id: kind,
              label: kind === "zote" ? "Yote" : activityMeta[kind].label,
              count: kind === "zote" ? data.activity.length : data.activity.filter((entry) => entry.kind === kind).length,
            }))}
            value={filter}
            onChange={setFilter}
          />
        </div>
      </Card>

      {entries.length === 0 ? (
        <EmptyState
          icon={<Alert className="h-5 w-5" />}
          title={data.activity.length === 0 ? "Kumbukumbu ni tupu." : "Hakuna tukio linalolingana."}
          text="Matukio kama kuongeza bidhaa, kubadilisha oda au kufungua mgogoro yataandikwa hapa."
          action={
            <button type="button" onClick={() => { setFilter("zote"); setQuery(""); }} className="cursor-pointer text-[9.5px] uppercase tracking-[0.1em] text-ink-soft underline underline-offset-4 hover:text-ink">
              Futa vichujio
            </button>
          }
        />
      ) : (
        <Card>
          <ul className="divide-y divide-ink/10">
            {entries.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-start gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={activityMeta[entry.kind].tone}>{activityMeta[entry.kind].label}</Badge>
                    <p className="text-[11px] leading-snug text-ink">{entry.message}</p>
                  </div>
                  {entry.meta && <p className="mt-1 text-[9.5px] text-stone">{entry.meta}</p>}
                </div>
                <p className="shrink-0 text-[9px] uppercase tracking-[0.08em] text-stone">
                  {timeAgo(entry.at)} · {formatDate(entry.at)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {confirmClear && (
        <ConfirmDialog
          title="Safisha kumbukumbu?"
          text="Matukio yote ya kumbukumbu yataondolewa. Bidhaa na oda hazitaguswa."
          confirmLabel="Safisha"
          destructive
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            actions.setActivity([]);
            actions.notify("Kumbukumbu imesafishwa");
            setConfirmClear(false);
          }}
        />
      )}
    </div>
  );
}
