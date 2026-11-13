import { useState } from "react";
import { articles, img, reviews, type Article } from "../data";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Leaf, Mail, Mark, Stars } from "./Icons";
import SectionHead from "./SectionHead";

/* ---------------------------------- story --------------------------------- */

export function Story({ onOpenArticle }: { onOpenArticle: (article: Article) => void }) {
  return (
    <section id="story" className="scroll-mt-20 border-t border-ink/10 bg-paper py-16 sm:py-20 lg:py-28">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2px] bg-sand">
              <img
                src={img(20362429, 900, 1000)}
                alt="Mikono ya mfinyanzi wa Tanzania ikitengeneza bakuli la udongo kwenye gurudumu huko Bagamoyo"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]"
              />
              <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] backdrop-blur-sm">
                Studio, 07:40
              </span>
            </div>
            <img
              src={img(2962702, 640, 800)}
              alt="Mwanamke wa Tanzania akiwa amevaa kanga ya rangi, ndani ya nyumba yenye mwanga"
              loading="lazy"
              className="absolute -bottom-8 right-0 hidden aspect-[4/5] w-[42%] rounded-[2px] border-[7px] border-paper object-cover shadow-soft sm:block"
            />
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 bg-olive px-4 py-3.5 text-cream sm:-left-5 sm:px-5">
              <Mark className="h-4 w-4 text-sand" />
              <span className="text-[9px] uppercase tracking-[0.16em]">Watengenezaji 12, kiwango kimoja</span>
            </div>
          </div>

          <div className="relative">
            <p className="eyebrow text-clay">Hadithi yetu · Tangu 2014</p>
            <h2 className="mt-4 text-balance font-display text-[clamp(1.9rem,3.5vw,3rem)] font-light leading-[1.05] tracking-[-0.02em]">
              Tunanunua polepole, kutoka kwa watu <em className="italic text-clay">tunaowafahamu kwa majina.</em>
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-[1.8] text-ink-soft/85">
              <p>
                Asili &amp; Udongo ilianza na watu wawili, tanuru moja, na kero ya pamoja kwa vitu ambavyo hakuna mtu
                anayeweza kuvieleza. Tulitaka kujua nani alifinyanga kikombe, udongo ulikotoka, na kama
                aliyekitengeneza alilipwa vema kwa asubuhi yake.
              </p>
              <p>
                Miaka kumi na miwili baadaye, tunafanya kazi na studio huru kumi na mbili kote Tanzania na pwani ya
                Afrika Mashariki. Tunazitembelea mara mbili kwa mwaka, tunalipa moja kwa moja, na tunanunua tu kile
                tunachotaka kuishi nacho wenyewe — ndiyo sababu mkusanyo wetu ni mfupi kwa makusudi.
              </p>
            </div>

            <ul className="mt-7 space-y-3.5 border-t border-ink/10 pt-6">
              {[
                "Mahusiano ya moja kwa moja na haki kwa kila mtengenezaji",
                "Malighafi asili — udongo, kitani, pamba, mninga",
                "Makundi madogo, hukarabatiwa badala ya kubadilishwa",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[12.5px] text-ink-soft">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-clay/10 text-clay">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-ink/10 pt-6">
              <div>
                <p className="font-display text-[1.6rem] italic leading-none text-ink">Asha &amp; Juma</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-stone">Waanzilishi, Dar es Salaam</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenArticle(articles[0])}
                className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-[10.5px] uppercase tracking-[0.14em] transition-colors hover:border-clay hover:text-clay"
              >
                Soma hadithi ya studio
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-ink/10 pt-8 lg:mt-24">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <p className="eyebrow text-clay">Tunavyochagua</p>
            <p className="max-w-sm text-[11px] leading-relaxed text-stone">
              Kanuni tatu ambazo hatujazivunja tangu kibanda chetu cha kwanza.
            </p>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
            {[
              {
                n: "01",
                title: "Tunaangalia kwanza",
                text: "Kila kitu huanza na ziara ya studio, si skrini. Kama hatutakichukua jikoni mwetu wenyewe, hakirudi nasi.",
              },
              {
                n: "02",
                title: "Tunauliza kila kitu",
                text: "Nani alikitengeneza, kilichukua muda gani, nini hufanyika kikivunjika. Tunapendelea vitu vinne vya kweli kuliko arobaini visivyo na jina.",
              },
              {
                n: "03",
                title: "Tunabakiza vichache",
                text: "Mkusanyo ni mfupi kwa makusudi. Kitu kikimalizika, tunasubiri upikaji unaofuata badala ya kutafuta kiwanda cha haraka.",
              },
            ].map((step) => (
              <div key={step.n} className="border-t border-ink/15 pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[1.9rem] leading-none text-clay/50">{step.n}</span>
                  <h3 className="text-[12px] font-medium uppercase tracking-[0.1em]">{step.title}</h3>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-ink-soft/75">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- journal -------------------------------- */

export function Journal({ onOpenArticle }: { onOpenArticle: (article: Article) => void }) {
  const [lead, ...rest] = articles;

  return (
    <section id="journal" className="scroll-mt-20 border-t border-ink/10 bg-cream py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          eyebrow="Jarida"
          title={
            <>
              Maelezo kutoka <em className="italic text-clay">studio.</em>
            </>
          }
          description="Kuhusu kutengeneza, kukarabati na kuishi na vitu vichache, bora. Huandikwa polepole, huchapishwa vikitimia."
          actionLabel="Anza na maelezo ya studio"
          onAction={() => onOpenArticle(articles[0])}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <button
            type="button"
            onClick={() => onOpenArticle(lead)}
            className="group text-left lg:col-span-7"
            aria-label={`Soma ${lead.title}`}
          >
            <div className="overflow-hidden rounded-[2px] bg-sand">
              <img
                src={lead.image}
                alt={lead.title}
                loading="lazy"
                className="aspect-[16/11] w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] uppercase tracking-[0.15em] text-stone">
              <span className="text-clay">{lead.category}</span>
              <span className="h-1 w-1 rounded-full bg-stone/50" />
              <span>{lead.readTime}</span>
              <span className="h-1 w-1 rounded-full bg-stone/50" />
              <span>{lead.date}</span>
            </div>
            <h3 className="mt-3 max-w-xl font-display text-[clamp(1.5rem,2.4vw,2.15rem)] leading-[1.12] transition-colors group-hover:text-clay">
              {lead.title}
            </h3>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-ink-soft/75">{lead.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-[10px] uppercase tracking-[0.14em] transition-colors group-hover:border-clay group-hover:text-clay">
              Soma hadithi
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <div className="flex flex-col divide-y divide-ink/10 lg:col-span-5">
            {rest.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => onOpenArticle(article)}
                className="group grid grid-cols-[104px_1fr] gap-4 py-5 text-left first:pt-0 sm:grid-cols-[128px_1fr] sm:gap-5 lg:py-6 lg:first:pt-0"
                aria-label={`Soma ${article.title}`}
              >
                <div className="overflow-hidden rounded-[2px] bg-sand">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-stone">
                    <span className="text-clay">{article.category}</span>
                    <span className="h-1 w-1 rounded-full bg-stone/50" />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[1.15rem] leading-[1.15] transition-colors group-hover:text-clay sm:text-[1.3rem]">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[11.5px] leading-relaxed text-ink-soft/70">{article.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.14em] text-ink">
                    Soma
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- reviews -------------------------------- */

export function Reviews() {
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  const go = (dir: number) => setIndex((i) => (i + dir + reviews.length) % reviews.length);

  return (
    <section className="grain relative overflow-hidden bg-olive-deep py-16 text-cream sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-cream/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full border border-cream/[0.06]"
      />
      <div className="shell relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow text-sand/70">Kutoka nyumba zenye fikira</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.7rem)] font-light leading-[1.05] text-cream">
              Maneno matamu,
              <br />
              yaliyowekwa <em className="italic text-sand">rafuni.</em>
            </h2>
            <div className="mt-8 space-y-4 border-t border-cream/15 pt-6">
              <div className="flex items-center gap-3">
                <Stars value={4.9} className="text-sand" />
                <span className="text-[12px] font-medium">4.9 kati ya 5</span>
              </div>
              <p className="max-w-[16rem] text-[11.5px] leading-relaxed text-cream/55">
                Yamekusanywa kutoka maoni 2,400+ yaliyothibitishwa na ziara za studio tangu 2014.
              </p>
              <div className="flex gap-6 pt-1">
                <div>
                  <p className="font-display text-2xl text-sand">96%</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-cream/50">Wangependekeza</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-sand">30</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-cream/50">Siku za kuamua</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between lg:col-span-8 lg:pl-8">
            <div>
              <div className="flex items-center justify-between">
                <Stars value={5} className="text-sand" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-cream/40">
                  {String(index + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
                </span>
              </div>
              <blockquote key={review.name} className="mt-5 animate-soft-in">
                <p className="text-balance font-display text-[clamp(1.3rem,2.4vw,2rem)] font-light italic leading-[1.36] text-cream">
                  “{review.quote}”
                </p>
                <footer className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] uppercase tracking-[0.14em]">
                  <span className="text-cream">{review.name}</span>
                  <span className="h-1 w-1 rounded-full bg-sand/60" />
                  <span className="text-cream/45">{review.place}</span>
                  <span className="h-1 w-1 rounded-full bg-sand/60" />
                  <span className="text-sand/80 normal-case tracking-[0.04em]">{review.detail}</span>
                </footer>
              </blockquote>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-cream/15 pt-5">
              <div className="flex items-center gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Onyesha maoni ya ${i + 1}`}
                    aria-pressed={i === index}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                      i === index ? "w-7 bg-sand" : "w-1.5 bg-cream/30 hover:bg-cream/60"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Maoni yaliyotangulia"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-cream/70 hover:bg-cream/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Maoni yanayofuata"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-cream/70 hover:bg-cream/10"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- studio strip ----------------------------- */

export function StudioStrip() {
  const shots = [
    { id: 39592341, label: "Mtaa wa Forodhani, Zanzibar" },
    { id: 13833730, label: "Mikonge inayosubiri" },
    { id: 33878988, label: "Kazi mpya, Bagamoyo" },
    { id: 39836728, label: "Nyumba ya Jambiani" },
    { id: 2962702, label: "Kanga za msimu" },
  ];

  return (
    <section className="border-t border-ink/10 bg-paper py-14 sm:py-16">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow text-clay">Kutoka studio · @asiliudongo</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,2.7vw,2.3rem)] leading-none">
              Nyakati ndogo, <em className="italic text-clay">zilizohifadhiwa.</em>
            </h2>
          </div>
          <a
            href="#shop"
            className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-clay hover:text-clay"
          >
            Tufuate
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {shots.map((shot) => (
            <a
              key={shot.id}
              href="#shop"
              aria-label={`${shot.label} — vinjari mkusanyo`}
              className="group relative overflow-hidden rounded-[1px] bg-sand"
            >
              <img
                src={img(shot.id, 700, 800)}
                alt={shot.label}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25" />
              <span className="absolute inset-x-3 bottom-3 translate-y-2 text-[8.5px] uppercase tracking-[0.12em] text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {shot.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- newsletter ------------------------------- */

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <section id="letter" className="scroll-mt-20 bg-clay py-16 text-paper sm:py-20">
      <div className="shell">
        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 hidden h-[360px] w-[360px] rounded-full border border-paper/20 lg:block"
          />
          <div>
            <p className="eyebrow text-paper/60">Barua kutoka studio</p>
            <h2 className="mt-4 max-w-md text-balance font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-light leading-[1.05] text-paper">
              Barua ya polepole, <em className="italic text-sand">mara mbili kwa mwezi.</em>
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-paper/75">
              Kazi mpya, maelezo ya studio na kitu kimoja ambacho hatuwezi kukiacha. Bila kelele, bila haraka — na
              unaweza kuondoka wakati wowote.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.14em] text-paper/60">
              <span className="inline-flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5" /> Bila plastiki, kamwe
              </span>
              <span className="inline-flex items-center gap-2">
                <Heart className="h-3.5 w-3.5" /> Wasomaji 4,800
              </span>
            </div>
          </div>

          <div className="relative">
            {status === "done" ? (
              <div className="animate-soft-in border border-paper/30 bg-paper/10 p-7 backdrop-blur-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-clay">
                  <Check className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-2xl text-paper">Uko kwenye orodha.</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-paper/75">
                  Barua fupi ya kukaribisha inaelekea <span className="text-paper">{email.trim()}</span>. Tutakuandikia
                  tena kipindi kinachofuata cha kupika vyungu.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                  }}
                  className="mt-5 cursor-pointer text-[10px] uppercase tracking-[0.14em] text-paper/60 underline underline-offset-4 hover:text-paper"
                >
                  Tumia anwani nyingine
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <label htmlFor="letter-email" className="eyebrow text-paper/60">
                  Barua pepe yako
                </label>
                <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/45" />
                    <input
                      id="letter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="wewe@mfano.com"
                      aria-invalid={status === "error"}
                      aria-describedby="letter-note"
                      className="w-full border border-paper/35 bg-paper/10 py-4 pl-11 pr-4 text-[13px] text-paper placeholder:text-paper/40 focus:border-paper focus:bg-paper/15 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="btn-light shrink-0 py-4">
                    Jiunge
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p
                  id="letter-note"
                  className={`mt-3 text-[10.5px] leading-relaxed ${status === "error" ? "text-paper" : "text-paper/55"}`}
                  role={status === "error" ? "alert" : undefined}
                >
                  {status === "error"
                    ? "Anwani hiyo haionekani sawa — tafadhali iangalie tena."
                    : "Mara mbili kwa mwezi. Ondoa kwa mbofyo mmoja. Hatuwahi kushiriki anwani yako."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
