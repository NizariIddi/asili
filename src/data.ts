export type Category = "Vyungu" | "Vitambaa" | "Taa" | "Vitu";

export const CATEGORIES: Category[] = ["Vyungu", "Vitambaa", "Taa", "Vitu"];

export const SHIPPING_THRESHOLD = 300000;
export const SHIPPING_FEE = 20000;

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  badge?: string;
  image: string;
  hoverImage: string;
  blurb: string;
  detail: string;
  maker: string;
  material: string;
  dimensions: string;
  palette: string;
  rating: number;
  reviewCount: number;
  visible?: boolean;
  custom?: boolean;
  stock?: number;
  sku?: string;
};

const photo = (id: number, w = 900, h = 1125) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const img = photo;

export const products: Product[] = [
  {
    id: "terra-vessel",
    name: "Chombo cha Udongo",
    price: 185000,
    category: "Vyungu",
    badge: "Kipya",
    image: photo(33878988),
    hoverImage: photo(20362428),
    blurb: "Umbo pana lenye msingi, uso mbichi nje na glasi ndani.",
    detail:
      "Kila Chombo cha Udongo hufinyangwa kwa gurudumu katika studio ya Neema Mwaikambo huko Bagamoyo, hivyo hakuna viwili vyenye mabega yanayofanana kabisa. Hupikwa mara mbili, kisha humaliziwa kwa mkono na glasi laini isiyo na sumu ndani. Kimeundwa kwa matawi, nyasi ndefu — au kwa kuangaliwa tu.",
    maker: "Neema Mwaikambo",
    material: "Udongo wa Bagamoyo uliofinyangwa kwa mkono",
    dimensions: "Kipenyo 18 × Urefu 32 sm",
    palette: "Mchanga mbichi",
    rating: 4.9,
    reviewCount: 86,
    stock: 9,
    sku: "AU-101",
  },
  {
    id: "dune-bud-vase",
    name: "Chombo cha Maua",
    price: 95000,
    category: "Vyungu",
    badge: "Kundi dogo",
    image: photo(7302803),
    hoverImage: photo(6739705),
    blurb: "Chombo cha kiganja kimoja kwa shina moja, au kwa kitu chochote.",
    detail:
      "Hutiwa moshi kwenye tanuru badala ya glasi, hivyo Chombo cha Maua hubaki na uso laini, kama chaki, wa udongo mbichi. Shingo nyembamba hushikilia shina moja wima; msingi mzito huhakikisha kinasimama imara.",
    maker: "Neema Mwaikambo",
    material: "Udongo uliotiwa moshi",
    dimensions: "Kipenyo 10 × Urefu 21 sm",
    palette: "Moshi",
    rating: 4.8,
    reviewCount: 41,
    stock: 3,
    sku: "AU-102",
  },
  {
    id: "halden-mug",
    name: "Kikombe cha Asubuhi",
    price: 32000,
    category: "Vyungu",
    badge: "Kinachopendwa",
    image: photo(30712594),
    hoverImage: photo(31452608),
    blurb: "Kikombe cha asubuhi cha 300ml — mpini mkarimu, glasi laini.",
    detail:
      "Tulimwomba mtengenezaji wetu kikombe anachokichukua nyumbani. Kikombe cha Asubuhi ni jibu: ukuta mzito kidogo kwa ajili ya joto, mpini wenye nafasi ya vidole viwili, na glasi inayobadilika kutoka rangi ya ngano hadi kijivu joto katika mwanga hafifu.",
    maker: "Neema Mwaikambo",
    material: "Udongo uliowekwa glasi",
    dimensions: "Kipenyo 9 × Urefu 9 sm · 300 ml",
    palette: "Ngano",
    rating: 5.0,
    reviewCount: 212,
    stock: 24,
    sku: "AU-103",
  },
  {
    id: "quiet-cups",
    name: "Vikombe Vitulivu, Seti ya Viwili",
    price: 58000,
    category: "Vyungu",
    image: photo(31452608),
    hoverImage: photo(10622354),
    blurb: "Vikombe vidogo viwili vya espresso, chai, au divai ya mwisho.",
    detail:
      "Porcelain yenye kuta nyembamba na glasi laini kama ganda la yai, huuzwa kwa jozi. Ni vidogo kwa makusudi — ni vikombe vya kusimama jikoni wakati kitu kinapikwa mezani.",
    maker: "Studio ya Koa",
    material: "Porcelain yenye glasi laini",
    dimensions: "Kipenyo 8 × Urefu 7 sm · 180 ml kila kimoja",
    palette: "Chaki",
    rating: 4.7,
    reviewCount: 64,
    stock: 11,
    sku: "AU-104",
  },
  {
    id: "mara-basket",
    name: "Kikapu cha Mikonge",
    price: 120000,
    category: "Vitu",
    badge: "Kipya",
    image: photo(13833730),
    hoverImage: photo(13833731),
    blurb: "Mikonge iliyofumwa kwa mkono kwa kuni, mashuka, au vitu vingi.",
    detail:
      "Hufumwa kwa siku tatu na chama kidogo cha wanawake huko Tanga. Kikapu hiki ni kizito cha kutosha kusimama peke yake na laini cha kutosha kukunjwa. Huja na mfuko wa pamba ndani.",
    maker: "Mwajuma Ally",
    material: "Mikonge na pamba",
    dimensions: "Kipenyo 34 × Urefu 30 sm",
    palette: "Nyasi kavu",
    rating: 4.8,
    reviewCount: 57,
    stock: 5,
    sku: "AU-105",
  },
  {
    id: "field-throw",
    name: "Shuka ya Pamba",
    price: 245000,
    category: "Vitambaa",
    image: photo(39836722),
    hoverImage: photo(37439166),
    blurb: "Pamba asilia isiyotiwa rangi na pindo zilizofungwa. Joto bila uzito.",
    detail:
      "Hufumwa kutoka pamba asilia katika kiwanda cha familia huko Arusha, na uso laini uliopulizwa na pindo zilizofungwa kwa mkono. Rangi ya mawingu hutokana na pamba yenyewe — hakuna rangi iliyoongezwa, hivyo sauti yake hubadilika kwa upole na majira.",
    maker: "Zawadi Kimaro",
    material: "Pamba asilia 100%",
    dimensions: "130 × 190 sm",
    palette: "Mawingu",
    rating: 4.9,
    reviewCount: 133,
    stock: 2,
    sku: "AU-106",
  },
  {
    id: "arlo-lamp",
    name: "Taa ya Meza ya Mikonge",
    price: 320000,
    category: "Taa",
    badge: "Kinachopendwa",
    image: photo(30163032),
    hoverImage: photo(24987313),
    blurb: "Mninga uliowekwa mafuta na kivuli cha mikonge kwa mwanga wa chini.",
    detail:
      "Taa ya utulivu yenye msingi wa mninga uliosokotwa Zanzibar na kivuli cha mikonge kilichoshonwa kwa mkono karibu na hapo. Inaweza kupunguzwa mwangaza, yenye joto laini (2700K) — imeundwa kukusanya mwanga, si kufurika chumba.",
    maker: "Baraka Mushi",
    material: "Mninga uliowekwa mafuta, kivuli cha mikonge",
    dimensions: "Kipenyo 28 × Urefu 46 sm",
    palette: "Mninga / kitani",
    rating: 4.9,
    reviewCount: 74,
    stock: 4,
    sku: "AU-107",
  },
  {
    id: "column-stool",
    name: "Kiti cha Mninga",
    price: 285000,
    category: "Vitu",
    image: photo(37134527),
    hoverImage: photo(37134528),
    blurb: "Kiti cha mti imara kwa pembe, kando ya kitanda, au mgeni wa ziada.",
    detail:
      "Viti vya mti vilivyochongwa kwa mkono na mafundi wa Mtwara, vikiwekwa mafuta ya asili na Baraka Mushi huko Zanzibar. Tumia kama kiti, meza ndogo, au standi ya Chombo cha Udongo. Kimemaliziwa kwa mafuta ya asili yanayozidi kupendeza kadri kinavyotumika.",
    maker: "Baraka Mushi",
    material: "Mti imara uliochongwa kwa mkono",
    dimensions: "Kipenyo 32 × Urefu 45 sm",
    palette: "Mninga",
    rating: 4.6,
    reviewCount: 29,
    stock: 6,
    sku: "AU-108",
  },
  {
    id: "ember-candle",
    name: "Mshumaa wa Moshi No. 04",
    price: 42000,
    category: "Taa",
    image: photo(40753746),
    hoverImage: photo(34578077),
    blurb: "Mwerezi, maganda ya chungwa na moshi kidogo. Masaa 45 ya hayo.",
    detail:
      "Harufu yetu ya nyumbani, hutiwa kwa makundi madogo kwenye kikombe cha udongo kinachoweza kutumika tena. Harufu ya mwerezi wa Atlas, maganda ya chungwa, na moshi mwepesi wa kuni — harufu ya studio mwisho wa siku ya kazi.",
    maker: "Asili & Udongo",
    material: "Nta ya soya, utambi wa pamba",
    dimensions: "220 g · masaa 45 ya mwako",
    palette: "Kauri nyeusi",
    rating: 4.9,
    reviewCount: 168,
    stock: 18,
    sku: "AU-109",
  },
  {
    id: "still-life-print",
    name: "Picha ya Utulivu No. 7",
    price: 130000,
    category: "Vitu",
    image: photo(27584189),
    hoverImage: photo(6801449),
    blurb: "Chapisho la archival la jiwe, udongo na vivuli virefu vya alasiri.",
    detail:
      "Ilipigwa picha na Mwanaisha Said katika studio yake huko Arusha, ikachapishwa kwa wino wa archival kwenye karatasi ya pamba 310gsm. Huja bila fremu, ikiwa na ukingo mpana uliochanwa kwa mkono ili ikae kwa asili katika fremu yoyote.",
    maker: "Mwanaisha Said",
    material: "Chapisho la archival kwenye karatasi ya pamba",
    dimensions: "30 × 40 sm, bila fremu",
    palette: "Ochre / mfupa",
    rating: 4.8,
    reviewCount: 38,
    stock: 7,
    sku: "AU-110",
  },
  {
    id: "fen-pillow",
    name: "Mto wa Kitani",
    price: 88000,
    category: "Vitambaa",
    image: photo(31531751),
    hoverImage: photo(31531749),
    blurb: "Kitani kilichooshwa kwa jiwe ambacho huboreka kila uoshapo.",
    detail:
      "Kifuniko cha mto wa sentimita 50 kwa kitani cha Ulaya kilichooshwa kwa jiwe, na zipi iliyofichwa pamoja na mto laini wa manyoya ulioidhinishwa. Uso huo hulainika kila uoshapo — hakuna kufuli, kamwe.",
    maker: "Zawadi Kimaro",
    material: "Kitani kilichooshwa kwa jiwe",
    dimensions: "50 × 50 sm · mto umejumuishwa",
    palette: "Mistari ya kitani",
    rating: 4.7,
    reviewCount: 91,
    stock: 0,
    sku: "AU-111",
  },
  {
    id: "rill-bowl",
    name: "Bakuli la Kuwekea",
    price: 115000,
    category: "Vyungu",
    badge: "Kipya",
    image: photo(20362428),
    hoverImage: photo(15440781),
    blurb: "Bakuli la glasi ya jivu lililo pana vya kutosha kwa saladi ya sita.",
    detail:
      "Hufinyangwa na kutiwa glasi ya jivu na Studio ya Koa huko Zanzibar. Bakuli la kuwekea lina alama hafifu za gurudumu ukutani nje na glasi ing'aayo ndani. Salama kwa oveni hadi 180°C, na imara vya kutosha kwa matumizi ya kila siku.",
    maker: "Studio ya Koa",
    material: "Udongo wa glasi ya jivu",
    dimensions: "Kipenyo 28 × Urefu 9 sm",
    palette: "Mfupa",
    rating: 4.8,
    reviewCount: 52,
    stock: 13,
    sku: "AU-112",
  },
];

