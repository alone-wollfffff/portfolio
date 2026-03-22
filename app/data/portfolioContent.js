import { assetUrl } from '../lib/assets.js';

export const homeContent = {
  hero: {
    badge: 'Open to Opportunities',
    firstName: 'Om Balaji',
    lastName: 'Varpe',
    role: '// AI / ML Engineer',
    description:
      'Final-year computer engineering student from Mumbai, building intelligent systems and data-driven solutions. Passionate about ML, LLMs, and turning raw data into real insight.',
    primaryCta: { href: 'projects.html', label: 'View Projects', iconHtml: '&#9889;' },
    secondaryCta: { action: 'contact', label: 'Get In Touch', iconHtml: '&#128222;' },
    badges: ['Python · AutoML', 'LLM Prompting', 'Data Science', 'Web Development'],
    portraitSrc: assetUrl('pic-hero.webp'),
  },
  about: {
    headingHtml: 'Who<br/><em>I Am</em>',
    lead:
      "I'm <strong>Om Balaji Varpe</strong>, a final-year computer engineering student at the University of Mumbai.",
    paragraphs: [
      "I'm deeply fascinated by the intersection of <strong>Data Science, Machine Learning, and AI Prompt Engineering</strong>. I enjoy building end-to-end ML systems and crafting prompts that make LLMs genuinely useful in real applications.",
      'My toolkit spans Python ML stacks, AutoML frameworks, React frontends, FastAPI backends, along with hands-on experience using LLM tools like ChatGPT, Claude, Gemini, and Copilot.',
    ],
    stats: [
      { value: '3+', label: 'Live Projects' },
      { value: '15+', label: 'Certificates' },
      { value: '7+', label: 'LLM Tools' },
      { value: '&#8734;', label: 'Curiosity' },
    ],
    education: [
      { year: '2023-2026', degree: 'B.E. Computer Engineering - University of Mumbai' },
      { year: '2021-2023', degree: 'Diploma in Computer Engineering - Vidyalankar Polytechnic' },
      { year: '2019', degree: 'SSC (10th) - Swami Vivekanand High School' },
    ],
  },
  skills: {
    headingHtml: 'What I<br/><em>Work With</em>',
    groups: [
      {
        label: 'Machine Learning &amp; AI',
        tags: ['Pandas', 'NumPy', 'AutoGluon', 'AutoFeat', 'scikit-learn', 'XGBoost', 'LightGBM', 'D-Tale', 'ydata-profiling'],
      },
      {
        label: 'LLMs &amp; Prompt Engineering',
        tags: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'RAG', 'Figma', 'Chain-of-Thought'],
      },
      {
        label: 'Dev Stack',
        tags: ['Python', 'FastAPI', 'Flask', 'React', 'SQL', 'SQLite', 'Git'],
      },
      {
        label: 'Cloud &amp; Deployment',
        tags: ['Streamlit', 'HuggingFace', 'Firebase', 'AWS', 'Docker', 'Gradio'],
      },
    ],
    bars: [
      { label: 'Python / Data', value: 92 },
      { label: 'Machine Learning', value: 88 },
      { label: 'LLM Prompting', value: 90 },
      { label: 'React / FastAPI', value: 78 },
    ],
  },
  contact: {
    label: '05. Contact',
    title: "Let's Connect",
    subtitle:
      "I'm actively looking for opportunities in data science, AI/ML, and prompt engineering.<br/>Let's build something amazing together.",
  },
};

