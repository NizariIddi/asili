export type ArtType = {
  id: string;
  label: string;
  short: string;
  artist: string;
  from: number;
};

export const ART_TYPES: ArtType[] = [
  {
    id: "mchoro",
    label: "Mchoro wa mkono",
    short: "Penseli, wino au makaa kwenye karatasi",
    artist: "Salma Juma",
    from: 120000,
  },
  {
    id: "uchoraji",
    label: "Uchoraji",
    short: "Mafuta au akriliki kwenye turubai",
    artist: "Emmanuel Kipara",
    from: 350000,
  },
  {
    id: "uchongaji",
    label: "Uchongaji",
    short: "Mti, jiwe au chuma kilichochongwa",
    artist: "Halima Bakari",
    from: 450000,
  },
  {
    id: "ufinyanzi",
    label: "Sanaa ya udongo",
    short: "Vyungu vya sanaa na sanamu za mkono",
    artist: "Neema Mwaikambo",
    from: 180000,
  },
  {
    id: "nguo",
    label: "Sanaa ya kitambaa",
    short: "Kanga, batiki na mapambo ya ukutani",
    artist: "Zawadi Kimaro",
    from: 150000,
  },
  {
    id: "kidijitali",
    label: "Sanaa ya kidijitali",
    short: "Mchoro wa kidijitali uliochapishwa",
    artist: "Mwanaisha Said",
    from: 200000,
  },
];

export const ESCROW_FEE_RATE = 0.04;

export const escrowFee = (budget: number) =>
  Math.max(5000, Math.round((budget * ESCROW_FEE_RATE) / 500) * 500);

export const escrowTotal = (commission: Commission) => commission.budget + commission.fee;

export type EscrowStatus =
  | "inasubiri"
  | "imefadhiliwa"
  | "inaendelea"
  | "imewasilishwa"
  | "imekamilika"
  | "mgogoro"
  | "imerejeshwa";

export type CommissionUpdate = {
  id: string;
  label: string;
  at: number;
  note?: string;
};

export type Commission = {
  id: string;
  typeId: string;
  typeLabel: string;
  title: string;
  brief: string;
  size: string;
  style: string;
  deadline: string;
  budget: number;
  fee: number;
  artist: string;
  status: EscrowStatus;
  createdAt: number;
  fundedAt?: number;
  deliveredAt?: number;
  closedAt?: number;
  contactName: string;
  contactEmail: string;
  phone?: string;
  updates: CommissionUpdate[];
};

export type EscrowAction =
  | "fund"
  | "deliver"
  | "release"
  | "revision"
  | "dispute"
  | "resolve"
  | "refund"
  | "delete";

export const STAGES = ["Ombi", "Escrow", "Uundaji", "Uwasilishaji", "Utoaji"];

export const statusMeta: Record<EscrowStatus, { label: string; stage: number; note: string }> = {
  inasubiri: {
    label: "Inasubiri ufadhili",
    stage: 0,
    note: "Ombi limehifadhiwa. Weka fedha escrow ili msanii aanze.",
  },
  imefadhiliwa: {
    label: "Fedha zimewekwa",
    stage: 1,
    note: "Fedha ziko salama. Msanii anakubali kazi.",
  },
  inaendelea: {
    label: "Kazi inaendelea",
    stage: 2,
    note: "Msanii anafanya kazi. Fedha zinashikiliwa na escrow.",
  },
  imewasilishwa: {
    label: "Kazi imewasilishwa",
    stage: 3,
    note: "Iangalie kazi. Fedha zinatolewa tu ukikubali.",
  },
  imekamilika: {
    label: "Imekamilika",
    stage: 4,
    note: "Umekubali kazi na msanii amelipwa.",
  },
  mgogoro: {
    label: "Mgogoro",
    stage: 3,
    note: "Fedha bado zimeshikiliwa. Timu yetu itasaidia kutatua.",
  },
  imerejeshwa: {
    label: "Fedha zimerejeshwa",
    stage: 0,
    note: "Kazi imefungwa na fedha zote zimerudishwa kwako.",
  },
};

export const ART_STYLES = ["Asili", "Kisasa", "Kijadi cha Tanzania", "Uchoraji wa mstari", "Nakala halisi"];

export const ART_SIZES = [
  "A3 · 29.7 × 42 sm",
  "A2 · 42 × 59.4 sm",
  "50 × 70 sm",
  "60 × 90 sm",
  "Kipimo kingine",
];

export const DISPUTE_REASONS = [
  "Kazi haikufikia makubaliano",
  "Ucheleweshaji wa muda mrefu",
  "Ubora wa kazi",
  "Mawasiliano yamekatika",
  "Sababu nyingine",
];

export const moneyTZS = (value: number) =>
  `TSh ${new Intl.NumberFormat("sw-TZ", { maximumFractionDigits: 0 }).format(value)}`;

export const formatDate = (value: string | number) =>
  new Intl.DateTimeFormat("sw-TZ", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export const commissionUpdate = (label: string, note?: string): CommissionUpdate => ({
  id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  label,
  at: Date.now(),
  note,
});

export const makeRef = () => `AU-ESC-${Math.floor(100000 + Math.random() * 900000)}`;

export const defaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 21);
  return date.toISOString().slice(0, 10);
};

export const artType = (id: string) => ART_TYPES.find((type) => type.id === id) ?? ART_TYPES[0];