export type Collection = {
  id: string;
  title: string;
  caption: string;
  category: Category;
  count: number;
  image: string;
};

export const collections: Collection[] = [
  {
    id: "morning-table",
    title: "Meza ya Asubuhi",
    caption: "Vyungu kwa kifungua kinywa bila haraka",
    category: "Vyungu",
    count: 6,
    image: photo(14929823, 900, 1150),
  },
  {
    id: "quiet-hours",
    title: "Saa za Utulivu",
    caption: "Mwanga na harufu kwa jioni",
    category: "Taa",
    count: 2,
    image: photo(30163032, 900, 1150),
  },
  {
    id: "woven-ground",
    title: "Sakafu ya Mikonge",
    caption: "Vyumba laini, malighafi za kweli",
    category: "Vitambaa",
    count: 2,
    image: photo(13833731, 900, 1150),
  },
];

export type Article = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  body: string[];
  quote: string;
  author: string;
  role: string;
};

export const articles: Article[] = [
  {
    id: "quiet-radicalism",
    title: "Utulivu wa kufanya vitu kwa mikono",
    category: "Maelezo ya studio",
    readTime: "Dakika 6",
    date: "12 Machi 2026",
    image: photo(3760974, 1200, 820),
    excerpt:
      "Miaka minane iliyopita, Neema Mwaikambo aliondoka kazi ya kubuni bidhaa ili kujifunza ufundi wa polepole. Tulitumia asubuhi moja kwenye gurudumu lake huko Bagamoyo.",
    body: [
      "Kuna sauti maalum katika studio ya Neema Mwaikambo saa mbili asubuhi: mtetemo wa chini wa gurudumu, maji kidogo, na kimya. Hakuna muziki. Hakuna simu. Hufanya kazi hivi kwa masaa matatu kabla jengo lingine kuamka.",
      "Neema alitumia miaka sita kubuni vitu vya plastiki kwa kampuni ambayo anaeleza, bila uchungu, kama 'wazuri sana wa kutengeneza vitu ambavyo hakuna mtu alihitaji mara mbili.' Aliondoka mwaka 2018 akiwa na kifuta jasho kidogo, tanuru la pili, na imani kwamba vitu tunavyoishi navyo vifanywe na watu wanaoweza kuvieleza.",
      "'Kufanya kwa mikono si kukumbushia zamani,' anasema, akituliza udongo kwa kisigino cha kiganja. 'Ni uaminifu tu. Mashine inaweza kurudia umbo kwa ukamilifu, lakini ukamilifu si kitu ninachojali. Ninajali mahali ambapo kidole kiligusa.'",
      "Kidole, hapa, ni halisi. Angalia kwa karibu Chombo chochote cha Udongo na utaona shimo hafifu karibu na msingi ambapo alikishikilia wakati wa kukitoa kwenye gurudumu. Si kasoro ya kurekebishwa. Ni kumbukumbu ya asubuhi.",
      "Tunanunua karibu kila kitu anachofinyanga Neema. Si kwa sababu vipande vyote vinafanana — havifanani — bali kwa sababu kila kimoja hubeba uamuzi. Katika soko lililojaa vitu vilivyotengenezwa haraka na kusahaulika haraka zaidi, hiyo inahisi kama mapinduzi ya utulivu.",
    ],
    quote: "Mashine inaweza kurudia umbo kwa ukamilifu. Lakini ukamilifu si kitu ninachojali.",
    author: "Studio Asili",
    role: "Mwanzilishi mwenza, Asili & Udongo",
  },
  {
    id: "imperfect-glaze",
    title: "Kwa heshima ya glasi isiyokamilika",
    category: "Ufundi",
    readTime: "Dakika 4",
    date: "28 Februari 2026",
    image: photo(20362428, 1200, 820),
    excerpt:
      "Kutambaa, kujaa, kububujika — kasoro ndogo zinazofanya chungu kistahili kuhifadhiwa. Utetezi mfupi wa kumruhusu tanuru kusema.",
    body: [
      "Glasi ni maelekezo, si uhakika. Badilisha unyevu wa studio kwa sehemu ndogo, weka bakuli sentimita kumi mbali zaidi na kichoma moto, na tanuru itakupa kitu ambacho hukukuomba.",
      "Wengi wa watengenezaji wetu watakuambia vyungu vya kwanza walivyouza ni vile waliyodhani ni makosa. Glasi iliyojilimbikiza sana kwenye ukingo, ikiacha mstari mweusi pale midomo yako inapopumzika. Kikombe kilichoinama, kwa shida kuonekana, upande wa kushoto. Hivyo ni vipande ambavyo watu hurudi kuvitafuta.",
      "Tuna rafu nyuma ya studio kwa kazi za glasi ya pili: mitiririko hafifu, mabaka, pembe zilizovunjika. Baadhi haitauzwa kamwe. Baadhi ni kitu bora tulichokitengeneza mwezi huo.",
      "Somo si kwamba kasoro ni nzuri kila wakati. Ni kwamba ukisugua kila makosa, mara nyingi husugua ushahidi kwamba mtu alikuwepo. Sisi tunapendelea ushahidi.",
    ],
    quote: "Ukisugua kila makosa, mara nyingi husugua ushahidi kwamba mtu alikuwepo.",
    author: "Juma Mrema",
    role: "Mwanzilishi mwenza, Asili & Udongo",
  },
  {
    id: "morning-light",
    title: "Nyumba iliyojengwa kwa mwanga wa asubuhi",
    category: "Nyumbani",
    readTime: "Dakika 8",
    date: "4 Februari 2026",
    image: photo(37181460, 1200, 820),
    excerpt:
      "Katika nyumba ya jumba la 1920 huko Oyster Bay, kila kitu kimepangwa kuzunguka dirisha linalopata jua moja kwa moja kwa saa mbili tu kwa siku.",
    body: [
      "Nyumba ni ya mkuu wetu wa studio, na ina saa moja na dakika hamsini za jua moja kwa moja wakati wa baridi. Samani zimepangwa, na kupangwa upya, kuzunguka ukweli huo. Kiti kifupi. Meza ndogo. Chombo kimoja kinachoshikilia kile kilichokuwa cha bei rahisi na cha msimu sokoni.",
      "Hii si minimalism kwa ajili yake yenyewe. Kuna vitabu vimetundikwa sakafuni, rundo la sufi karibu na sofa, vikombe vitatu vikifanya kazi kwa wakati mmoja. Lakini karibu kila kitu ndani ya chumba linapata nafasi kwa kuwa na manufaa kati ya saa moja na tatu asubuhi, jua linapofika.",
      "Chumba bora ndani ya nyumba, kwa mantiki hii, ni kile kinachokudai kidogo. Kiti kiko vizuri. Kikombe kinahifadhi joto. Taa inaweza kufifishwa. Nyuso ni jiwe na mti, na zinaweza kuvumilia kumwagika.",
      "Tumekuwa tukifikiria hili sana tunapokua: kwamba vitu vizuri si vile vinavyoonekana vizuri kwenye picha, bali vile vinaboresha kwa utulivu saa maalum ya siku yako. Nyumba iliyoundwa kuzunguka mwanga wa asubuhi ni nyumba iliyoundwa kuzunguka umakini.",
    ],
    quote: "Vitu vizuri si vile vinavyoonekana vizuri kwenye picha. Ni vile vinaboresha kwa utulivu saa maalum ya siku yako.",
    author: "Studio Asili",
    role: "Mwanzilishi mwenza, Asili & Udongo",
  },
];

