/**
 * Admin Dashboard — Data, Types, and Tool Definitions
 * لوحة تحكم المشرف — البيانات والأنواع وتعريفات الأدوات
 */

export type ToolStatus = 'idle' | 'running' | 'success' | 'error';
export type ToolCategory = 'indexing' | 'seo' | 'content' | 'linkbuilding' | 'monitoring' | 'social' | 'technical';

export interface AdminTool {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: ToolCategory;
  script: string;
  icon: string;
  dangerous?: boolean;
  requiresConfirm?: boolean;
  estimatedTime?: string;
  lastRun?: string;
  status?: ToolStatus;
  output?: string;
  params?: ToolParam[];
}

export interface ToolParam {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  default?: string | number | boolean;
  options?: string[];
  required?: boolean;
}

export interface DashboardStats {
  totalPages: number;
  totalUrls: number;
  sitemapCount: number;
  articlesCount: number;
  citiesCount: number;
  statusPagesCount: number;
  programmaticPages: number;
  buildStatus: 'passing' | 'failing' | 'unknown';
  lastBuild: string;
  lastDeploy: string;
}

// ============================================================
// ALL ADMIN TOOLS
// ============================================================

export const ADMIN_TOOLS: AdminTool[] = [
  // ── INDEXING TOOLS ──
  {
    id: 'indexing-master',
    name: 'Indexing Master',
    nameAr: 'مدير الأرشفة الشامل',
    description: 'Validate all sitemaps, update robots.txt, and ping IndexNow',
    descriptionAr: 'التحقق من جميع Sitemaps، تحديث robots.txt، وإرسال IndexNow ping',
    category: 'indexing',
    script: 'node scripts/indexing-master.cjs',
    icon: '🗺️',
    estimatedTime: '10 ثوانٍ',
  },
  {
    id: 'ping-indexnow',
    name: 'IndexNow Ping',
    nameAr: 'إرسال IndexNow',
    description: 'Ping Google, Bing, and Yandex with all updated URLs',
    descriptionAr: 'إرسال إشعار لـ Google وBing وYandex بجميع الصفحات المحدّثة',
    category: 'indexing',
    script: 'node scripts/ping-indexnow.js',
    icon: '📡',
    estimatedTime: '5 ثوانٍ',
  },
  {
    id: 'sitemap-update',
    name: 'Sitemap Auto-Update',
    nameAr: 'تحديث Sitemap تلقائياً',
    description: 'Regenerate all sitemaps with fresh dates and new URLs',
    descriptionAr: 'إعادة توليد جميع Sitemaps بتواريخ جديدة وروابط محدّثة',
    category: 'indexing',
    script: 'node scripts/sitemap-update.js',
    icon: '🔄',
    estimatedTime: '15 ثانية',
  },
  {
    id: 'generate-sitemap-massive',
    name: 'Generate Massive Sitemap',
    nameAr: 'توليد Sitemap ضخم',
    description: 'Generate sitemaps for all 5000+ pages',
    descriptionAr: 'توليد Sitemaps لجميع الصفحات (أكثر من 5000 صفحة)',
    category: 'indexing',
    script: 'node scripts/generate-sitemap-massive.cjs',
    icon: '📊',
    estimatedTime: '30 ثانية',
  },

  // ── SEO TOOLS ──
  {
    id: 'seo-audit',
    name: 'SEO Audit',
    nameAr: 'فحص SEO الشامل',
    description: 'Run complete SEO audit across all pages',
    descriptionAr: 'تشغيل فحص SEO شامل على جميع الصفحات',
    category: 'seo',
    script: 'node scripts/seo-audit.js',
    icon: '🔍',
    estimatedTime: '20 ثانية',
  },
  {
    id: 'seo-monitor',
    name: 'SEO Monitor',
    nameAr: 'مراقب SEO',
    description: 'Monitor rankings and track keyword positions',
    descriptionAr: 'مراقبة التصنيفات وتتبع مواضع الكلمات المفتاحية',
    category: 'seo',
    script: 'node scripts/seo-monitor.js',
    icon: '📈',
    estimatedTime: '30 ثانية',
  },

  // ── CONTENT TOOLS ──
  {
    id: 'generate-ai-content',
    name: 'AI Content Generator',
    nameAr: 'مولّد المحتوى بالذكاء الاصطناعي',
    description: 'Generate new SEO-optimized articles using AI',
    descriptionAr: 'توليد مقالات جديدة محسّنة لمحركات البحث باستخدام الذكاء الاصطناعي',
    category: 'content',
    script: 'node scripts/generate-ai-content.js',
    icon: '🤖',
    estimatedTime: '2-5 دقائق',
    params: [
      { name: 'topic', label: 'موضوع المقال', type: 'text', required: true },
      { name: 'count', label: 'عدد المقالات', type: 'number', default: 5 },
    ]
  },
  {
    id: 'programmatic-seo',
    name: 'Programmatic SEO Generator',
    nameAr: 'مولّد صفحات SEO البرمجي',
    description: 'Generate thousands of city×status and city×article pages',
    descriptionAr: 'توليد آلاف صفحات المدن × الحالات والمدن × المقالات',
    category: 'content',
    script: 'node scripts/programmatic-seo-generator.cjs',
    icon: '🏭',
    estimatedTime: '30 ثانية',
  },

  // ── LINK BUILDING TOOLS ──
  {
    id: 'web2-link-builder',
    name: 'Web 2.0 Link Builder',
    nameAr: 'بناء روابط Web 2.0',
    description: 'Generate link building plan for 20 Web 2.0 platforms',
    descriptionAr: 'توليد خطة بناء روابط على 20 منصة Web 2.0',
    category: 'linkbuilding',
    script: 'python3 seo-infrastructure/link-building/web2-link-builder.py',
    icon: '🔗',
    estimatedTime: '5 ثوانٍ',
  },
  {
    id: 'tier1-link-builder',
    name: 'Tier 1 Link Builder',
    nameAr: 'بناء روابط الطبقة الأولى',
    description: 'Build high-quality Tier 1 backlinks',
    descriptionAr: 'بناء روابط خلفية عالية الجودة من الطبقة الأولى',
    category: 'linkbuilding',
    script: 'python3 seo-infrastructure/link-building/tier1_link_builder.py',
    icon: '⭐',
    estimatedTime: '10 ثوانٍ',
    dangerous: true,
    requiresConfirm: true,
  },
  {
    id: 'blog-comment-spammer',
    name: 'Blog Comment Spammer',
    nameAr: 'نشر تعليقات المدونات',
    description: 'Post comments on relevant blogs with backlinks',
    descriptionAr: 'نشر تعليقات على المدونات ذات الصلة مع روابط خلفية',
    category: 'linkbuilding',
    script: 'python3 seo-infrastructure/link-building/blog_comment_spammer.py',
    icon: '💬',
    estimatedTime: '5 دقائق',
    dangerous: true,
    requiresConfirm: true,
  },

  // ── SOCIAL SIGNALS ──
  {
    id: 'reddit-bot',
    name: 'Reddit Signal Bot',
    nameAr: 'بوت Reddit',
    description: 'Post and upvote content on Reddit for social signals',
    descriptionAr: 'نشر المحتوى والتصويت على Reddit لإشارات اجتماعية',
    category: 'social',
    script: 'python3 seo-infrastructure/social-signals/reddit_bot.py',
    icon: '🤖',
    estimatedTime: '2 دقيقة',
    dangerous: true,
    requiresConfirm: true,
  },
  {
    id: 'pinterest-bot',
    name: 'Pinterest Signal Bot',
    nameAr: 'بوت Pinterest',
    description: 'Create pins and boards on Pinterest',
    descriptionAr: 'إنشاء دبابيس ولوحات على Pinterest',
    category: 'social',
    script: 'python3 seo-infrastructure/social-signals/pinterest_bot.py',
    icon: '📌',
    estimatedTime: '3 دقائق',
    dangerous: true,
    requiresConfirm: true,
  },
  {
    id: 'quora-bot',
    name: 'Quora Answer Bot',
    nameAr: 'بوت إجابات Quora',
    description: 'Answer USPS questions on Quora with links',
    descriptionAr: 'الإجابة على أسئلة USPS في Quora مع روابط',
    category: 'social',
    script: 'python3 seo-infrastructure/social-signals/quora_bot.py',
    icon: '❓',
    estimatedTime: '5 دقائق',
    dangerous: true,
    requiresConfirm: true,
  },
  {
    id: 'twitter-bot',
    name: 'Twitter/X Signal Bot',
    nameAr: 'بوت Twitter/X',
    description: 'Post USPS tracking content on Twitter/X',
    descriptionAr: 'نشر محتوى USPS tracking على Twitter/X',
    category: 'social',
    script: 'python3 seo-infrastructure/social-signals/twitter_bot.py',
    icon: '🐦',
    estimatedTime: '2 دقيقة',
    dangerous: true,
    requiresConfirm: true,
  },
  {
    id: 'facebook-bot',
    name: 'Facebook Signal Bot',
    nameAr: 'بوت Facebook',
    description: 'Share content in Facebook groups',
    descriptionAr: 'مشاركة المحتوى في مجموعات Facebook',
    category: 'social',
    script: 'python3 seo-infrastructure/social-signals/facebook_bot.py',
    icon: '👍',
    estimatedTime: '3 دقائق',
    dangerous: true,
    requiresConfirm: true,
  },

  // ── MONITORING TOOLS ──
  {
    id: 'competitor-monitor',
    name: 'Competitor Monitor',
    nameAr: 'مراقب المنافسين',
    description: 'Monitor competitor rankings and backlinks',
    descriptionAr: 'مراقبة تصنيفات المنافسين وروابطهم الخلفية',
    category: 'monitoring',
    script: 'python3 seo-infrastructure/negative-seo/competitor-monitor.py',
    icon: '👁️',
    estimatedTime: '30 ثانية',
  },
  {
    id: 'ctr-bot',
    name: 'CTR Manipulation Bot',
    nameAr: 'بوت التلاعب بـ CTR',
    description: 'Simulate organic clicks to boost CTR signals',
    descriptionAr: 'محاكاة النقرات العضوية لتعزيز إشارات CTR',
    category: 'monitoring',
    script: 'python3 seo-infrastructure/ctr-manipulation/bot_traffic_simulator.py',
    icon: '🖱️',
    estimatedTime: '10 دقائق',
    dangerous: true,
    requiresConfirm: true,
  },

  // ── TECHNICAL TOOLS ──
  {
    id: 'backup-deploy',
    name: 'Backup & Deploy',
    nameAr: 'نسخ احتياطي ونشر',
    description: 'Create backup and deploy to production',
    descriptionAr: 'إنشاء نسخة احتياطية ونشر على الإنتاج',
    category: 'technical',
    script: 'bash scripts/backup-and-deploy.sh',
    icon: '🚀',
    estimatedTime: '2-5 دقائق',
    requiresConfirm: true,
  },
];

