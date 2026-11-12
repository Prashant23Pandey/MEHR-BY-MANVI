export const SITE = {
  name: "Pear",
  title: "Pear — not an agency on the clock, a partner in the upside",
  description:
    "Pear builds custom software, ranks it where customers search, and takes its pay as a share of the revenue it earns. No retainers, no hours: if you don't grow, we don't get paid.",
  email: "info@pear.no",
  company: "PEAR AS · ORG NR 919 062 517 · OSLO",
  tagline: ["Not an agency on the clock, a", "partner in the upside."],
} as const;

export const NAV = [
  { id: "model", chapter: "Ch. 1", label: "The Model", at: 0.012 },
  { id: "work", chapter: "Ch. 2", label: "The Work", at: 0.232 },
  { id: "terms", chapter: "Ch. 3", label: "The Terms", at: 0.4 },
  { id: "questions", chapter: "Ch. 4", label: "Questions", at: 0.628 },
] as const;

export const HERO = {
  title: "Pear makes you appear.",
  subhead: ["Not an agency on the clock,", "a partner in the upside."],
  cta: "Request Partnership",
  signA: "Asked before",
  tag: "At your service",
} as const;

export const MODEL_BEATS = [
  {
    id: "build",
    head: ["We build it."],
    stand: "Tailored software, built to be found.",
    tag: "Custom software",
  },
  {
    id: "rank",
    head: ["We rank it."],
    stand: "Search and links that put you in front of the crowd.",
    tag: "Search and links",
  },
  {
    id: "share",
    head: ["We share in", "what it earns."],
    stand: "No hours billed - we co-own the outcome.",
    tag: "Revenue share",
  },
] as const;

export const MODEL_STAND =
  "We build custom software, rank it where customers search, and take our pay as a share of the revenue it earns. No retainers, no hours: if you don't grow, we don't get paid.";

export const WORK_CARDS = [
  {
    id: "found",
    chip: "Search engine optimization",
    chipWidth: 168,
    width: 360,
    head: ["Everything it takes to be", "found, under one roof."],
    body: "Search and software are one discipline at Pear. The product is built to rank from its first commit, and the SEO is done by the people who wrote the code.",
  },
  {
    id: "discipline",
    chip: "Search engine optimization",
    chipWidth: 168,
    width: 360,
    head: ["Search and software are one", "discipline at Pear."],
    body: "The product is built to rank from its first commit, and the SEO is done by the people who wrote the code.",
  },
  {
    id: "custom",
    chip: "Custom software",
    chipWidth: 104,
    width: 384,
    head: [
      "We design and build the thing being",
      "ranked: storefronts, marketplaces,",
      "booking systems, the machinery a",
      "modern company sells through.",
    ],
    body: "Most software is built first and optimized later, which is backwards. Architecture, speed and structure decide rankings before the first word of copy is written, so ours ships fast, renders clean, and gives search engines a site they can read without excuses.",
  },
] as const;

export const TERMS = [
  {
    id: "fees",
    head: ["No fees. A share", "of the upside."],
    headWidth: 540,
    lead: "You pay nothing to start: no retainer, no project fee, no hours on a clock. We carry the cost of strategy, development, content and links.",
    leadWidth: 545,
    chip: "Full disclosure",
    small:
      "Our pay is an agreed share of the revenue the work creates, measured against your baseline and visible to both sides. You keep everything we build: the software, the content, the rankings. And we take on a few partners at a time, because when we are paid on the outcome, yes has to be earned.",
    smallWidth: 315,
  },
  {
    id: "no",
    head: ["We say no more", "often than yes."],
    headWidth: 614,
    lead: "Our partners sell real products and services, have revenue to grow, and compete in markets where customers search: e-commerce, Saas, marketplaces, service companies.",
    leadWidth: 595,
    chip: "Full disclosure",
    small:
      "If that's you, the terms above are the whole pitch. If you're pre-revenue, want to rent developers by the hour, or need results by Friday, we're the wrong partner, and we'll tell you so in the first call.",
    smallWidth: 338,
  },
] as const;

export const FAQS = [
  {
    q: "What does it cost to work with Pear?",
    label: "The cost",
    a: "Nothing upfront and nothing hourly. We fund the strategy, the software, the content and the link building ourselves. Our payment is an agreed percentage of the new revenue that work generates. If your revenue doesn't grow, you owe us nothing.",
  },
  {
    q: "What share of the revenue do you take?",
    label: "The share",
    a: "It's agreed per partnership before we start, and depends on how much building the opportunity needs. It applies only to growth above your existing baseline, never to the revenue you already had.",
  },
  {
    q: "Why revenue share instead of fees?",
    label: "The model",
    a: "Because hourly billing pays agencies for effort, not results. An agency on a retainer earns the same whether you grow or not. We removed the retainer, so the only way for us to get paid is to grow your revenue.",
  },
  {
    q: "How do you measure the revenue you create?",
    label: "Measurement",
    a: "Before we begin, we agree on a baseline from your existing numbers and on how new organic revenue is attributed: analytics, order data or bookings, depending on your business. Both sides see the same dashboard.",
  },
  {
    q: "How long before it pays off?",
    label: "The timeline",
    a: "Search compounds slowly, then quickly. Software and technical fixes land in weeks; rankings and revenue typically move within months. The model means the waiting costs you nothing: we're the ones financing the ramp.",
  },
] as const;

