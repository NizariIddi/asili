import { useEffect, useRef, useState } from "react";
import {
  ART_SIZES,
  ART_STYLES,
  ART_TYPES,
  DISPUTE_REASONS,
  STAGES,
  artType,
  commissionUpdate,
  defaultDeadline,
  escrowFee,
  escrowTotal,
  formatDate,
  makeRef,
  moneyTZS,
  statusMeta,
  type Commission,
  type EscrowAction,
  type EscrowStatus,
} from "../escrow";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Close,
  Heart,
  Leaf,
  Lock,
  Mail,
  Mark,
  Shield,
  Trash,
} from "./Icons";
import SectionHead from "./SectionHead";

/* --------------------------------- shared --------------------------------- */

function useModal(onClose: () => void) {
  const ref = useRef(onClose);
  ref.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ref.current();
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

const toneClass: Record<EscrowStatus, string> = {
  inasubiri: "border-amber-700/25 bg-amber-500/10 text-amber-800",
  imefadhiliwa: "border-olive/30 bg-olive/10 text-olive-deep",
  inaendelea: "border-clay/30 bg-clay/10 text-clay-deep",
  imewasilishwa: "border-ink/25 bg-ink/[0.06] text-ink",
  imekamilika: "border-olive/40 bg-olive text-cream",
  mgogoro: "border-clay-deep/40 bg-clay-deep text-cream",
  imerejeshwa: "border-stone/35 bg-stone/10 text-ink-soft",
};

function StatusPill({ status }: { status: EscrowStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.12em] ${toneClass[status]}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {statusMeta[status].label}
    </span>
  );
}