// ============================================================
// DASHBOARD STATS (Static/Mock for frontend)
// ============================================================

export const DASHBOARD_STATS: DashboardStats = {
  totalPages: 25,
  totalUrls: 5147,
  sitemapCount: 11,
  articlesCount: 125,
  citiesCount: 200,
  statusPagesCount: 51,
  programmaticPages: 600,
  buildStatus: 'passing',
  lastBuild: new Date().toISOString(),
  lastDeploy: new Date().toISOString(),
};

// ============================================================
// CATEGORY LABELS
// ============================================================

export const CATEGORY_LABELS: Record<ToolCategory, { label: string; labelAr: string; color: string }> = {
  indexing: { label: 'Indexing', labelAr: 'أرشفة', color: 'bg-blue-500' },
  seo: { label: 'SEO', labelAr: 'تحسين محركات البحث', color: 'bg-green-500' },
  content: { label: 'Content', labelAr: 'محتوى', color: 'bg-purple-500' },
  linkbuilding: { label: 'Link Building', labelAr: 'بناء روابط', color: 'bg-orange-500' },
  monitoring: { label: 'Monitoring', labelAr: 'مراقبة', color: 'bg-yellow-500' },
  social: { label: 'Social Signals', labelAr: 'إشارات اجتماعية', color: 'bg-pink-500' },
  technical: { label: 'Technical', labelAr: 'تقني', color: 'bg-gray-500' },
};