export const APPLICATION = {
  label: "The application",
  lead: "Tell us what you sell and where you want to grow. Every application is read, and when the model fits we answer within a week.",
  fields: {
    name: { label: "Your name", placeholder: "Your name" },
    email: { label: "Work email", placeholder: "you@company.com" },
    grow: { label: "What do you want to grow?", placeholder: "What do you sell, and where do you want to grow?" },
  },
  submit: "Send the application",
  sending: "Sending...",
  sent: "Application sent.",
  error: "Something went wrong. Try again, or email info@pear.no.",
  note: "We answer within a week when the model fits.",
} as const;

export const PEAR_MARK_PATH =
  "M153.19 22.53C168.21 23.03 182.32 28.8 193.13 38.92C202.3 47.51 208.57 58.46 211.23 70.6C220.52 112.92 237.69 155.75 262.27 197.92C273.65 217.44 279.66 239.79 279.66 262.54C279.66 296.89 266.29 329.18 242.01 353.46C217.73 377.74 185.45 391.11 151.13 391.12L149.08 391.11C80.4 390.15 23.57 333.39 22.51 264.58C22.14 240.37 28.5 216.71 40.91 196.17C63.74 158.4 80.6 116 91.02 70.15C93.73 58.21 99.95 47.41 109.01 38.92C120.33 28.33 135.27 22.5 151.08 22.5C151.79 22.5 152.49 22.51 153.19 22.53Z";

export const STAR_PATH =
  "M12 0Q13.1 10.9 24 12Q13.1 13.1 12 24Q10.9 13.1 0 12Q10.9 10.9 12 0Z";

export const SIGN_PATHS = [
  { key: "s", d: "m 0,0 c 0.8998,-1.65154,2.121,-3.29839,3.3735,-5.1263,-0.2787,0.96871,-1.1734,1.00844,-0.2198,5.15939,0.4113,1.79038,-0.5215,6.68874,-4.6089,3.67108,3.1181,2.66904,5.8064,0.17923,8.4005,-3.43958", tf: "translate(1.455 -5.254)", a: 0, b: 0.1027 },
  { key: "i1", d: "m 0,0 c 0,0,-4.8682,5.76765,-2.7782,7.34219,1.5603,1.17547,4.6964,-3.50573,4.6964,-3.50573", tf: "translate(11.699 -8.694)", a: 0.1027, b: 0.1526 },
  { key: "dot1", d: "m 0,0 c 0.3633,-0.0304,0.4348,-0.30446,0.3157,-0.57296,-0.1562,-0.35196,-0.6165,-0.38945,-0.7951,-0.0117,-0.1647,0.34829,0.089,0.6173,0.4794,0.58463 z", tf: "translate(13.564 -10.621)", a: 0.1526, b: 0.1619 },
  { key: "g1", d: "m 0,0 c 0.1355,-1.79073,-5.8898,-2.14856,-7.9513,2.05798,-3.8317,7.81871,4.153,5.14364,5.5971,2.69243", tf: "translate(23.476 -7.671)", a: 0.1619, b: 0.2361 },
  { key: "g2", d: "m 0,0 c -1.1619,-0.25254,-8.6588,20.79796,-12.722,19.17658,-1.5259,-0.60889,-0.7548,-2.64348,0.2135,-4.07912,1.7572,-2.60534,12.9435,-8.17985,14.3794,-11.26214", tf: "translate(24.318 -8.84)", a: 0.2361, b: 0.3945 },
  { key: "n1", d: "m 0,0 c 0,0,2.639,-5.27928,3.8696,-4.26641,2.2794,1.87613,-3.6711,8.89662,-3.6711,8.89662,0.8673,0.0578,5.7877,-10.21518,8.8635,-8.23516,2.4603,1.58379,-4.2138,6.92561,-1.6867,8.40053,2.1168,1.23542,5.2255,-4.76251,5.2255,-4.76251", tf: "translate(26.188 -5.089)", a: 0.3945, b: 0.5514 },
  { key: "i2", d: "m 0,0 c 0,0,-4.8682,5.76765,-2.7782,7.34219,1.5603,1.17547,4.6964,-3.50573,4.6964,-3.50573", tf: "translate(42.087 -8.694)", a: 0.5514, b: 0.6012 },
  { key: "dot2", d: "m 0,0 c 0.3633,-0.0304,0.4348,-0.30446,0.3157,-0.57296,-0.1562,-0.35196,-0.6165,-0.38945,-0.7951,-0.0117,-0.1647,0.34829,0.089,0.6173,0.4794,0.58463 z", tf: "translate(43.953 -10.621)", a: 0.6012, b: 0.6106 },
  { key: "n2", d: "m 0,0 c 0,0,2.639,-5.27928,3.8696,-4.26641,2.2794,1.87613,-3.6711,8.89662,-3.6711,8.89662,0.8673,0.0578,5.7877,-10.21518,8.8635,-8.23516,2.4603,1.58379,-4.2138,6.92561,-1.6867,8.40053,2.1168,1.23542,5.2255,-4.76251,5.2255,-4.76251", tf: "translate(44.321 -5.089)", a: 0.6106, b: 0.7674 },
  { key: "g3", d: "m 0,0 c 0.1355,-1.79073,-5.8898,-2.14856,-7.9513,2.05798,-3.8317,7.81871,4.153,5.14364,5.5971,2.69243", tf: "translate(66.465 -7.671)", a: 0.7674, b: 0.8415 },
  { key: "g4", d: "m 0,0 c -1.1619,-0.25254,-8.6588,20.79796,-12.722,19.17658,-1.5259,-0.60889,-0.7548,-2.64348,0.2135,-4.07912,1.7572,-2.60534,12.9435,-8.17985,14.3794,-11.26214", tf: "translate(67.307 -8.84)", a: 0.8415, b: 1 },
] as const;