function StageBar({ status }: { status: EscrowStatus }) {
  const stage = statusMeta[status].stage;

  return (
    <div>
      <div className="flex items-center gap-1">
        {STAGES.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-1">
            <span
              className={`h-1.5 w-full rounded-full ${
                i <= stage ? (status === "mgogoro" ? "bg-clay-deep" : "bg-clay") : "bg-ink/10"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between">
        {STAGES.map((label, i) => (
          <span
            key={label}
            className={`text-[8px] uppercase tracking-[0.08em] sm:text-[8.5px] ${
              i <= stage ? "text-ink" : "text-stone/70"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- section -------------------------------- */

type SectionProps = {
  activeCount: number;
  onOpenRequest: (typeId?: string) => void;
  onOpenDashboard: () => void;
};

export function EscrowSection({ activeCount, onOpenRequest, onOpenDashboard }: SectionProps) {
  return (
    <section id="escrow" className="scroll-mt-20 border-t border-ink/10 bg-paper py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          eyebrow="Escrow ya maagizo · Ada 4%"
          title={
            <>
              Agiza sanaa. <em className="italic text-clay">Fedha zinakaa salama.</em>
            </>
          }
          description="Unataka mchoro wa familia, uchoraji wa ukutani au kitu cha kuchongwa? Omba kazi maalum, weka fedha escrow, na msanii alipwe tu ukikubali kazi."
          actionLabel={activeCount > 0 ? `Dashibodi · ${activeCount} hai` : "Fungua dashibodi"}
          onAction={onOpenDashboard}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <ol className="divide-y divide-ink/10 border-y border-ink/10">
              {[
                {
                  n: "01",
                  title: "Eleza kile unachotaka",
                  text: "Aina ya sanaa, ukubwa, mtindo, bajeti na tarehe ya mwisho. Ombi hupewa msanii anayefaa kabla ya kuanza.",
                },
                {
                  n: "02",
                  title: "Weka fedha escrow",
                  text: "Fedha zako hushikiliwa na escrow, si kwa msanii. Msanii anaanza tu baada ya kuona fedha zimewekwa.",
                },
                {
                  n: "03",
                  title: "Fuatilia kazi",
                  text: "Msanii huwasilisha kazi pamoja na historia ya maendeleo. Omba marekebisho kama kitu hakiko sawa.",
                },
                {
                  n: "04",
                  title: "Kubali, kisha toa",
                  text: "Fedha zinamfikia msanii tu unapobonyeza kubali. Mgogoro? Fedha zinabaki zimeshikiliwa hadi utatuzi.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4 py-5 first:pt-0 sm:gap-6">
                  <span className="font-display text-[1.6rem] leading-none text-clay/45">{step.n}</span>
                  <div>
                    <h3 className="text-[12px] font-medium uppercase tracking-[0.1em]">{step.title}</h3>
                    <p className="mt-1.5 max-w-md text-[12px] leading-relaxed text-ink-soft/75">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => onOpenRequest()} className="btn-clay group">
                Anza ombi la sanaa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-[10.5px] leading-relaxed text-stone">
                Kuanzia TSh 120,000 · muda wa kawaida siku 21
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative border border-ink/12 bg-cream p-5 shadow-soft sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-olive/10 text-olive">
                    <Shield className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="eyebrow text-[8.5px] text-stone">Mfano wa escrow</p>
                    <p className="mt-0.5 text-[11px] font-medium tracking-[0.08em]">AU-ESC-482103</p>
                  </div>
                </div>
                <StatusPill status="inaendelea" />
              </div>

              <div className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-[1.4rem] leading-tight">Mchoro wa familia</p>
                    <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em] text-stone">
                      Salma Juma · Mchoro wa mkono
                    </p>
                  </div>
                  <span className="rounded-full bg-sand/70 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.1em] text-ink-soft">
                    Siku 18
                  </span>
                </div>

                <dl className="mt-5 space-y-2 border-t border-dashed border-ink/15 pt-4 text-[12px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-soft">Bajeti ya msanii</dt>
                    <dd className="tabular-nums">{moneyTZS(250000)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-soft">Ada ya escrow · 4%</dt>
                    <dd className="tabular-nums">{moneyTZS(10000)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-ink/10 pt-2.5 text-[14px] font-medium">
                    <dt>Iliyowekwa escrow</dt>
                    <dd className="tabular-nums">{moneyTZS(260000)}</dd>
                  </div>
                </dl>
              </div>

              <StageBar status="inaendelea" />

              <div className="mt-5 flex items-start gap-2.5 border-t border-ink/10 pt-4">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
                <p className="text-[10.5px] leading-relaxed text-ink-soft/80">
                  Fedha zinatolewa kwa msanii pale tu unapobonyeza <span className="text-ink">Kubali na toa fedha</span>.
                  Hadi hapo, ziko chini ya ulinzi wa escrow.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9.5px] uppercase tracking-[0.12em] text-stone">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-olive" /> Fedha zimeshikiliwa
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-olive" /> Siku 30 za kutafuta suluhu
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5 text-olive" /> Ada 4% pekee
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/10 pt-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="eyebrow text-clay">Chagua aina ya sanaa</p>
            <p className="text-[10.5px] text-stone">Msanii anayefaa hupewa ombi lako mara moja</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-6">
            {ART_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => onOpenRequest(type.id)}
                className="group bg-paper p-4 text-left transition-colors duration-300 hover:bg-cream sm:p-5"
              >
                <span className="flex items-center justify-between">
                  <Mark className="h-3.5 w-3.5 text-clay/70" />
                  <ArrowUpRight className="h-3.5 w-3.5 text-stone/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay" />
                </span>
                <p className="mt-4 text-[12px] font-medium leading-tight">{type.label}</p>
                <p className="mt-1 text-[10px] leading-snug text-stone">{type.artist}</p>
                <p className="mt-2.5 text-[10px] tabular-nums text-ink-soft">Kuanzia {moneyTZS(type.from)}</p>
              </button>
            ))}
          </div>
          <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-stone">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Mazingira ya majaribio: hakuna pesa halisi inayotumwa. Maombi na escrow hihifadhiwa kwenye kifaa chako pekee.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- wizard --------------------------------- */

type WizardProps = {
  initialType?: string;
  onClose: () => void;
  onSubmit: (commission: Commission, funded: boolean) => void;
};

const stepLabels = ["Aina ya sanaa", "Maelezo", "Escrow"];

export function RequestWizard({ initialType, onClose, onSubmit }: WizardProps) {
  useModal(onClose);
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [typeId, setTypeId] = useState(initialType ?? "");
  const [form, setForm] = useState({
    title: "",
    brief: "",
    size: ART_SIZES[0],
    style: ART_STYLES[0],
    deadline: defaultDeadline(),
    budget: 250000,
    name: "",
    email: "",
    phone: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const type = typeId ? artType(typeId) : null;
  const budget = Number(form.budget) || 0;
  const fee = escrowFee(budget);
  const total = budget + fee;

  const set = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateDetails = () => {
    const next: Record<string, string> = {};
    if (form.title.trim().length < 3) next.title = "Weka jina fupi la kazi.";
    if (form.brief.trim().length < 20) next.brief = "Eleza kazi kwa angalau herufi 20.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = "Weka barua pepe sahihi.";
    if (form.name.trim().length < 2) next.name = "Weka jina lako.";
    if (!form.deadline || new Date(form.deadline).getTime() < Date.now()) next.deadline = "Chagua tarehe iliyobaki.";
    if (budget < 50000) next.budget = "Bajeti ya chini ni TSh 50,000.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildCommission = (funded: boolean): Commission => {
    const chosen = type ?? ART_TYPES[0];
    const now = Date.now();
    const commission: Commission = {
      id: makeRef(),
      typeId: chosen.id,
      typeLabel: chosen.label,
      title: form.title.trim(),
      brief: form.brief.trim(),
      size: form.size,
      style: form.style,
      deadline: form.deadline,
      budget,
      fee,
      artist: chosen.artist,
      status: funded ? "inaendelea" : "inasubiri",
      createdAt: now,
      contactName: form.name.trim(),
      contactEmail: form.email.trim(),
      phone: form.phone.trim(),
      updates: [commissionUpdate("Ombi la sanaa limewasilishwa", `${form.size} · ${form.style}`)],
    };
    if (funded) {
      commission.fundedAt = now;
      commission.updates.push(commissionUpdate("Fedha zimewekwa escrow", moneyTZS(total)));
      commission.updates.push(commissionUpdate(`${chosen.artist} amekubali kazi`));
    }
    return commission;
  };

  const submit = () => {
    if (!validateDetails()) {
      setStep(1);
      return;
    }
    const next: Record<string, string> = {};
    if (!terms) next.terms = "Tafadhali kubali masharti ya escrow.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(buildCommission(true), true);
  };

  const saveDraft = () => {
    if (!validateDetails()) {
      setStep(1);
      return;
    }
    onSubmit(buildCommission(false), false);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Ombi la sanaa">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative mx-auto my-0 w-full max-w-3xl animate-soft-in bg-paper shadow-2xl sm:my-6 sm:w-[calc(100%-3rem)] lg:my-10">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-8 sm:py-5">
          <div>
            <p className="eyebrow text-[9px] text-stone">Escrow ya maagizo · Asili &amp; Udongo</p>
            <h2 className="mt-1 font-display text-[1.5rem] leading-none sm:text-[1.8rem]">Agiza sanaa yako</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Funga ombi" className="icon-btn -mr-2">
            <Close className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-ink/10 px-5 py-4 sm:px-8">
          <ol className="flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium ${
                    i < step
                      ? "border-olive bg-olive text-cream"
                      : i === step
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/20 text-stone"
                  }`}
                >
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={`hidden text-[9.5px] uppercase tracking-[0.1em] sm:inline ${i === step ? "text-ink" : "text-stone"}`}>
                  {label}
                </span>
                {i < stepLabels.length - 1 && <span className="h-px flex-1 bg-ink/12" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 py-6 sm:px-8">
          {step === 0 && (
            <div className="animate-fade-in">
              <p className="text-[12.5px] text-ink-soft">Ni aina gani ya sanaa unayoifikiria?</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {ART_TYPES.map((option) => {
                  const selected = typeId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setTypeId(option.id);
                        setErrors({});
                      }}
                      aria-pressed={selected}
                      className={`flex items-start justify-between gap-3 border p-4 text-left transition-all duration-300 ${
                        selected
                          ? "border-clay bg-clay/[0.04] shadow-[inset_0_0_0_1px_rgba(168,80,47,0.35)]"
                          : "border-ink/15 hover:border-ink/40"
                      }`}
                    >
                      <span>
                        <span className="block font-display text-[1.15rem] leading-tight">{option.label}</span>
                        <span className="mt-1 block text-[10.5px] leading-snug text-stone">{option.short}</span>
                        <span className="mt-2 block text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                          {option.artist}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[10.5px] tabular-nums text-ink-soft">{moneyTZS(option.from)}</span>
                        <span
                          className={`mt-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? "border-clay bg-clay text-paper" : "border-ink/25 text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.type && <p className="mt-3 text-[10.5px] text-clay">{errors.type}</p>}
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              {type && (
                <div className="flex items-center justify-between gap-3 border border-ink/10 bg-cream/60 px-3.5 py-2.5">
                  <p className="text-[11px] text-ink-soft">
                    <span className="text-ink">{type.label}</span> · {type.artist}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="cursor-pointer text-[9.5px] uppercase tracking-[0.1em] text-clay underline underline-offset-4"
                  >
                    Badilisha
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="esc-title" className="eyebrow mb-1.5 block text-[9px] text-stone">
                  Jina la kazi
                </label>
                <input
                  id="esc-title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Mfano: Mchoro wa familia yangu"
                  className="field"
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title && <p className="mt-1 text-[10px] text-clay">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="esc-brief" className="eyebrow mb-1.5 block text-[9px] text-stone">
                  Maelezo ya kazi
                </label>
                <textarea
                  id="esc-brief"
                  value={form.brief}
                  onChange={(e) => set("brief", e.target.value)}
                  rows={4}
                  placeholder="Eleza kile unachotaka: watu, mandhari, rangi, hisia, au kumbukumbu unayotaka kuhifadhi. Andika kwa uhuru — msanii atakusoma."
                  className="field resize-y leading-relaxed"
                  aria-invalid={Boolean(errors.brief)}
                />
                <div className="mt-1 flex justify-between">
                  {errors.brief ? <p className="text-[10px] text-clay">{errors.brief}</p> : <span />}
                  <span className="text-[9.5px] tabular-nums text-stone">{form.brief.length} herufi</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="esc-size" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Ukubwa
                  </label>
                  <select id="esc-size" value={form.size} onChange={(e) => set("size", e.target.value)} className="field cursor-pointer">
                    {ART_SIZES.map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="esc-style" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Mtindo
                  </label>
                  <select id="esc-style" value={form.style} onChange={(e) => set("style", e.target.value)} className="field cursor-pointer">
                    {ART_STYLES.map((style) => (
                      <option key={style}>{style}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="esc-deadline" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Tarehe ya mwisho
                  </label>
                  <input
                    id="esc-deadline"
                    type="date"
                    value={form.deadline}
                    min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                    onChange={(e) => set("deadline", e.target.value)}
                    className="field"
                    aria-invalid={Boolean(errors.deadline)}
                  />
                  {errors.deadline && <p className="mt-1 text-[10px] text-clay">{errors.deadline}</p>}
                </div>
                <div>
                  <label htmlFor="esc-budget" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Bajeti (TSh)
                  </label>
                  <input
                    id="esc-budget"
                    type="number"
                    inputMode="numeric"
                    min={50000}
                    step={5000}
                    value={form.budget}
                    onChange={(e) => set("budget", Number(e.target.value))}
                    className="field tabular-nums"
                    aria-invalid={Boolean(errors.budget)}
                  />
                  {errors.budget ? (
                    <p className="mt-1 text-[10px] text-clay">{errors.budget}</p>
                  ) : (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {[120000, 250000, 500000, 900000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => set("budget", preset)}
                          className="cursor-pointer rounded-full border border-ink/15 px-2.5 py-1 text-[9px] tabular-nums text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
                        >
                          {moneyTZS(preset)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 border-t border-ink/10 pt-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="esc-name" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Jina lako
                  </label>
                  <input
                    id="esc-name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Asha Mwinyi"
                    className="field"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-[10px] text-clay">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="esc-email" className="eyebrow mb-1.5 block text-[9px] text-stone">
                    Barua pepe
                  </label>
                  <input
                    id="esc-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="wewe@mfano.com"
                    className="field"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="mt-1 text-[10px] text-clay">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="esc-phone" className="eyebrow mb-1.5 block text-[9px] text-stone">
                  Simu (si lazima)
                </label>
                <input
                  id="esc-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+255 7xx xxx xxx"
                  className="field"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-[1.5rem] leading-tight">{form.title || "Kazi maalum"}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-stone">
                    {type?.label} · {type?.artist}
                  </p>
                </div>
                <span className="rounded-full border border-ink/15 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.1em] text-ink-soft">
                  {form.size}
                </span>
              </div>

              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10 text-[12px]">
                {[
                  { label: "Mtindo", value: form.style },
                  { label: "Tarehe ya mwisho", value: formatDate(form.deadline) },
                  { label: "Mawasiliano", value: `${form.name || "—"} · ${form.email || "—"}` },
                  { label: "Bajeti ya msanii", value: moneyTZS(budget), strong: true },
                  { label: "Ada ya escrow · 4%", value: moneyTZS(fee) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-soft">{row.label}</dt>
                    <dd className={`text-right ${row.strong ? "font-medium tabular-nums" : ""}`}>{row.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 py-3.5 text-[15px] font-medium">
                  <dt>Jumla ya escrow</dt>
                  <dd className="tabular-nums">{moneyTZS(total)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-start gap-2.5 border border-olive/20 bg-olive/[0.05] p-3.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                <p className="text-[10.5px] leading-relaxed text-ink-soft/85">
                  Fedha hizi hushikiliwa na escrow na hazimfikii msanii hadi ukubali kazi. Ukikataa, tunaanza
                  mazungumzo ya marekebisho au kurudisha fedha zote — pamoja na ada.
                </p>
              </div>

              <label htmlFor="esc-terms" className="mt-4 flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-ink-soft">
                <input
                  id="esc-terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => {
                    setTerms(e.target.checked);
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#a8502f]"
                  aria-invalid={Boolean(errors.terms)}
                />
                <span>
                  Nakubali masharti ya escrow na kuelewa kuwa huu ni mfumo wa majaribio — hakuna pesa halisi
                  inayotumwa.
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-[10px] text-clay">{errors.terms}</p>}

              <button
                type="button"
                onClick={saveDraft}
                className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-stone underline underline-offset-4 transition-colors hover:text-ink"
              >
                Hifadhi ombi bila malipo — lipa baadaye
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-5 py-4 sm:px-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.11em] text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Rudi
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.11em] text-stone transition-colors hover:text-ink"
            >
              <Close className="h-3.5 w-3.5" /> Funga
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {step === 0 && (
              <button
                type="button"
                onClick={() => {
                  if (!typeId) {
                    setErrors({ type: "Chagua aina ya sanaa kuendelea." });
                    return;
                  }
                  setStep(1);
                }}
                className="btn-clay"
              >
                Endelea
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {step === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (validateDetails()) setStep(2);
                }}
                className="btn-clay"
              >
                Kagua escrow
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {step === 2 && (
              <button type="button" onClick={submit} className="btn-clay">
                Weka {moneyTZS(total)} escrow
                <Lock className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- dashboard ------------------------------- */

type ConfirmState = {
  id: string;
  action: EscrowAction;
  title: string;
  body: string;
  label: string;
  destructive?: boolean;
  reason?: boolean;
  note?: boolean;
} | null;

type DashboardProps = {
  commissions: Commission[];
  onClose: () => void;
  onAction: (id: string, action: EscrowAction, note?: string) => void;
  onOpenRequest: (typeId?: string) => void;
  onSeedDemo: () => void;
};

const filters: { id: "zote" | "hai" | "kamilika" | "mgogoro"; label: string }[] = [
  { id: "zote", label: "Zote" },
  { id: "hai", label: "Zinaendelea" },
  { id: "kamilika", label: "Zimekamilika" },
  { id: "mgogoro", label: "Migogoro" },
];

export function EscrowDashboard({ commissions, onClose, onAction, onOpenRequest, onSeedDemo }: DashboardProps) {
  useModal(onClose);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("zote");
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [note, setNote] = useState("");
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);

  const held = commissions
    .filter((c) => ["imefadhiliwa", "inaendelea", "imewasilishwa", "mgogoro"].includes(c.status))
    .reduce((sum, c) => sum + escrowTotal(c), 0);
  const released = commissions
    .filter((c) => c.status === "imekamilika")
    .reduce((sum, c) => sum + c.budget, 0);
  const awaiting = commissions
    .filter((c) => c.status === "inasubiri")
    .reduce((sum, c) => sum + escrowTotal(c), 0);
  const active = commissions.filter((c) =>
    ["imefadhiliwa", "inaendelea", "imewasilishwa", "inasubiri"].includes(c.status),
  ).length;

  const visible = commissions.filter((c) => {
    if (filter === "hai") return ["inasubiri", "imefadhiliwa", "inaendelea", "imewasilishwa"].includes(c.status);
    if (filter === "kamilika") return c.status === "imekamilika" || c.status === "imerejeshwa";
    if (filter === "mgogoro") return c.status === "mgogoro";
    return true;
  });

  const ask = (state: ConfirmState) => {
    setConfirm(state);
    setNote("");
    setReason(DISPUTE_REASONS[0]);
  };

  const runConfirm = () => {
    if (!confirm) return;
    const extra = [confirm.reason ? reason : "", confirm.note ? note.trim() : ""].filter(Boolean).join(" — ");
    onAction(confirm.id, confirm.action, extra || undefined);
    setConfirm(null);
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Escrow na maagizo">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative mx-auto my-0 flex min-h-full w-full max-w-6xl animate-soft-in flex-col bg-cream shadow-2xl sm:my-6 sm:min-h-0 sm:w-[calc(100%-2rem)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/10 bg-cream/95 px-5 py-4 backdrop-blur-sm sm:px-8">
          <div>
            <p className="eyebrow text-[9px] text-stone">Asili &amp; Udongo</p>
            <h2 className="mt-1 font-display text-[1.6rem] leading-none sm:text-[2rem]">Escrow na maagizo</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onOpenRequest()} className="btn-clay hidden px-5 py-3 sm:inline-flex">
              Ombi jipya
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onClose} aria-label="Funga dashibodi" className="icon-btn -mr-2">
              <Close className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start gap-2.5 border border-olive/20 bg-olive/[0.06] p-3.5">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
            <p className="text-[10.5px] leading-relaxed text-ink-soft/85">
              <span className="font-medium text-ink">Mazingira ya majaribio.</span> Hakuna pesa halisi inayotumwa na
              hakuna msanii anayepokea malipo. Maagizo yote hihifadhiwa kwenye kifaa chako pekee — unaweza
              kufuta kumbukumbu yoyote.
            </p>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
            {[
              { label: "Zimeshikiliwa escrow", value: held, note: `${active} maagizo hai`, icon: Lock },
              { label: "Zimetolewa kwa wasanii", value: released, note: "Baada ya kukubali", icon: Check },
              { label: "Yanahitaji ufadhili", value: awaiting, note: "Maombi yaliyohifadhiwa", icon: Clock },
            ].map((card) => (
              <div key={card.label} className="border border-ink/10 bg-paper p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9px] uppercase leading-snug tracking-[0.12em] text-stone">{card.label}</p>
                  <card.icon className="h-4 w-4 shrink-0 text-clay" />
                </div>
                <p className="mt-2.5 font-display text-[1.45rem] tabular-nums leading-none text-ink sm:text-[1.7rem]">
                  {moneyTZS(card.value)}
                </p>
                <p className="mt-1.5 text-[9.5px] text-stone">{card.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
              {filters.map((item) => {
                const count =
                  item.id === "zote"
                    ? commissions.length
                    : item.id === "hai"
                      ? commissions.filter((c) => ["inasubiri", "imefadhiliwa", "inaendelea", "imewasilishwa"].includes(c.status)).length
                      : item.id === "kamilika"
                        ? commissions.filter((c) => ["imekamilika", "imerejeshwa"].includes(c.status)).length
                        : commissions.filter((c) => c.status === "mgogoro").length;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    aria-pressed={filter === item.id}
                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                      filter === item.id
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span className={`tabular-nums ${filter === item.id ? "text-cream/55" : "text-stone"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => onOpenRequest()} className="btn-outline w-full px-4 py-2.5 text-[9.5px] sm:hidden">
              Ombi jipya
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {visible.length === 0 ? (
            <div className="mt-6 border border-dashed border-ink/20 px-5 py-12 text-center sm:px-10 sm:py-16">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ink/15 text-ink/60">
                <Shield className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-[1.6rem] leading-tight">
                {commissions.length === 0 ? "Hakuna ombi la sanaa bado." : "Hakuna kitu kwenye kichujio hiki."}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed text-stone">
                {commissions.length === 0
                  ? "Anza kwa kueleza kazi unayoifikiria. Tutaipatia msanii anayefaa, na fedha zako zitakaa escrow hadi ukubali kazi."
                  : "Badilisha kichujio kuona maagizo mengine."}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => onOpenRequest()} className="btn-clay">
                  Agiza sanaa
                  <ArrowRight className="h-4 w-4" />
                </button>
                {commissions.length === 0 && (
                  <button
                    type="button"
                    onClick={onSeedDemo}
                    className="cursor-pointer text-[10px] uppercase tracking-[0.11em] text-ink-soft underline underline-offset-4 hover:text-ink"
                  >
                    Ongeza mfano wa kuona
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {visible.map((commission) => (
                <article key={commission.id} className="border border-ink/10 bg-paper p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] bg-sand/70 text-clay">
                        <Mark className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-stone">
                          {commission.id} · {commission.typeLabel}
                        </p>
                        <h3 className="mt-1 font-display text-[1.3rem] leading-tight">{commission.title}</h3>
                        <p className="mt-1 text-[10.5px] text-ink-soft">
                          {commission.artist} · mwisho {formatDate(commission.deadline)}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={commission.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-y border-ink/10 py-3.5">
                    <div>
                      <p className="text-[8.5px] uppercase tracking-[0.12em] text-stone">Bajeti</p>
                      <p className="mt-1 text-[12px] tabular-nums">{moneyTZS(commission.budget)}</p>
                    </div>
                    <div>
                      <p className="text-[8.5px] uppercase tracking-[0.12em] text-stone">Ada 4%</p>
                      <p className="mt-1 text-[12px] tabular-nums">{moneyTZS(commission.fee)}</p>
                    </div>
                    <div>
                      <p className="text-[8.5px] uppercase tracking-[0.12em] text-stone">
                        {commission.status === "imekamilika" ? "Ililipwa" : "Escrow"}
                      </p>
                      <p className="mt-1 text-[12px] font-medium tabular-nums">{moneyTZS(escrowTotal(commission))}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <StageBar status={commission.status} />
                  </div>

                  <p className="mt-3 text-[10.5px] leading-relaxed text-stone">{statusMeta[commission.status].note}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {commission.status === "inasubiri" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "fund",
                              title: "Weka fedha escrow",
                              body: `Fedha ${moneyTZS(escrowTotal(commission))} zitashikiliwa. Msanii ataanza kazi mara moja na atalipwa tu ukikubali.`,
                              label: "Weka escrow",
                            })
                          }
                          className="btn-clay px-5 py-2.5 text-[9.5px]"
                        >
                          Weka escrow · {moneyTZS(escrowTotal(commission))}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "delete",
                              title: "Futa ombi",
                              body: "Ombi hili litafutwa kabisa. Hakuna fedha zilizowekwa.",
                              label: "Futa ombi",
                              destructive: true,
                            })
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 px-2 py-2 text-[9.5px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-clay"
                        >
                          <Trash className="h-3.5 w-3.5" /> Futa
                        </button>
                      </>
                    )}

                    {commission.status === "inaendelea" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "deliver",
                              title: "Kazi imewasilishwa",
                              body: "Kwenye mfumo halisi, msanii huwasilisha kazi yenyewe. Hapa unaweza kuiga hatua hiyo ili kuona jinsi escrow inavyofanya kazi.",
                              label: "Iga uwasilishaji",
                            })
                          }
                          className="btn-clay px-5 py-2.5 text-[9.5px]"
                        >
                          Iga kazi imewasilishwa
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "dispute",
                              title: "Fungua mgogoro",
                              body: "Fedha zitabaki zimeshikiliwa wakati timu yetu inatafuta suluhu na msanii.",
                              label: "Fungua mgogoro",
                              reason: true,
                              destructive: true,
                            })
                          }
                          className="btn-outline px-4 py-2.5 text-[9.5px]"
                        >
                          Fungua mgogoro
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "refund",
                              title: "Ghairi na rejesha fedha",
                              body: `Fedha zote ${moneyTZS(escrowTotal(commission))} zitarudishwa kwako, ikiwa ni pamoja na ada ya escrow.`,
                              label: "Rejesha fedha",
                              destructive: true,
                              note: true,
                            })
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 px-2 py-2 text-[9.5px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-clay"
                        >
                          Ghairi
                        </button>
                      </>
                    )}

                    {commission.status === "imewasilishwa" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "release",
                              title: "Kubali na toa fedha",
                              body: `${moneyTZS(commission.budget)} zitatolewa kwa ${commission.artist}. Ada ya escrow ${moneyTZS(commission.fee)} inabaki kama ada ya huduma. Hatua hii haiwezi kurudishwa.`,
                              label: `Toa ${moneyTZS(commission.budget)}`,
                            })
                          }
                          className="btn-clay px-5 py-2.5 text-[9.5px]"
                        >
                          Kubali na toa fedha
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "revision",
                              title: "Omba marekebisho",
                              body: "Fedha zinabaki escrow. Msanii atafanya marekebisho na kuwasilisha tena.",
                              label: "Tuma ombi",
                              note: true,
                            })
                          }
                          className="btn-outline px-4 py-2.5 text-[9.5px]"
                        >
                          Omba marekebisho
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "dispute",
                              title: "Fungua mgogoro",
                              body: "Fedha zitabaki zimeshikiliwa wakati timu yetu inatafuta suluhu na msanii.",
                              label: "Fungua mgogoro",
                              reason: true,
                              destructive: true,
                            })
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 px-2 py-2 text-[9.5px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-clay"
                        >
                          Mgogoro
                        </button>
                      </>
                    )}

                    {commission.status === "mgogoro" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "resolve",
                              title: "Suluhisha mgogoro",
                              body: "Kazi itarudi kwenye hatua ya uwasilishaji ili uikague tena kwa utulivu.",
                              label: "Suluhisha",
                            })
                          }
                          className="btn-clay px-5 py-2.5 text-[9.5px]"
                        >
                          Suluhisha
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "refund",
                              title: "Rejesha fedha",
                              body: `Fedha zote ${moneyTZS(escrowTotal(commission))} zitarudishwa kwako.`,
                              label: "Rejesha fedha",
                              destructive: true,
                              note: true,
                            })
                          }
                          className="btn-outline px-4 py-2.5 text-[9.5px]"
                        >
                          Rejesha fedha
                        </button>
                      </>
                    )}

                    {["imekamilika", "imerejeshwa"].includes(commission.status) && (
                      <>
                        <button type="button" onClick={() => onOpenRequest(commission.typeId)} className="btn-outline px-4 py-2.5 text-[9.5px]">
                          Agiza tena
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            ask({
                              id: commission.id,
                              action: "delete",
                              title: "Futa kumbukumbu",
                              body: "Kumbukumbu ya agizo hili itaondolewa kwenye kifaa chako.",
                              label: "Futa",
                              destructive: true,
                            })
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 px-2 py-2 text-[9.5px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-clay"
                        >
                          <Trash className="h-3.5 w-3.5" /> Futa
                        </button>
                      </>
                    )}
                  </div>

                  <details className="group mt-3 border-t border-ink/10 pt-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[9.5px] uppercase tracking-[0.12em] text-stone transition-colors hover:text-ink">
                      Maelezo &amp; historia
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                      </span>
                    </summary>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[10.5px] leading-relaxed text-ink-soft/85">{commission.brief}</p>
                        <dl className="mt-3 space-y-1.5 text-[10.5px]">
                          {[
                            ["Ukubwa", commission.size],
                            ["Mtindo", commission.style],
                            ["Mawasiliano", commission.contactEmail],
                            ["Iliundwa", formatDate(commission.createdAt)],
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-3">
                              <dt className="text-stone">{label}</dt>
                              <dd className="text-right text-ink">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.12em] text-stone">Historia ya escrow</p>
                        <ol className="mt-2.5 space-y-2.5">
                          {[...commission.updates].reverse().map((update) => (
                            <li key={update.id} className="flex gap-2.5">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay/60" />
                              <div>
                                <p className="text-[10.5px] leading-snug text-ink">{update.label}</p>
                                <p className="text-[9px] text-stone">
                                  {formatDate(update.at)}
                                  {update.note ? ` · ${update.note}` : ""}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-stone">
              <Heart className="h-3.5 w-3.5 text-clay" /> Maagizo ya moja kwa moja kutoka studio
            </p>
            <a
              href="mailto:studio@asiliudongo.co.tz"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-ink underline decoration-ink/25 underline-offset-4 hover:text-clay"
            >
              <Mail className="h-3.5 w-3.5" /> studio@asiliudongo.co.tz
            </a>
          </div>
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label={confirm.title}>
          <div className="absolute inset-0 animate-fade-in bg-ink/55 backdrop-blur-sm" onClick={() => setConfirm(null)} aria-hidden="true" />
          <div className="relative w-full max-w-md animate-soft-in border border-ink/10 bg-paper p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${confirm.destructive ? "bg-clay-deep/10 text-clay-deep" : "bg-olive/10 text-olive"}`}>
                  <Shield className="h-4 w-4" />
                </span>
                <h3 className="font-display text-[1.3rem] leading-tight">{confirm.title}</h3>
              </div>
              <button type="button" onClick={() => setConfirm(null)} aria-label="Funga" className="icon-btn -mr-2 h-8 w-8">
                <Close className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-ink-soft/85">{confirm.body}</p>

            {confirm.reason && (
              <div className="mt-4">
                <label htmlFor="confirm-reason" className="eyebrow mb-1.5 block text-[9px] text-stone">
                  Sababu
                </label>
                <select id="confirm-reason" value={reason} onChange={(e) => setReason(e.target.value)} className="field cursor-pointer">
                  {DISPUTE_REASONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            {confirm.note && (
              <div className="mt-4">
                <label htmlFor="confirm-note" className="eyebrow mb-1.5 block text-[9px] text-stone">
                  Maelezo (si lazima)
                </label>
                <textarea
                  id="confirm-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Andika kwa ufupi unachohitaji…"
                  className="field resize-y text-[12px]"
                />
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 border border-ink/10 bg-cream/70 p-3">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
              <p className="text-[10px] leading-relaxed text-stone">
                Mazingira ya majaribio — hatua hii haihamishi pesa halisi.
              </p>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button type="button" onClick={() => setConfirm(null)} className="btn-outline flex-1 px-4 py-3 text-[9.5px]">
                Ghairi
              </button>
              <button
                type="button"
                onClick={runConfirm}
                className={`btn flex-1 px-4 py-3 text-[9.5px] ${confirm.destructive ? "bg-clay-deep text-paper hover:bg-ink" : "bg-clay text-paper hover:bg-clay-deep"}`}
              >
                {confirm.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