export const projects = [
  {
    id: 'p1',
    status: '// DEPLOYED',
    number: '01',
    cardSide: 'left',
    mockupSide: 'right',
    meta: '// Project 01 · 2026 - Present',
    titleHtml: '&#128302; Data Alchemy',
    description:
      'Automated ML pipeline. A no-code tool that handles the full data science workflow - deep EDA with D-Tale and ydata-profiling, preprocessing and feature engineering via AutoFeat, and model training with AWS AutoGluon. Outputs a ready-to-deploy ZIP.',
    tags: ['Python', 'React', 'FastAPI', 'AutoGluon', 'AutoFeat', 'D-Tale', 'HuggingFace'],
    demoUrl: 'https://lonewollff-data-alchemy.hf.space/',
    demoHost: 'lonewollff-data-alchemy.hf.space',
    mediaSrc: assetUrl('src/vid/data alchemy.mp4'),
    nextStatus: '// DEPLOYED',
    nextNumber: '02',
  },
  {
    id: 'p2',
    status: '// DEPLOYED',
    number: '02',
    cardSide: 'right',
    mockupSide: 'left',
    meta: '// Project 02 · 2026 - Present',
    titleHtml: '&#128674; Deploy Alchemy',
    description:
      'The perfect sequel to Data Alchemy. Takes your trained model ZIP and auto-generates a fully functional REST API. Download -> extract -> install -> run. Your ML model is live in under 60 seconds.',
    tags: ['Python', 'React', 'FastAPI', 'AutoGluon', 'HuggingFace', 'Ydata-Profiling'],
    demoUrl: 'https://lonewollff-deploy-alchemy.hf.space/',
    demoHost: 'lonewollff-deploy-alchemy.hf.space',
    mediaSrc: assetUrl('src/vid/data alchemy.mp4'),
    nextStatus: '// DEPLOYED',
    nextNumber: '03',
  },
  {
    id: 'p3',
    status: '// DEPLOYED',
    number: '03',
    cardSide: 'left',
    mockupSide: 'right',
    meta: '// Project 03 · 2026 - Present',
    titleHtml: '&#128302; Review Intelligence',
    description:
      'A full-stack analytics tool that transforms raw reviews from YouTube, Amazon, and Google Play into structured sentiment reports. Paste a link or raw text — the pipeline handles scraping, NLP classification, emotion analysis, topic clustering, and trust scoring. Outputs a live dashboard with PDF/JSON export and a side-by-side compare workflow.',
    tags: ['React', 'FastAPI', 'Python', 'NLP', 'HuggingFace', 'Transformers', 'Redis', 'Recharts', 'TailwindCSS'],
    demoUrl: 'https://lonewollff-review-intelligence.hf.space/',
    demoHost: 'lonewollff-review-intelligence.hf.space',
    mediaSrc: assetUrl('src/vid/Review Intelligence.mp4'),
    nextStatus: '// LOADING...',
    nextNumber: '04',
  }
];

export const contactActions = {
  home: [
    { href: 'mailto:omvarpe80@gmail.com', iconHtml: '&#9993;', label: 'Email Me' },
    { href: 'https://www.linkedin.com/in/varpeom', iconHtml: 'in', label: 'LinkedIn Profile', external: true },
    { href: 'https://github.com/lonewollff', iconHtml: '&#8857;', label: 'GitHub Profile', external: true },
    { href: 'https://lonewollff-data-alchemy.hf.space/', iconHtml: '&#9889;', label: 'HuggingFace Space', external: true },
  ],
  projects: [
    { href: 'https://github.com/lonewollff', iconHtml: '&#8857;', label: 'GitHub Profile', external: true },
    { href: 'https://lonewollff-data-alchemy.hf.space/', iconHtml: '&#9889;', label: 'HuggingFace Space', external: true },
    { href: 'mailto:omvarpe80@gmail.com', iconHtml: '&#9993;', label: 'Get In Touch' },
    { href: 'index.html', iconHtml: '&#8592;', label: 'Back to Home' },
  ],
  certifications: [
    { href: 'projects.html', iconHtml: '+', label: 'View Projects' },
    { href: 'index.html', iconHtml: '&lt;', label: 'Back to Home' },
    { href: 'mailto:omvarpe80@gmail.com', iconHtml: '@', label: 'Get In Touch' },
    { href: 'https://www.linkedin.com/in/varpeom', iconHtml: 'in', label: 'LinkedIn', external: true },
  ],
};