export const WORDMARK_PATHS = [
  "M496.175 94.1679C513.597 91.6249 528.131 103.956 523.257 122.14C516.926 145.755 476.449 142.036 479.235 112.85C480.058 104.173 487.515 95.4202 496.175 94.1679Z",
  "M35.0131 19.7672C35.0004 20.0614 33.3707 20.8803 35.3314 20.7267C53.4873 -3.95308 89.1624 -5.01499 111.698 14.3425C145.502 43.3723 142.115 108.059 103.066 131.012C81.3831 143.768 50.0878 141.119 35.3187 119.228C33.3707 119.075 35.0004 119.919 35.0004 120.188V180H0V4.0944H35.0131C34.8348 9.3016 35.255 14.56 35.0131 19.7672ZM62.8962 32.4333C24.6237 36.553 23.8726 103.991 64.7042 107.01C111.915 110.503 112.004 27.1494 62.8962 32.4333Z",
  "M177.005 80.3756C178.859 92.877 188.675 105.009 201.133 108.121C217.896 112.305 234.342 106.182 241.491 89.9175C244.717 91.7289 269.849 102.151 269.658 104.179C269.519 105.608 262.598 115.66 261.163 117.37C243.739 138.086 212.537 143.903 187.329 136.033C134.246 119.449 128.062 39.5927 173.017 10.3291C195.736 -4.46853 233.453 -3.75416 253.861 14.9853C271.525 31.1989 274.827 57.5285 272.897 80.3756H177.005ZM178.275 55.5002H240.818C241.428 55.0155 241.555 54.9644 241.53 54.1863C241.479 52.7448 239.46 47.6804 238.71 46.1369C225.719 19.7307 183.189 26.951 178.275 55.5002Z",
  "M453.603 135.341H418.645V4.69977H453.603C453.502 9.04598 453.743 13.4304 453.629 17.7894C453.616 18.312 452.141 24.6082 454.226 22.5434C454.328 22.4542 454.671 20.8228 455.218 20.0453C460.112 13.15 470.345 4.0625 479.333 4.0625H490.774L491.727 5.01841V35.6076L490.774 36.5635H475.519C465.197 36.5635 453.591 52.1639 453.591 61.7358V135.341H453.603Z",
  "M403.76 134.164C402.782 137.224 390.593 136.776 387.815 136.483C363.711 133.871 355.025 102.33 345.203 84.2014C320.258 85.7219 309.87 111.473 315.172 133.676H285.492L284.181 132.078C278.86 99.5624 298.307 65.8774 330.765 57.7875C325.13 39.444 314.741 23.5567 292.79 31.5101C295.431 24.122 295.137 10.5739 297.857 4.00458C299.931 -1.00528 318.576 1.23649 323.173 2.60104C334.795 6.07091 342.914 16.6365 348.784 26.6367C361.129 47.7483 369.757 72.5442 381.652 94.0067C386.465 102.701 390.671 110.264 402.351 106.678L403.76 107.906V134.183V134.164Z",
] as const;