export type Review = {
  quote: string;
  name: string;
  place: string;
  detail: string;
};

export const reviews: Review[] = [
  {
    quote:
      "Kitu unachokiona kila siku. Kahawa yangu ya asubuhi ina ladha bora katika Kikombe cha Asubuhi — kanaonekana kama kilitengenezwa kwa ajili ya mkono wangu.",
    name: "Neema K.",
    place: "Arusha",
    detail: "Kikombe cha Asubuhi, rangi ya ngano",
  },
  {
    quote:
      "Asili & Udongo ni mahali pa kwanza ninapotafuta kitu kwa chumba. Kimefungwa vizuri, kinatumika kila siku, na kinazidi kupendeza baada ya miaka michache.",
    name: "Joseph M.",
    place: "Arusha",
    detail: "Shuka ya Pamba, rangi ya mawingu",
  },
  {
    quote:
      "Tulipanga meza yetu yote ya kulia kutoka mkusanyo mmoja. Ni nadra kupata vitu vyenye fikira hii kwa bei inayohisi ya kibinadamu.",
    name: "Aisha S.",
    place: "Zanzibar",
    detail: "Mkusanyo wa Meza ya Asubuhi",
  },
];

export const asSeenIn = ["The Citizen", "Mwananchi", "The EastAfrican", "Nipashe", "HabariLeo"];

export const money = (value: number) =>
  `TSh ${new Intl.NumberFormat("sw-TZ", { maximumFractionDigits: 0 }).format(value)}`;

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export const sortLabels: Record<SortKey, string> = {
  featured: "Iliyopendekezwa",
  "price-asc": "Bei, chini hadi juu",
  "price-desc": "Bei, juu hadi chini",
  name: "Kwa alfabeti",
};
