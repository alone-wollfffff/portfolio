import { assetUrl } from '../lib/assets.js';

export const certificationCategories = [
  {
    id: 'llm',
    title: 'LLM & Prompt Engineering',
    accent: '#a855f7',
    issuers: [
      {
        name: 'VANDERBILT UNIVERSITY',
        certs: [
          { name: 'Prompt Engineering', year: '2026', img: assetUrl('cert/VU-Prompt Engineering.png'), url: 'https://coursera.org/verify/specialization/O0W40SHEJBUB', featured: true },
          { name: 'Prompt Engineering for ChatGPT', year: '2026', img: assetUrl('cert/VU-Prompt Engineering for ChatGPT.png'), url: 'https://coursera.org/verify/UJKEXPYDTJXD' },
          { name: 'ChatGPT Advanced Data Analysis', year: '2026', img: assetUrl('cert/VU-ChatGPT Advanced Data Analysis.png'), url: 'https://coursera.org/verify/GH9WJ4X4XS8L' },
          { name: 'Trustworthy Generative AI', year: '2026', img: assetUrl('cert/VU-Trustworthy Generative AI.png'), url: 'https://coursera.org/verify/XX8AVWYBLGJF' },
        ],
      },
      {
        name: 'H2O.ai',
        certs: [
          { name: 'Large Language Models', year: '2026', img: assetUrl('cert/H2O.ai-Large Language Models.png'), url: 'https://coursera.org/verify/specialization/YGWJZY1R6HZZ', featured: true },
          { name: 'Large Language Models (LLMs) - Level 1', year: '2026', img: assetUrl('cert/H2O.ai-Large Language Models (LLMs) - Level 1.png'), url: 'https://coursera.org/verify/Z07ILQTMEFCF' },
          { name: 'Large Language Models (LLMs) - Level 2', year: '2026', img: assetUrl('cert/H2O.ai-Large Language Models (LLMs) - Level 2.png'), url: 'https://coursera.org/verify/CISV04RLFOIL' },
          { name: 'Large Language Models (LLMs) - Level 3', year: '2026', img: assetUrl('cert/H2O.ai-Large Language Models (LLMs) - Level 3.png'), url: 'https://coursera.org/verify/J9VR95F8L7ZH' },
        ],
      },
      {
        name: 'AMD',
        certs: [{ name: 'Building AI Agents', year: '2025', img: assetUrl('cert/AMD-Building AI Agents.jpg'), url: assetUrl('cert/AMD-Building AI Agents.jpg'), featured: true }],
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Foundations',
    accent: '#06b6d4',
    issuers: [
      {
        name: 'Google',
        certs: [
          { name: 'Google AI Essentials', year: '2024', img: assetUrl('cert/Google AI Essentials.jpg'), url: 'https://coursera.org/verify/specialization/C37RSIB1GM5R', featured: true },
          { name: 'Introduction to AI', year: '2024', img: assetUrl('cert/Google-Introduction to AI.jpg'), url: 'https://coursera.org/verify/1E5HBIEAZGIW' },
          { name: 'Maximize Productivity With AI Tools', year: '2024', img: assetUrl('cert/Google-Maximize Productivity With AI Tools.jpg'), url: 'https://coursera.org/verify/S5KACMZGGWQZ' },
          { name: 'Discover the Art of Prompting', year: '2024', img: assetUrl('cert/Google-Discover the Art of Prompting.jpg'), url: 'https://coursera.org/verify/N3VST0K3DUVF' },
          { name: 'Use AI Responsibly', year: '2026', img: assetUrl('cert/Google-Use AI Responsibly.jpg'), url: 'https://coursera.org/verify/8WJ0VVSFTEJH' },
          { name: 'Stay Ahead of the AI Curve', year: '2026', img: assetUrl('cert/Google-Stay Ahead of the AI Curve.jpg'), url: 'https://coursera.org/verify/43EYSAGH4N02' },
        ],
      },
      {
        name: 'be10X',
        certs: [{ name: 'AI Tools Workshop', year: '2025', img: assetUrl('cert/Be10x_WorkShop.jpg'), url: 'https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd0997493876', featured: true }],
      },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    accent: '#22c55e',
    issuers: [
      {
        name: 'Acmegrade',
        certs: [
          { name: 'Machine Learning Training - IIT Bombay', year: 'Jan-Feb 2024', img: assetUrl('cert/AcmeGrade-ML_Training.jpg'), url: 'https://drive.google.com/file/d/1bvhlAukNFCT-2Pw_8_1gSFYkj8JWpMv9/view?usp=sharing', featured: true },
          { name: 'Machine Learning Internship', year: 'Jan-Mar 2024', img: assetUrl('cert/AcmeGrade-ML_Internship.jpg'), url: 'https://drive.google.com/file/d/1v83YeIgJ9Lvd3L1oMHdN1mMJJAh7Km76/view?usp=sharing', featured: true },
        ],
      },
    ],
  },
  {
    id: 'data',
    title: 'Data, SQL & Tooling',
    accent: '#f59e0b',
    issuers: [
      {
        name: 'IBM',
        certs: [{ name: 'Python Project for Data Science', year: '2026', img: assetUrl('cert/IBM-Python Project for Data Science.jpg'), url: 'https://coursera.org/verify/8W4VSBH62963', featured: true }],
      },
      {
        name: 'UC Davis',
        certs: [
          { name: 'SQL for Data Science', year: '2026', img: assetUrl('cert/UCDavis-SQL for Data Science.jpg'), url: 'https://coursera.org/verify/7TZJ3NFZIL98', featured: true },
          { name: 'SQL Problem Solving', year: '2026', img: assetUrl('cert/UCDavis-SQL Problem Solving.jpg'), url: 'https://coursera.org/verify/CQP2KZ3GHGBV', featured: true },
        ],
      },
    ],
  },
];

export function getCategoryById(id) {
  return certificationCategories.find((category) => category.id === id) || null;
}

export function getCertificationStats() {
  return certificationCategories.reduce(
    (summary, category) => {
      summary.issuers += category.issuers.length;
      summary.certificates += category.issuers.reduce((count, issuer) => count + issuer.certs.length, 0);
      return summary;
    },
    { categories: certificationCategories.length, issuers: 0, certificates: 0 },
  );
}
