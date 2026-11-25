'use strict';
/* LEEN beauty — demo store (no server: cart + orders live in localStorage) */

const $ = (s, el = document) => el.querySelector(s);
const SAR = n => `${Math.round(n).toLocaleString('en-US')} ر.س`;
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('leen:' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('leen:' + k, JSON.stringify(v)); } catch {} },
};

/* ---------- icons ---------- */
const I = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14Z"/><path d="M5 19 13 11"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7S10.5 3 8.5 3.8 9 7 12 7Zm0 0s1.5-4 3.5-3.2S15 7 12 7Z"/></svg>',
};

/* ---------- product art (SVG drawings, no photos needed) ---------- */
let gid = 0;
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
}
function art(p, o = {}) {
  const c = o.color || p.color, a = p.accent || '#3B2433', id = 'g' + (++gid);
  const lab = (x, y, w, h, small) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" opacity=".92"/>
    <text x="${x + w / 2}" y="${y + h * .42}" text-anchor="middle" font-family="Cormorant Garamond,Georgia" font-weight="600" font-size="${small ? 9 : 12}" letter-spacing="2.5" fill="#3B2433">LEEN</text>
    <rect x="${x + w * .3}" y="${y + h * .55}" width="${w * .4}" height="1.4" fill="${shade(c, -.25)}"/>
    <text x="${x + w / 2}" y="${y + h * .8}" text-anchor="middle" font-family="Helvetica,Arial" font-size="${small ? 5 : 6}" letter-spacing="1" fill="#8C7682">${p.en}</text>`;
  const gl = `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".18" stop-color="#fff" stop-opacity=".55"/><stop offset=".32" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>`;
  const sh = `<ellipse cx="100" cy="226" rx="58" ry="7" fill="#3B2433" opacity=".10"/>`;
  const G = `fill="url(#${id})"`;
  let s = '';
  switch (p.shape) {
    case 'dropper': s = `
      <path d="M86 26a14 14 0 0 1 28 0v34H86Z" fill="${shade(a, .05)}"/><rect x="86" y="50" width="28" height="12" fill="${shade(a, -.08)}"/>
      <rect x="80" y="60" width="40" height="36" rx="5" fill="${p.cap || '#D9B98A'}"/><rect x="80" y="60" width="40" height="36" rx="5" ${G}/>
      <rect x="58" y="94" width="84" height="128" rx="18" fill="${c}"/><rect x="58" y="94" width="84" height="128" rx="18" ${G}/>
      ${lab(70, 132, 60, 56)}`; break;
    case 'jar': s = `
      <rect x="44" y="104" width="112" height="38" rx="10" fill="${p.cap || a}"/><rect x="44" y="104" width="112" height="38" rx="10" ${G}/>
      <rect x="40" y="138" width="120" height="86" rx="22" fill="${c}"/><rect x="40" y="138" width="120" height="86" rx="22" ${G}/>
      ${lab(66, 156, 68, 50)}`; break;
    case 'pump': s = `
      <path d="M78 40h40v12H78z" fill="${p.cap || a}"/><path d="M118 42h26a4 4 0 0 1 0 8h-26z" fill="${p.cap || a}"/>
      <rect x="94" y="52" width="12" height="22" fill="${shade(p.cap || a, -.1)}"/>
      <rect x="82" y="72" width="36" height="22" rx="4" fill="${p.cap || a}"/>
      <rect x="62" y="92" width="76" height="130" rx="16" fill="${c}"/><rect x="62" y="92" width="76" height="130" rx="16" ${G}/>
      ${lab(72, 130, 56, 60)}`; break;
    case 'tube': s = `
      <rect x="60" y="22" width="80" height="12" rx="2" fill="${shade(c, -.12)}"/>
      <path d="M60 32h80l-10 150H70Z" fill="${c}"/><path d="M60 32h80l-10 150H70Z" ${G}/>
      <rect x="72" y="180" width="56" height="44" rx="7" fill="${p.cap || a}"/><rect x="72" y="180" width="56" height="44" rx="7" ${G}/>
      ${lab(76, 76, 48, 62, true)}`; break;
    case 'lipstick': s = `
      <path d="M86 100V56c0-6 6-12 28-22v66Z" fill="${c}"/><path d="M86 100V56c0-6 6-12 28-22v66Z" ${G}/>
      <rect x="80" y="96" width="40" height="40" rx="3" fill="#E7CDA0"/><rect x="80" y="96" width="40" height="40" rx="3" ${G}/>
      <rect x="74" y="134" width="52" height="90" rx="5" fill="${a}"/><rect x="74" y="134" width="52" height="90" rx="5" ${G}/>
      <text x="100" y="186" text-anchor="middle" font-family="Cormorant Garamond,Georgia" font-weight="600" font-size="11" letter-spacing="2.5" fill="#E7CDA0">LEEN</text>`; break;
    case 'compact': s = `
      <ellipse cx="100" cy="186" rx="72" ry="30" fill="${shade(a, -.08)}"/>
      <ellipse cx="100" cy="176" rx="72" ry="30" fill="${a}"/>
      <ellipse cx="100" cy="174" rx="56" ry="22" fill="${c}"/>
      <ellipse cx="88" cy="168" rx="22" ry="7" fill="#fff" opacity=".35"/>
      <path d="M30 170C30 110 60 70 100 70s70 40 70 100" fill="none"/>
      <ellipse cx="100" cy="98" rx="66" ry="64" fill="${a}" transform="rotate(-8 100 140)"/>
      <ellipse cx="100" cy="98" rx="54" ry="52" fill="#F4ECF2" opacity=".9" transform="rotate(-8 100 140)"/>
      <ellipse cx="82" cy="80" rx="18" ry="30" fill="#fff" opacity=".55" transform="rotate(30 82 80)"/>`; break;
    case 'mist': s = `
      <rect x="88" y="26" width="24" height="18" rx="4" fill="${p.cap || a}"/><rect x="82" y="42" width="36" height="34" rx="6" fill="${p.cap || a}"/><rect x="82" y="42" width="36" height="34" rx="6" ${G}/>
      <rect x="66" y="74" width="68" height="150" rx="30" fill="${c}"/><rect x="66" y="74" width="68" height="150" rx="30" ${G}/>
      ${lab(76, 124, 48, 60, true)}`; break;
    case 'perfume': s = `
      <rect x="78" y="34" width="44" height="46" rx="6" fill="${p.cap || a}"/><rect x="78" y="34" width="44" height="46" rx="6" ${G}/>
      <rect x="90" y="78" width="20" height="16" fill="#D9C2A0"/>
      <rect x="48" y="92" width="104" height="132" rx="14" fill="${c}" opacity=".95"/><rect x="58" y="102" width="84" height="112" rx="8" fill="${shade(c, -.08)}" opacity=".7"/>
      <rect x="48" y="92" width="104" height="132" rx="14" ${G}/>
      ${lab(70, 136, 60, 46)}`; break;
  }
  return `<svg viewBox="0 0 200 240" aria-hidden="true">${gl}${sh}${s}</svg>`;
}

/* ---------- catalogue ---------- */
const CATS = [
  { id: 'skincare', name: 'العناية بالبشرة', bg: '#F6DCD5' },
  { id: 'makeup', name: 'المكياج', bg: '#F1D3DA' },
  { id: 'hair', name: 'الشعر', bg: '#F3E3CC' },
  { id: 'body', name: 'الجسم', bg: '#DDE7DA' },
  { id: 'fragrance', name: 'العطور', bg: '#E9DFF0' },
];
const P = [
  { id: 'vitc', cat: 'skincare', name: 'سيروم فيتامين C المُشرق', en: 'VITAMIN C SERUM', sub: 'نضارة وتوحيد اللون · ٣٠ مل', price: 149, was: 179, shape: 'dropper', color: '#F2B35B', accent: '#3B2433', bg: '#FCE7C8', rating: 4.9, reviews: 412, tag: 'الأكثر مبيعاً', sizes: [['٣٠ مل', 0], ['٥٠ مل', 60]], stock: 34,
    desc: 'سيروم خفيف بتركيز ١٥٪ فيتامين C المستقر مع حمض الفيروليك، يمنح بشرتك إشراقة واضحة خلال أسبوعين ويساعد على تخفيف البقع الداكنة.',
    key: ['١٥٪ فيتامين C', 'حمض الفيروليك', 'فيتامين E'], use: 'ضعي ٣-٤ قطرات صباحاً على بشرة نظيفة قبل المرطب وواقي الشمس.', skin: ['كل أنواع البشرة', 'خالٍ من العطور', 'نباتي'] },
  { id: 'ceramide', cat: 'skincare', name: 'مرطب السيراميد اليومي', en: 'CERAMIDE CREAM', sub: 'ترطيب ٧٢ ساعة · ٥٠ مل', price: 129, shape: 'jar', color: '#F4E6DA', accent: '#C29A5E', cap: '#C29A5E', bg: '#F5EADF', rating: 4.8, reviews: 268, tag: 'جديد', stock: 21,
    desc: 'كريم غني وسريع الامتصاص يقوّي حاجز البشرة بثلاثة أنواع من السيراميد والنياسيناميد، مثالي للأجواء الجافة والمكيّفات.',
    key: ['٣ أنواع سيراميد', '٤٪ نياسيناميد', 'سكوالين'], use: 'صباحاً ومساءً على الوجه والرقبة بعد السيروم.', skin: ['البشرة الجافة والعادية', 'مناسب للحساسة'] },
  { id: 'cleanser', cat: 'skincare', name: 'غسول الجل اللطيف', en: 'GENTLE CLEANSER', sub: 'تنظيف بدون جفاف · ١٥٠ مل', price: 89, shape: 'pump', color: '#CFE2D6', accent: '#3B2433', cap: '#3B2433', bg: '#E4EEE6', rating: 4.7, reviews: 530, stock: 58,
    desc: 'غسول جل منعش بدرجة حموضة متوازنة، يزيل المكياج والشوائب ويحافظ على رطوبة البشرة الطبيعية.',
    key: ['الصبار', 'البانثينول', 'الشاي الأخضر'], use: 'دلّكي كمية صغيرة على بشرة مبللة ثم اشطفي بالماء الفاتر.', skin: ['كل أنواع البشرة'] },
  { id: 'spf', cat: 'skincare', name: 'واقي الشمس الشفاف SPF50', en: 'INVISIBLE SPF 50', sub: 'بدون أثر أبيض · ٥٠ مل', price: 99, shape: 'tube', color: '#FBE3A0', accent: '#3B2433', cap: '#F2B35B', bg: '#FDF0CF', rating: 4.9, reviews: 801, tag: 'الأكثر مبيعاً', stock: 9,
    desc: 'حماية عالية من الأشعة بقوام مائي شفاف يناسب حرارة الصيف، لا يترك لمعة ولا أثر أبيض وتحت المكياج.',
    key: ['SPF50 PA++++', 'هيالورونيك أسيد', 'خلاصة الأرز'], use: 'آخر خطوة صباحاً، وأعيدي وضعه كل ساعتين عند التعرض للشمس.', skin: ['كل أنواع البشرة', 'لا يسد المسام'] },
  { id: 'lip', cat: 'makeup', name: 'أحمر الشفاه المخملي', en: 'VELVET LIP', sub: 'ثبات ١٢ ساعة · ٦ درجات', price: 79, shape: 'lipstick', color: '#B8505E', accent: '#3B2433', bg: '#F4D6DA', rating: 4.8, reviews: 344, stock: 40,
    shades: [['ورد', '#B8505E'], ['نود', '#C98A76'], ['توت', '#8E2E4A'], ['كرز', '#B3263A'], ['كراميل', '#A8644A'], ['موف', '#9A5C7C']],
    desc: 'لون كثيف بلمسة مطفية ناعمة لا تُجفف الشفاه، بتركيبة غنية بزبدة الشيا.',
    key: ['زبدة الشيا', 'فيتامين E'], use: 'ابدئي من منتصف الشفة واتجهي للأطراف.', skin: ['خالٍ من البارابين'] },
  { id: 'blush', cat: 'makeup', name: 'بلاشر الخدود الوردي', en: 'CLOUD BLUSH', sub: 'نتيجة طبيعية قابلة للبناء', price: 95, shape: 'compact', color: '#EBA0A2', accent: '#E9C9CF', bg: '#F7E1E2', rating: 4.7, reviews: 190, tag: 'جديد', stock: 17,
    shades: [['وردي', '#EBA0A2'], ['خوخي', '#F0B08C'], ['برونزي', '#C9876A']],
    desc: 'بودرة ناعمة جداً تندمج مع البشرة وتمنحها احمراراً طبيعياً يدوم طوال اليوم.',
    key: ['بودرة الأرز', 'زيت الجوجوبا'], use: 'بفرشاة ناعمة على أعلى الخدود باتجاه الصدغ.', skin: ['مناسب للحساسة'] },
  { id: 'toner', cat: 'skincare', name: 'بخاخ ماء الورد الطائفي', en: 'TAIF ROSE MIST', sub: 'تونر منعش · ١٢٠ مل', price: 85, shape: 'mist', color: '#F5C6CD', accent: '#3B2433', cap: '#E9C9CF', bg: '#FBE4E6', rating: 4.9, reviews: 233, stock: 26,
    desc: 'ماء ورد طائفي نقي يرطب البشرة وينعشها في أي وقت، ويثبّت المكياج بلمسة عطرية خفيفة.',
    key: ['ماء الورد الطائفي', 'الجلسرين'], use: 'رشّيه على الوجه من مسافة ٢٠ سم بعد الغسول أو فوق المكياج.', skin: ['كل أنواع البشرة'] },
  { id: 'eye', cat: 'skincare', name: 'كريم العين بالكافيين', en: 'CAFFEINE EYE', sub: 'للهالات والانتفاخ · ١٥ مل', price: 119, shape: 'tube', color: '#DCD5EE', accent: '#3B2433', cap: '#9C8CC4', bg: '#ECE7F6', rating: 4.6, reviews: 147, stock: 12,
    desc: 'كريم خفيف بالكافيين والببتيدات يقلل الانتفاخ ويخفف الهالات مع الاستخدام المنتظم.',
    key: ['٥٪ كافيين', 'ببتيدات', 'فيتامين K'], use: 'نقطة صغيرة حول العين بالضغط الخفيف بإصبع البنصر.', skin: ['مختبر من أطباء العيون'] },
  { id: 'musk', cat: 'fragrance', name: 'عطر مسك الليل', en: 'NIGHT MUSK', sub: 'أو دو بارفان · ٧٥ مل', price: 289, was: 340, shape: 'perfume', color: '#EAD7C3', accent: '#3B2433', cap: '#3B2433', bg: '#F1E6DA', rating: 4.9, reviews: 98, tag: 'خصم', stock: 7,
    desc: 'مسك أبيض دافئ مع العنبر والورد وخشب الصندل، يدوم طويلاً ويترك أثراً ناعماً.',
    key: ['المسك الأبيض', 'العنبر', 'الورد', 'الصندل'], use: 'على نقاط النبض: الرقبة والمعصم.', skin: ['ثبات ١٠+ ساعات'] },
  { id: 'argan', cat: 'hair', name: 'زيت الأرغان للشعر', en: 'ARGAN HAIR OIL', sub: 'لمعان وتغذية · ٥٠ مل', price: 109, shape: 'dropper', color: '#D9A55A', accent: '#3B2433', cap: '#2E2A28', bg: '#F3E3CC', rating: 4.8, reviews: 276, stock: 30,
    desc: 'زيت أرغان مغربي خفيف يغذي الأطراف ويمنح لمعاناً بدون دهون ويحمي من حرارة السشوار.',
    key: ['زيت الأرغان', 'زيت الكاميليا'], use: '٢-٣ قطرات على أطراف الشعر الرطب أو الجاف.', skin: ['كل أنواع الشعر'] },
  { id: 'lotion', cat: 'body', name: 'لوشن الجسم بالفانيلا', en: 'VANILLA BODY', sub: 'ترطيب ناعم · ٢٥٠ مل', price: 79, shape: 'pump', color: '#F6E5D2', accent: '#3B2433', cap: '#C29A5E', bg: '#F5EADF', rating: 4.7, reviews: 312, stock: 44,
    desc: 'لوشن غني بزبدة الشيا والفانيلا يترك البشرة ناعمة ومعطرة طوال اليوم.',
    key: ['زبدة الشيا', 'الفانيلا', 'زيت اللوز'], use: 'على الجسم بعد الاستحمام.', skin: ['كل أنواع البشرة'] },
  { id: 'clay', cat: 'skincare', name: 'ماسك الطين الأخضر', en: 'GREEN CLAY MASK', sub: 'تنقية المسام · ٧٥ مل', price: 95, shape: 'jar', color: '#B9CDB0', accent: '#3B2433', cap: '#FFFFFF', bg: '#DDE7DA', rating: 4.6, reviews: 158, stock: 19,
    desc: 'ماسك طين فرنسي مع الشاي الأخضر ينقّي المسام ويقلل اللمعة في ١٠ دقائق.',
    key: ['الطين الفرنسي', 'الشاي الأخضر', 'الزنك'], use: 'طبقة متوسطة ١-٢ مرة أسبوعياً لمدة ١٠ دقائق.', skin: ['البشرة الدهنية والمختلطة'] },
];
const byId = id => P.find(p => p.id === id);
const BUNDLE = { ids: ['cleanser', 'vitc', 'ceramide', 'spf'], price: 399 };
const COUPONS = { LEEN15: .15, WELCOME10: .10 };
const CITIES = ['جدة', 'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'تبوك', 'القصيم'];
const FREE_SHIP = 200;
const REVIEWS = [
  ['نورة', 'الرياض', 'سيروم فيتامين C غيّر بشرتي حرفياً، صارت أنور والبقع خفت. والتوصيل جاني ثاني يوم 😍', 5, '#F6DCD5'],
  ['ريم', 'جدة', 'واقي الشمس أخيراً واحد ما يلمّع ولا يبيّض! صار أساسي بشنطتي.', 5, '#DDE7DA'],
  ['سارة', 'الدمام', 'التغليف فخم جداً وكأنه هدية، وقسّطت الطلب على تابي بدون أي تعقيد.', 5, '#F3E3CC'],
  ['لمى', 'مكة', 'عطر مسك الليل ريحته تجنن وثابت، كل وحدة تسألني وش عطرك 💕', 5, '#E9DFF0'],
];

/* ---------- state ---------- */
let cart = store.get('cart', []);
const saveCart = () => { store.set('cart', cart); paintBadge(); };
const lineKey = l => l.id + '|' + (l.shade || '') + '|' + (l.size || '');
const linePrice = l => { const p = byId(l.id); const sz = p.sizes?.find(s => s[0] === l.size); return p.price + (sz ? sz[1] : 0); };
const cartQty = () => cart.reduce((s, l) => s + l.q, 0);
const cartSub = () => cart.reduce((s, l) => s + linePrice(l) * l.q, 0);
function addToCart(id, opt = {}, q = 1) {
  const p = byId(id);
  const l = { id, q, shade: opt.shade ?? p.shades?.[0][0], size: opt.size ?? p.sizes?.[0][0] };
  const ex = cart.find(x => lineKey(x) === lineKey(l));
  ex ? ex.q += q : cart.push(l);
  saveCart(); toast(`${I.check}<span>انضاف للسلة</span>`); openCart();
}

/* ---------- shell ---------- */
function header() {
  const r = location.hash;
  return `<div class="ann"><div class="ann-in"><div><p>شحن مجاني للطلبات فوق ${FREE_SHIP} ريال 🚚</p><p>قسّطي مشترياتك على ٤ دفعات مع تابي وتمارا</p></div></div></div>
  <header class="top"><div class="wrap hd">
    <div class="l"><button class="ib menu-btn" data-act="menu" aria-label="القائمة">${I.menu}</button>
      <nav class="nav">${CATS.slice(0, 4).map(c => `<a href="#/c/${c.id}" class="${r === '#/c/' + c.id ? 'on' : ''}">${c.name}</a>`).join('')}</nav></div>
    <a href="#/" class="logo"><b>LEEN</b><small>لين · بيوتي</small></a>
    <div class="r"><a href="#/search" class="ib" aria-label="بحث">${I.search}</a><button class="ib" data-act="cart" aria-label="السلة">${I.bag}<span class="badge" id="bdg"></span></button></div>
  </div></header>`;
}
function footer() {
  return `<footer><div class="wrap">
    <div class="logo" style="align-items:flex-start"><b>LEEN</b><small style="color:#C9B2BB">لين · بيوتي</small></div>
    <div class="cols">
      <div><h4>انضمي لعائلة لين</h4><div style="font-size:13.5px;opacity:.85">خصم ١٠٪ على أول طلب وعروض حصرية</div><form class="news" onsubmit="event.preventDefault();this.reset();toast('تم الاشتراك 💌')"><input placeholder="رقم الجوال أو الإيميل" aria-label="البريد"><button>اشتراك</button></form></div>
      <div><h4>تسوقي</h4>${CATS.map(c => `<a href="#/c/${c.id}">${c.name}</a>`).join('')}</div>
      <div><h4>المساعدة</h4><a href="#/">تتبع الطلب</a><a href="#/">الشحن والتوصيل</a><a href="#/">الاستبدال والاسترجاع</a><a href="#/">تواصل معنا</a></div>
      <div><h4>عن لين</h4><a href="#/">قصتنا</a><a href="#/">المكونات</a><a href="#/admin">لوحة التحكم</a></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} لين بيوتي · السجل التجاري ٠٠٠٠٠٠٠٠٠٠</span>${payBadges()}</div>
  </div></footer>`;
}
const payBadges = () => `<div class="pays"><span class="pay apple">Apple Pay</span><span class="pay mada">mada</span><span class="pay">VISA</span><span class="pay tabby">tabby</span><span class="pay tamara">tamara</span></div>`;

function paintBadge() { const b = $('#bdg'); if (b) { const n = cartQty(); b.textContent = n; b.style.display = n ? 'grid' : 'none'; } }

function card(p) {
  return `<div class="pc">
    <a href="#/p/${p.id}" class="ph" style="background:${p.bg}">${art(p)}${p.tag ? `<span class="tag ${p.was ? 'sale' : ''}">${p.tag}</span>` : ''}</a>
    <button class="add" data-add="${p.id}" aria-label="أضف للسلة">${I.plus}</button>
    <a href="#/p/${p.id}"><div class="nm">${p.name}</div></a>
    <div class="sub">${p.sub}</div>
    <div class="stars"><i>★</i>${p.rating} <span>(${p.reviews})</span></div>
    <div class="pr">${SAR(p.price)}${p.was ? `<s>${SAR(p.was)}</s>` : ''}</div>
  </div>`;
}

/* ---------- pages ---------- */
function home() {
  const best = ['vitc', 'spf', 'lip', 'ceramide', 'toner', 'musk'].map(byId);
  const routine = [['01', 'نظّفي', 'cleanser', 'غسول لطيف يحافظ على رطوبة بشرتك'], ['02', 'عالجي', 'vitc', 'سيروم مركّز للنضارة وتوحيد اللون'], ['03', 'رطّبي واحمي', 'ceramide', 'مرطب يقوّي الحاجز + واقي شمس يومي']];
  const bundleWas = BUNDLE.ids.reduce((s, id) => s + byId(id).price, 0);
  return `
  <section class="hero"><div class="wrap">
    <div class="fade-in">
      <div class="eyebrow">عناية نظيفة · صُنعت لبشرتك</div>
      <h1>بشرة تشبهك…<br><em>بس أنعم</em></h1>
      <p>منتجات عناية ومكياج بمكونات واضحة ونتائج حقيقية، مختارة لأجواء الخليج وتوصلك لباب البيت.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a href="#/c/skincare" class="btn">تسوّقي الآن</a><a href="#/p/vitc" class="btn light">الأكثر مبيعاً</a></div>
      <div class="chips"><span>🌿 نباتي</span><span>🧪 مختبر جلدياً</span><span>🇸🇦 توصيل ١-٣ أيام</span></div>
    </div>
    <div class="hero-art"><div class="blob"></div>
      <div class="pa c">${art(byId('ceramide'))}</div>
      <div class="pa b">${art(byId('toner'))}</div>
      <div class="pa a">${art(byId('vitc'))}</div>
    </div>
  </div></section>

  <section class="s" style="padding-bottom:20px"><div class="wrap">
    <div class="cats">${CATS.map(c => { const p = P.find(x => x.cat === c.id); return `<a class="cat" href="#/c/${c.id}"><span class="ci" style="background:${c.bg}">${art(p)}</span>${c.name}</a>`; }).join('')}</div>
  </div></section>

  <section class="s" style="padding-top:20px"><div class="wrap">
    <div class="sh"><div><h2>الأكثر حباً 💗</h2><p>اختيارات عميلاتنا هذا الشهر</p></div><a href="#/c/all" class="link">عرض الكل</a></div>
    <div class="row">${best.map(card).join('')}</div>
  </div></section>

  <section class="s" style="padding-top:0"><div class="wrap">
    <div class="bnpl"><div><b>اشتري الحين وادفعي بعدين</b><p>قسّطي أي طلب على ٤ دفعات بدون فوائد · ادفعي بآبل باي ومدى</p></div>${payBadges()}</div>
  </div></section>

  <section class="s routine"><div class="wrap">
    <div class="sh"><div><h2>روتينك في ٣ خطوات</h2><p>بسيط، واضح، ويعطي نتيجة</p></div></div>
    <div class="steps">${routine.map(([n, t, id, d]) => { const p = byId(id); return `<a class="step" href="#/p/${id}"><div class="sp" style="background:${p.bg}">${art(p)}</div><div><div class="n lat">STEP ${n}</div><h3>${t}</h3><p>${d}</p><span class="link">${p.name}</span></div></a>`; }).join('')}</div>
    <div class="bundle"><div><h3>بكج الروتين الكامل ✨</h3><p>غسول + سيروم + مرطب + واقي شمس · وفّري ${SAR(bundleWas - BUNDLE.price)}</p></div>
      <div style="display:flex;align-items:center;gap:14px"><div><b style="font-size:20px">${SAR(BUNDLE.price)}</b> <s style="opacity:.6;font-size:13px">${SAR(bundleWas)}</s></div><button class="btn" data-act="bundle">أضيفي البكج</button></div></div>
  </div></section>

  <section class="s"><div class="wrap ingr">
    <div class="vis"><span class="ring" style="width:380px;height:380px"></span><span class="ring" style="width:260px;height:260px"></span>${art(byId('vitc'))}</div>
    <div><div class="eyebrow" style="font-size:12.5px;color:var(--deep);font-weight:600">مكوّن الشهر</div><h2>فيتامين C المستقر</h2>
      <p style="color:var(--ink2)">ليش سيرومنا يختلف؟ لأننا نستخدم شكل مستقر من فيتامين C ما يتأكسد ولا يتغير لونه، فتوصل الفعالية كاملة لبشرتك.</p>
      <ul><li><b>١</b><span>إشراقة ملحوظة خلال <strong>١٤ يوم</strong> عند ٩١٪ من المستخدمات</span></li><li><b>٢</b><span>يخفف البقع وآثار الحبوب مع الاستخدام المنتظم</span></li><li><b>٣</b><span>يقوّي حماية البشرة من التلوث والشمس</span></li></ul>
      <a href="#/p/vitc" class="btn">اكتشفي السيروم</a></div>
  </div></section>

  <section class="s" style="background:var(--cream)"><div class="wrap">
    <div class="big-rate"><b class="lat">4.9</b><div><div class="stars" style="font-size:15px"><i>★★★★★</i></div><div style="font-size:13px;color:var(--muted)">من أكثر من ٣٬٠٠٠ تقييم موثّق</div></div></div>
    <div class="revs">${REVIEWS.map(([n, c, t, s, bg]) => `<div class="rev"><div class="stars"><i>${'★'.repeat(s)}</i></div><p>${t}</p><div class="who"><span class="av" style="background:${bg}">${n[0]}</span><span><b style="color:var(--ink)">${n}</b> · ${c}<br><span class="ok">✓ مشترية موثّقة</span></span></div></div>`).join('')}</div>
  </div></section>

  <section class="s"><div class="wrap"><div class="perks">
    <div class="perk">${I.truck}<span>توصيل لكل مدن المملكة خلال ١-٣ أيام</span></div>
    <div class="perk">${I.shield}<span>منتجات أصلية ومسجلة في هيئة الغذاء والدواء</span></div>
    <div class="perk">${I.leaf}<span>مكونات نظيفة وبدون بارابين</span></div>
    <div class="perk">${I.gift}<span>تغليف هدايا مجاني مع كل طلب</span></div>
  </div></div></section>`;
}

let LF = { sort: 'pop', cat: 'all' };
function listing(cat) {
  LF.cat = cat;
  const c = CATS.find(x => x.id === cat);
  let items = cat === 'all' ? P.slice() : P.filter(p => p.cat === cat);
  if (LF.sort === 'low') items.sort((a, b) => a.price - b.price);
  if (LF.sort === 'high') items.sort((a, b) => b.price - a.price);
  if (LF.sort === 'pop') items.sort((a, b) => b.reviews - a.reviews);
  return `<div class="wrap">
    <div class="crumbs"><a href="#/">الرئيسية</a> / ${c ? c.name : 'كل المنتجات'}</div>
    <div class="lh"><h1>${c ? c.name : 'كل المنتجات'}</h1><p>${c ? 'منتجات مختارة بعناية لروتينك اليومي' : 'تشكيلة لين كاملة'}</p></div>
    <div class="filters"><a class="chip ${cat === 'all' ? 'on' : ''}" href="#/c/all">الكل</a>${CATS.map(x => `<a class="chip ${cat === x.id ? 'on' : ''}" href="#/c/${x.id}">${x.name}</a>`).join('')}
      <select class="sort" data-sort aria-label="ترتيب"><option value="pop" ${LF.sort === 'pop' ? 'selected' : ''}>الأكثر شعبية</option><option value="low" ${LF.sort === 'low' ? 'selected' : ''}>السعر: من الأقل</option><option value="high" ${LF.sort === 'high' ? 'selected' : ''}>السعر: من الأعلى</option></select></div>
    <div class="count">${items.length} منتج</div>
    <div class="grid fade-in">${items.map(card).join('')}</div>
  </div><div style="height:40px"></div>`;
}

let PS = {};
function product(id) {
  const p = byId(id); if (!p) return notFound();
  PS = { id, shade: p.shades?.[0][0], size: p.sizes?.[0][0], q: 1, view: 0 };
  const rel = P.filter(x => x.id !== id && (x.cat === p.cat || x.cat === 'skincare')).slice(0, 4);
  return `<div class="wrap">
    <div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/c/${p.cat}">${CATS.find(c => c.id === p.cat).name}</a> / ${p.name}</div>
    <div class="pp">
      <div class="gal"><div class="main" id="gmain" style="background:${p.bg}">${art(p)}</div>
        <div class="thumbs" id="gth">${[0, 1, 2].map(i => `<button data-view="${i}" class="${i ? '' : 'on'}" style="background:${i === 1 ? '#fff' : i === 2 ? shade(p.bg, -.04) : p.bg}">${art(p)}</button>`).join('')}</div></div>
      <div class="pi">
        ${p.tag ? `<span class="tag" style="font-size:12px;font-weight:600;color:var(--deep)">${p.tag}</span>` : ''}
        <h1>${p.name}</h1><div class="sub">${p.sub}</div>
        <div class="stars" style="margin-top:6px;font-size:13px"><i>★★★★★</i> ${p.rating} · ${p.reviews} تقييم</div>
        <div class="price" id="pprice"></div>
        <div class="inst"><div><span>أو ٤ دفعات بقيمة <b id="pinst"></b> بدون فوائد</span><span class="pay tabby">tabby</span></div><div><span>قسّميها على ٣ دفعات مع تمارا</span><span class="pay tamara">tamara</span></div></div>
        <div class="hl">${p.skin.map(s => `<span>${s}</span>`).join('')}</div>
        ${p.shades ? `<div class="opt">اللون: <span id="pshade">${PS.shade}</span></div><div class="sw">${p.shades.map(([n, c], i) => `<button data-shade="${n}" class="${i ? '' : 'on'}" style="background:${c}" aria-label="${n}"></button>`).join('')}</div>` : ''}
        ${p.sizes ? `<div class="opt">الحجم</div><div class="sz">${p.sizes.map(([n, d], i) => `<button data-size="${n}" class="${i ? '' : 'on'}">${n}${d ? ` <small style="color:var(--muted)">+${d}</small>` : ''}</button>`).join('')}</div>` : ''}
        <div class="buy"><div class="qty"><button data-q="1" aria-label="زيادة">+</button><span id="pq">1</span><button data-q="-1" aria-label="نقص">−</button></div><button class="btn" data-act="buy" id="buybtn">أضيفي للسلة</button></div>
        ${p.stock < 10 ? `<div style="color:var(--deep);font-size:13px;font-weight:600;margin-bottom:8px">⏳ باقي ${p.stock} قطع فقط</div>` : ''}
        <div class="mini-perks"><div>${I.truck}توصيل ١-٣ أيام</div><div>${I.gift}تغليف هدية مجاني</div><div>${I.shield}أصلي ١٠٠٪</div><div>${I.leaf}بدون بارابين</div></div>
        <div class="acc">
          <details open><summary>عن المنتج</summary><div class="ab">${p.desc}</div></details>
          <details><summary>المكونات الأساسية</summary><div class="ab"><ul>${p.key.map(k => `<li>${k}</li>`).join('')}</ul></div></details>
          <details><summary>طريقة الاستخدام</summary><div class="ab">${p.use}</div></details>
          <details><summary>الشحن والاسترجاع</summary><div class="ab">شحن مجاني للطلبات فوق ${FREE_SHIP} ريال. استرجاع خلال ١٤ يوم للمنتجات غير المفتوحة.</div></details>
        </div>
      </div>
    </div>
    <div class="sh" style="margin-top:20px"><div><h2>يكمّل روتينك</h2></div></div>
    <div class="row">${rel.map(card).join('')}</div><div style="height:50px"></div>
  </div>
  <div class="stickybuy" id="sbuy"><div class="t"><b>${p.name}</b><span id="sbp"></span></div><button class="btn" data-act="buy">أضيفي للسلة</button></div>`;
}
function paintPP() {
  const p = byId(PS.id); if (!p) return;
  const pr = linePrice(PS);
  $('#pprice').innerHTML = `${SAR(pr)}${p.was && PS.size === p.sizes?.[0][0] ? `<s>${SAR(p.was)}</s>` : p.was && !p.sizes ? `<s>${SAR(p.was)}</s>` : ''}<small>شامل الضريبة</small>`;
  $('#pinst').textContent = SAR(pr / 4);
  $('#pq').textContent = PS.q;
  $('#sbp').textContent = SAR(pr);
  const sh = p.shades?.find(s => s[0] === PS.shade);
  const bgs = [p.bg, '#fff', shade(p.bg, -.04)];
  $('#gmain').style.background = bgs[PS.view];
  $('#gmain').innerHTML = art(p, sh ? { color: sh[1] } : {});
  if (PS.view === 1) $('#gmain').innerHTML = `<div class="tex">${texture(sh ? sh[1] : p.color)}</div>`;
  if (PS.view === 2) $('#gmain').innerHTML = `<div style="display:flex;align-items:flex-end;gap:0;width:80%;justify-content:center">${[p, ...P.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 2)].map((x, i) => `<div style="width:${i ? 34 : 44}%;margin:0 -4%">${art(x, i === 0 && sh ? { color: sh[1] } : {})}</div>`).join('')}</div>`;
  if (sh) $('#pshade').textContent = sh[0];
}
const texture = c => `<svg viewBox="0 0 300 300" style="width:78%"><defs><radialGradient id="tx" cx=".4" cy=".35"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".5" stop-color="${c}" stop-opacity=".9"/><stop offset="1" stop-color="${shade(c, -.15)}"/></radialGradient></defs>
  <path d="M60 170c-10-50 40-95 95-90s90 35 85 85-50 75-100 70-70-25-80-65Z" fill="url(#tx)"/><ellipse cx="125" cy="125" rx="30" ry="14" fill="#fff" opacity=".5" transform="rotate(-25 125 125)"/>
  <circle cx="236" cy="92" r="12" fill="${c}" opacity=".8"/><circle cx="70" cy="250" r="8" fill="${c}" opacity=".7"/>
  <text x="150" y="292" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="15" fill="#8C7682">القوام</text></svg>`;

/* cart drawer */
function openCart() { paintCart(); $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); }
function closeCart() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
function paintCart() {
  const sub = cartSub(), left = Math.max(0, FREE_SHIP - sub);
  const up = P.find(p => !cart.some(l => l.id === p.id) && p.price < 110);
  $('#drawer').innerHTML = `<div class="sh-bg" data-act="close"></div><div class="panel">
    <div class="dh"><h3>سلّتك (${cartQty()})</h3><button class="ib" data-act="close" aria-label="إغلاق">${I.x}</button></div>
    ${cart.length ? `<div class="ship-bar">${left ? `باقي <b>${SAR(left)}</b> وتحصلين على شحن مجاني` : '🎉 مبروك! طلبك صار شحنه مجاني'}<div class="tr"><i style="width:${Math.min(100, sub / FREE_SHIP * 100)}%"></i></div></div>
    <div class="items">${cart.map((l, i) => { const p = byId(l.id); const sh = p.shades?.find(s => s[0] === l.shade); return `<div class="it">
      <a href="#/p/${p.id}" class="ph" style="background:${p.bg}">${art(p, sh ? { color: sh[1] } : {})}</a>
      <div><div class="nm">${p.name}</div><div class="vr">${[l.shade, l.size].filter(Boolean).join(' · ') || p.sub}</div>
        <div class="q"><button data-cq="${i}" data-d="1" aria-label="زيادة">+</button><span>${l.q}</span><button data-cq="${i}" data-d="-1" aria-label="نقص">−</button></div></div>
      <div><div class="pr">${SAR(linePrice(l) * l.q)}</div><button class="rm" data-rm="${i}">حذف</button></div></div>`; }).join('')}</div>
    ${up ? `<div class="upsell"><h4>عميلاتنا أضافوا كمان</h4><div class="u"><span class="ph" style="background:${up.bg}">${art(up)}</span><div class="t"><b>${up.name}</b>${SAR(up.price)}</div><button data-add2="${up.id}">إضافة</button></div></div>` : ''}
    <div class="df"><div class="tot"><span>المجموع</span><span>${SAR(sub)}</span></div><div class="note">أو ٤ دفعات بقيمة ${SAR(sub / 4)} مع تابي · الضريبة شاملة</div><a href="#/checkout" class="btn block" data-act="close">إتمام الطلب</a></div>`
    : `<div class="empty">${I.bag}<p>سلّتك فاضية</p><a href="#/c/all" class="btn" data-act="close">ابدئي التسوق</a></div>`}
  </div>`;
}

/* menu */
function openMenu() {
  $('#menu').innerHTML = `<div class="sh-bg" data-act="mclose"></div><div class="panel">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div class="logo" style="align-items:flex-start"><b>LEEN</b></div><button class="ib" data-act="mclose" aria-label="إغلاق">${I.x}</button></div>
    <a class="mi" href="#/c/all" data-act="mclose">كل المنتجات ${I.back}</a>
    ${CATS.map(c => `<a class="mi" href="#/c/${c.id}" data-act="mclose">${c.name} ${I.back}</a>`).join('')}
    <a class="mi" href="#/admin" data-act="mclose">لوحة تحكم المتجر ${I.back}</a>
    <div style="margin-top:auto">${payBadges()}</div></div>`;
  $('#menu').classList.add('open');
}

/* checkout */
let CO = store.get('co', { name: '', phone: '', city: 'جدة', area: '', street: '', ship: 'std', pay: 'apple', coupon: '' });
function totals() {
  const sub = cartSub();
  const disc = COUPONS[CO.coupon] ? Math.round(sub * COUPONS[CO.coupon]) : 0;
  const shipFee = CO.ship === 'fast' ? 35 : (sub - disc >= FREE_SHIP ? 0 : 25);
  const cod = CO.pay === 'cod' ? 15 : 0;
  return { sub, disc, shipFee, cod, total: sub - disc + shipFee + cod };
}
function checkout() {
  if (!cart.length) return `<div class="wrap empty">${I.bag}<p>سلّتك فاضية</p><a href="#/c/all" class="btn">ابدئي التسوق</a></div>`;
  return `<div class="wrap">
    <div class="crumbs"><a href="#/">الرئيسية</a> / إتمام الطلب</div>
    <div class="lh" style="padding-bottom:8px"><h1>إتمام الطلب</h1></div>
    <div class="co">
      <div style="display:grid;gap:14px">
        <div class="box"><h2><i>١</i>بياناتك</h2>
          <div class="fld" data-f="name"><label>الاسم الكامل</label><input id="f-name" value="${CO.name}" autocomplete="name" placeholder="مثال: نورة محمد"><span class="err">اكتبي اسمك</span></div>
          <div class="fld" data-f="phone"><label>رقم الجوال</label><div class="phone"><span>+966</span><input id="f-phone" value="${CO.phone}" inputmode="numeric" maxlength="9" placeholder="5XXXXXXXX"></div><span class="err">رقم جوال سعودي يبدأ بـ 5 (٩ أرقام)</span></div>
        </div>
        <div class="box"><h2><i>٢</i>عنوان التوصيل</h2>
          <div class="two"><div class="fld"><label>المدينة</label><select id="f-city">${CITIES.map(c => `<option ${c === CO.city ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="fld" data-f="area"><label>الحي</label><input id="f-area" value="${CO.area}" placeholder="مثال: الروضة"><span class="err">اكتبي الحي</span></div></div>
          <div class="fld"><label>الشارع ورقم المبنى (اختياري)</label><input id="f-street" value="${CO.street}" placeholder="أو العنوان الوطني المختصر"></div>
          <div class="radio" id="ship"></div>
        </div>
        <div class="box"><h2><i>٣</i>طريقة الدفع</h2><div class="radio" id="payr"></div>
          <div class="demo-note">🔒 الدفع آمن ومشفّر عن طريق بوابة دفع مرخّصة من البنك المركزي السعودي. (هذا نموذج تجريبي — ما يتم خصم أي مبلغ)</div></div>
      </div>
      <div class="side"><div class="box sum" id="sum"></div></div>
    </div>
  </div>`;
}
function paintCO() {
  const t = totals();
  const sub = cartSub();
  $('#ship').innerHTML = [['std', 'توصيل عادي', '١-٣ أيام عمل', sub - t.disc >= FREE_SHIP ? 'مجاني' : SAR(25)], ['fast', 'توصيل سريع', `نفس اليوم داخل ${CO.city === 'جدة' || CO.city === 'الرياض' ? CO.city : 'جدة والرياض'}`, SAR(35)]]
    .map(([v, n, d, pr]) => `<div class="ro ${CO.ship === v ? 'on' : ''}" data-ship="${v}"><span class="dot"></span><span class="t"><b>${n}</b><small>${d}</small></span><span class="v">${pr}</span></div>`).join('');
  const pays = [['apple', 'Apple Pay', 'ادفعي بلمسة', '<span class="pay apple">Apple Pay</span>'], ['card', 'مدى / بطاقة ائتمانية', 'Visa · Mastercard · mada', '<span class="pay mada">mada</span>'],
    ['tabby', 'تابي', `٤ دفعات بقيمة ${SAR(t.total / 4)} بدون فوائد`, '<span class="pay tabby">tabby</span>'], ['tamara', 'تمارا', `٣ دفعات بقيمة ${SAR(t.total / 3)} بدون فوائد`, '<span class="pay tamara">tamara</span>'],
    ['cod', 'الدفع عند الاستلام', 'رسوم إضافية ١٥ ر.س', '']];
  $('#payr').innerHTML = pays.map(([v, n, d, b]) => `<div class="ro ${CO.pay === v ? 'on' : ''}" data-pay="${v}"><span class="dot"></span><span class="t"><b>${n}</b><small>${d}</small></span>${b}</div>`).join('');
  $('#sum').innerHTML = `<h2 style="font-size:19px;margin-bottom:12px">ملخص الطلب</h2>
    <div class="sitems">${cart.map(l => { const p = byId(l.id); const sh = p.shades?.find(s => s[0] === l.shade); return `<div class="si"><span class="ph" style="background:${p.bg}">${art(p, sh ? { color: sh[1] } : {})}<b>${l.q}</b></span><span class="n">${p.name}<br><small style="color:var(--muted)">${[l.shade, l.size].filter(Boolean).join(' · ')}</small></span><b>${SAR(linePrice(l) * l.q)}</b></div>`; }).join('')}</div>
    <div class="coupon"><input id="cpn" placeholder="كود الخصم" value="${CO.coupon}" aria-label="كود الخصم"><button data-act="coupon">تطبيق</button></div>
    ${CO.coupon && !COUPONS[CO.coupon] ? '<div style="color:var(--deep);font-size:12.5px;margin:-6px 0 8px">الكود غير صحيح</div>' : ''}
    <div class="ln"><span>المجموع الفرعي</span><span>${SAR(t.sub)}</span></div>
    ${t.disc ? `<div class="ln d"><span>خصم (${CO.coupon})</span><span>−${SAR(t.disc)}</span></div>` : ''}
    <div class="ln"><span>الشحن</span><span>${t.shipFee ? SAR(t.shipFee) : 'مجاني'}</span></div>
    ${t.cod ? `<div class="ln"><span>رسوم الدفع عند الاستلام</span><span>${SAR(t.cod)}</span></div>` : ''}
    <div class="ln t"><span>الإجمالي</span><span>${SAR(t.total)}</span></div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px">شامل ضريبة القيمة المضافة ١٥٪</div>
    <button class="btn block" data-act="place">${CO.pay === 'apple' ? 'ادفعي بـ Apple Pay' : CO.pay === 'tabby' ? 'متابعة مع تابي' : CO.pay === 'tamara' ? 'متابعة مع تمارا' : CO.pay === 'cod' ? 'تأكيد الطلب' : 'ادفعي ' + SAR(t.total)}</button>
    <div style="font-size:12px;color:var(--muted);text-align:center;margin-top:10px">جرّبي كود <b>LEEN15</b> لخصم ١٥٪</div>`;
}
function readCO() {
  CO.name = $('#f-name')?.value.trim() ?? CO.name; CO.phone = ($('#f-phone')?.value ?? CO.phone).replace(/\D/g, '');
  CO.city = $('#f-city')?.value ?? CO.city; CO.area = $('#f-area')?.value.trim() ?? CO.area; CO.street = $('#f-street')?.value.trim() ?? CO.street;
  store.set('co', CO);
}
function place() {
  readCO();
  const bad = { name: CO.name.length < 2, phone: !/^5\d{8}$/.test(CO.phone), area: CO.area.length < 2 };
  document.querySelectorAll('.fld[data-f]').forEach(f => f.classList.toggle('bad', !!bad[f.dataset.f]));
  const first = Object.keys(bad).find(k => bad[k]);
  if (first) { $('#f-' + first).focus(); $('#f-' + first).scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  const t = totals();
  const label = { apple: 'Apple Pay', card: 'بطاقة / مدى', tabby: 'تابي', tamara: 'تمارا', cod: 'عند الاستلام' }[CO.pay];
  const m = document.createElement('div'); m.className = 'modal';
  const plan = n => `<div class="plan">${Array.from({ length: n }, (_, i) => `<div><b>${SAR(t.total / n)}</b>${i ? `بعد ${i} شهر` : 'اليوم'}</div>`).join('')}</div>`;
  m.innerHTML = `<div class="mc">${CO.pay === 'tabby' ? '<span class="pay tabby" style="font-size:16px;height:34px">tabby</span>' : CO.pay === 'tamara' ? '<span class="pay tamara" style="font-size:16px;height:34px">tamara</span>' : CO.pay === 'apple' ? '<span class="pay apple" style="font-size:16px;height:34px">Apple Pay</span>' : ''}
    <h3>${CO.pay === 'cod' ? 'نأكد طلبك…' : 'جاري الدفع بأمان…'}</h3><p>${label} · ${SAR(t.total)}</p>
    ${CO.pay === 'tabby' ? plan(4) : CO.pay === 'tamara' ? plan(3) : ''}<div class="spin"></div><p style="font-size:12px">نموذج تجريبي — ما يتم خصم أي مبلغ</p></div>`;
  document.body.appendChild(m);
  setTimeout(() => {
    const orders = store.get('orders', seedOrders());
    const no = 'LN-' + (10240 + orders.length + 1);
    orders.unshift({ no, at: Date.now(), name: CO.name, phone: CO.phone, city: CO.city, area: CO.area, pay: label, total: t.total, items: cart.map(l => ({ ...l })), status: 'new' });
    store.set('orders', orders);
    cart = []; saveCart(); m.remove(); location.hash = '#/done/' + no;
  }, 2200);
}
function done(no) {
  const o = store.get('orders', []).find(x => x.no === no);
  if (!o) return notFound();
  return `<div class="wrap done fade-in">
    <div class="ck">${I.check}</div>
    <h1>شكراً ${o.name.split(' ')[0]}، طلبك وصلنا 💗</h1>
    <div class="num">#${o.no}</div>
    <p style="color:var(--ink2)">بنرسل لك رسالة واتساب على <b dir="ltr">+966 ${o.phone}</b> فيها تفاصيل الطلب ورابط التتبع.</p>
    <div class="track"><div class="on"><i>✓</i>تم الطلب</div><div><i>٢</i>التجهيز</div><div><i>٣</i>الشحن</div><div><i>٤</i>التوصيل</div></div>
    <div class="box" style="background:var(--paper);border-radius:var(--r);padding:16px;text-align:right">
      ${o.items.map(l => { const p = byId(l.id); return `<div class="si" style="margin-bottom:10px"><span class="ph" style="background:${p.bg}">${art(p)}<b>${l.q}</b></span><span class="n">${p.name}</span><b>${SAR(linePrice(l) * l.q)}</b></div>`; }).join('')}
      <div class="sum"><div class="ln t"><span>الإجمالي · ${o.pay}</span><span>${SAR(o.total)}</span></div></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap"><a href="#/" class="btn">كمّلي التسوق</a><a href="#/admin" class="btn light">شوفي الطلب في لوحة التحكم</a></div>
  </div>`;
}

/* admin (store owner view) */
function seedOrders() {
  const now = Date.now(), h = 3600e3;
  return [
    { no: 'LN-10240', at: now - 2 * h, name: 'ريم العتيبي', phone: '5XXXXXXX1', city: 'الرياض', area: 'الملقا', pay: 'تابي', total: 377, items: [{ id: 'vitc', q: 1, size: '٣٠ مل' }, { id: 'spf', q: 2 }], status: 'prep' },
    { no: 'LN-10239', at: now - 5 * h, name: 'سارة القحطاني', phone: '5XXXXXXX2', city: 'جدة', area: 'الشاطئ', pay: 'Apple Pay', total: 289, items: [{ id: 'musk', q: 1 }], status: 'ship' },
    { no: 'LN-10238', at: now - 26 * h, name: 'لمى الحربي', phone: '5XXXXXXX3', city: 'مكة المكرمة', area: 'العزيزية', pay: 'تمارا', total: 399, items: [{ id: 'cleanser', q: 1 }, { id: 'vitc', q: 1, size: '٣٠ مل' }, { id: 'ceramide', q: 1 }, { id: 'spf', q: 1 }], status: 'done' },
    { no: 'LN-10237', at: now - 30 * h, name: 'نوف الشهري', phone: '5XXXXXXX4', city: 'أبها', area: 'المنسك', pay: 'بطاقة / مدى', total: 183, items: [{ id: 'lip', q: 1, shade: 'توت' }, { id: 'blush', q: 1, shade: 'وردي' }], status: 'done' },
  ];
}
let ATAB = 'orders';
function admin() {
  const orders = store.get('orders', null) || (store.set('orders', seedOrders()), seedOrders());
  const today = orders.filter(o => Date.now() - o.at < 24 * 3600e3);
  const sales = orders.reduce((s, o) => s + o.total, 0);
  const st = { new: ['جديد', 'new'], prep: ['قيد التجهيز', 'prep'], ship: ['تم الشحن', 'ship'], done: ['تم التوصيل', 'done'] };
  const next = { new: ['prep', 'ابدأ التجهيز'], prep: ['ship', 'تم الشحن'], ship: ['done', 'تم التوصيل'] };
  const fmt = t => new Date(t).toLocaleString('ar-SA', { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' });
  return `<div class="wrap adm">
    <div style="display:flex;justify-content:space-between;align-items:center"><div><div class="crumbs" style="padding:0">لوحة تحكم المتجر</div><h1 style="font-size:28px">أهلاً بك 👋</h1></div><a href="#/" class="btn light" style="height:42px;padding:0 16px">عرض المتجر</a></div>
    <div class="kp">
      <div class="k"><small>مبيعات آخر ٢٤ ساعة</small><b>${SAR(today.reduce((s, o) => s + o.total, 0))}</b></div>
      <div class="k"><small>طلبات اليوم</small><b>${today.length}</b></div>
      <div class="k"><small>إجمالي المبيعات</small><b>${SAR(sales)}</b></div>
      <div class="k"><small>متوسط الطلب</small><b>${SAR(sales / (orders.length || 1))}</b></div>
    </div>
    <div class="tabs"><button class="chip ${ATAB === 'orders' ? 'on' : ''}" data-tab="orders">الطلبات (${orders.length})</button><button class="chip ${ATAB === 'stock' ? 'on' : ''}" data-tab="stock">المنتجات والمخزون</button></div>
    ${ATAB === 'orders' ? orders.map((o, i) => `<div class="ord">
      <div class="top"><b>#${o.no}</b><span class="st ${st[o.status][1]}">${st[o.status][0]}</span></div>
      <div><b>${o.name}</b> · ${o.city}، ${o.area}</div>
      <div style="font-size:13px;color:var(--ink2)">${o.items.map(l => `${byId(l.id).name}${l.shade ? ` (${l.shade})` : ''} ×${l.q}`).join(' · ')}</div>
      <div class="meta"><span>${fmt(o.at)}</span><span>الدفع: ${o.pay}</span><span><b style="color:var(--ink)">${SAR(o.total)}</b></span></div>
      ${next[o.status] ? `<div class="act"><button data-adv="${i}">${next[o.status][1]}</button><button class="g" onclick="toast('📲 تم إرسال تحديث للعميلة على واتساب')">راسل العميلة</button></div>` : ''}
    </div>`).join('') : P.map(p => `<div class="stk"><span class="ph" style="background:${p.bg}">${art(p)}</span><div><b>${p.name}</b><div style="color:var(--muted);font-size:12.5px">${SAR(p.price)} · ${p.reviews} تقييم</div></div><div class="${p.stock < 10 ? 'low' : ''}">${p.stock} قطعة${p.stock < 10 ? ' ⚠️' : ''}</div></div>`).join('')}
    <div class="demo-note">هذي لوحة صاحب المتجر: تستقبل الطلبات لحظياً، تحدّث حالتها، وتتابع المخزون. (نموذج تجريبي — البيانات محفوظة على جهازك فقط)</div>
  </div>`;
}

function search() {
  return `<div class="wrap"><div class="search"><input id="q" placeholder="ابحثي عن سيروم، واقي شمس، عطر…" autofocus aria-label="بحث"></div><div class="grid" id="qr">${P.slice(0, 8).map(card).join('')}</div><div style="height:40px"></div></div>`;
}
function notFound() { return `<div class="wrap empty"><p>الصفحة غير موجودة</p><a href="#/" class="btn">الرئيسية</a></div>`; }

/* ---------- router ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  let body;
  switch (h[0]) {
    case 'c': body = listing(h[1] || 'all'); break;
    case 'p': body = product(h[1]); break;
    case 'checkout': body = checkout(); break;
    case 'done': body = done(h[1]); break;
    case 'admin': body = admin(); break;
    case 'search': body = search(); break;
    default: body = home();
  }
  const isAdmin = h[0] === 'admin';
  $('#app').innerHTML = (isAdmin ? '' : header()) + `<main>${body}</main>` + (isAdmin || h[0] === 'checkout' ? '' : footer());
  paintBadge();
  if (h[0] === 'p') paintPP();
  if (h[0] === 'checkout' && cart.length) paintCO();
  window.scrollTo(0, 0);
  closeCart(); $('#menu').classList.remove('open');
}
window.addEventListener('hashchange', route);
window.addEventListener('scroll', () => {
  $('header.top')?.classList.toggle('sc', scrollY > 10);
  const b = $('#buybtn'), s = $('#sbuy');
  if (b && s) s.classList.toggle('on', b.getBoundingClientRect().bottom < 0);
}, { passive: true });

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-add],[data-add2],[data-shade],[data-size],[data-q],[data-view],[data-cq],[data-rm],[data-ship],[data-pay],[data-adv],[data-tab]');
  if (!t) return;
  const d = t.dataset;
  if (d.add) { e.preventDefault(); addToCart(d.add); }
  else if (d.add2) { addToCart(d.add2); }
  else if (d.shade) { PS.shade = d.shade; document.querySelectorAll('[data-shade]').forEach(b => b.classList.toggle('on', b === t)); paintPP(); }
  else if (d.size) { PS.size = d.size; document.querySelectorAll('[data-size]').forEach(b => b.classList.toggle('on', b === t)); paintPP(); }
  else if (d.q) { PS.q = Math.max(1, PS.q + +d.q); paintPP(); }
  else if (d.view) { PS.view = +d.view; document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b === t)); paintPP(); }
  else if (d.cq) { const l = cart[+d.cq]; l.q += +d.d; if (l.q < 1) cart.splice(+d.cq, 1); saveCart(); paintCart(); }
  else if (d.rm) { cart.splice(+d.rm, 1); saveCart(); paintCart(); }
  else if (d.ship) { readCO(); CO.ship = d.ship; paintCO(); }
  else if (d.pay) { readCO(); CO.pay = d.pay; paintCO(); }
  else if (d.adv) { const o = store.get('orders', []); const nx = { new: 'prep', prep: 'ship', ship: 'done' }; o[+d.adv].status = nx[o[+d.adv].status]; store.set('orders', o); route(); toast('تم تحديث الطلب وإشعار العميلة 📲'); }
  else if (d.tab) { ATAB = d.tab; route(); }
  else switch (d.act) {
    case 'cart': openCart(); break;
    case 'close': closeCart(); break;
    case 'menu': openMenu(); break;
    case 'mclose': $('#menu').classList.remove('open'); break;
    case 'buy': addToCart(PS.id, { shade: PS.shade, size: PS.size }, PS.q); break;
    case 'bundle': BUNDLE.ids.forEach(id => { const p = byId(id); const ex = cart.find(l => l.id === id); ex ? ex.q++ : cart.push({ id, q: 1, size: p.sizes?.[0][0] }); }); saveCart(); toast('انضاف بكج الروتين ✨'); openCart(); break;
    case 'coupon': readCO(); CO.coupon = ($('#cpn').value || '').trim().toUpperCase(); store.set('co', CO); paintCO(); if (COUPONS[CO.coupon]) toast('تم تطبيق الخصم 🎉'); break;
    case 'place': place(); break;
  }
});
document.addEventListener('change', e => {
  if (e.target.matches('[data-sort]')) { LF.sort = e.target.value; route(); }
  if (e.target.id === 'f-city') { readCO(); paintCO(); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'q') {
    const q = e.target.value.trim();
    const r = P.filter(p => !q || (p.name + p.sub + p.en + p.key.join(' ')).toLowerCase().includes(q.toLowerCase()));
    $('#qr').innerHTML = r.length ? r.map(card).join('') : '<div class="empty" style="grid-column:1/-1">ما لقينا نتائج</div>';
  }
  if (e.target.closest('.fld.bad')) e.target.closest('.fld').classList.remove('bad');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); $('#menu').classList.remove('open'); } });

let tt;
function toast(html) { const t = $('#toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2000); }
window.toast = toast;

route();
