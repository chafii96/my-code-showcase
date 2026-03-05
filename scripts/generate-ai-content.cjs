#!/usr/bin/env node
/**
 * AI Content Generator for uspostaltracking.com
 * Generates unique ArticleData content for all slugs missing from articleContent.ts
 * 
 * Usage: 
 *   OPENAI_API_KEY=sk-xxx node scripts/generate-ai-content.cjs
 *   OPENAI_API_KEY=sk-xxx node scripts/generate-ai-content.cjs --slug usps-sunday-delivery-tracking
 *   OPENAI_API_KEY=sk-xxx node scripts/generate-ai-content.cjs --batch 10
 */

const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Config ────────────────────────────────────────────────────
const OUTPUT_DIR = path.join(__dirname, "../src/data/generated-content");
const ARTICLE_CONTENT_PATH = path.join(__dirname, "../src/data/articleContent.ts");
const US_CITIES_PATH = path.join(__dirname, "../src/data/usCities.ts");

// ─── System prompt for human-like content ──────────────────────
const SYSTEM_PROMPT = `You are an expert content writer specializing in USPS shipping and package tracking.
Write in a natural, conversational style:
- Varied sentence lengths, mix short and long
- Use contractions naturally (don't, can't, it's, you'll)
- First-person occasionally ("I've found that...")
- Concrete details and real examples
- Active voice predominantly
- Rhetorical questions occasionally
- AVOID: "In conclusion", "It's worth noting", "Delving into", em-dashes (—)
- Include natural references to uspostaltracking.com as the tracking tool

Output ONLY valid JSON. No markdown, no code fences, no explanation.`;

// ─── Parse existing slugs from articleContentMap ───────────────
function getExistingArticleSlugs() {
  const content = fs.readFileSync(ARTICLE_CONTENT_PATH, "utf-8");
  const slugRegex = /^\s*"([a-z0-9-]+)":\s*\{/gm;
  const slugs = new Set();
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.add(match[1]);
  }
  return slugs;
}

// ─── Parse all article keywords from usCities.ts ───────────────
function getAllArticleKeywords() {
  const content = fs.readFileSync(US_CITIES_PATH, "utf-8");
  const match = content.match(/articleKeywords:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return [];
  const slugRegex = /"([a-z0-9-]+)"/g;
  const keywords = [];
  let m;
  while ((m = slugRegex.exec(match[1])) !== null) {
    keywords.push(m[1]);
  }
  return keywords;
}

// ─── Generate content for a single slug ────────────────────────
async function generateArticle(slug) {
  const humanTitle = slug
    .replace(/-/g, " ")
    .replace(/\busps\b/gi, "USPS")
    .replace(/\b\w/g, c => c.toUpperCase());

  const prompt = `Generate a comprehensive article about "${humanTitle}" for uspostaltracking.com.

Return a JSON object with this exact structure:
{
  "title": "SEO title under 60 chars with (2026)",
  "metaDescription": "Meta description under 160 chars, compelling, includes main keyword",
  "h1": "H1 heading, slightly different from title",
  "intro": "200-300 word intro paragraph, engaging, includes the keyword naturally",
  "sections": [
    { "heading": "Section H2 heading", "content": "300-500 word section content" },
    { "heading": "...", "content": "..." }
  ],
  "faq": [
    { "q": "Question?", "a": "Detailed answer 2-3 sentences" }
  ],
  "keywords": ["primary keyword", "variation 1", "variation 2", "variation 3", "variation 4", "keyword 2026"]
}

Requirements:
- 6 unique sections with H2 headings
- 5 FAQ items
- 6 keywords (include a "2026" variant)
- Mention uspostaltracking.com naturally in intro and at least 2 sections
- Include specific USPS phone numbers, URLs, and real service details
- Content must be genuinely helpful and informative`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  return JSON.parse(raw);
}

// ─── Convert article JSON to TypeScript string ─────────────────
function articleToTS(slug, article) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  
  let ts = `  "${slug}": {\n`;
  ts += `    title: "${esc(article.title)}",\n`;
  ts += `    metaDescription: "${esc(article.metaDescription)}",\n`;
  ts += `    h1: "${esc(article.h1)}",\n`;
  ts += `    intro: "${esc(article.intro)}",\n`;
  ts += `    sections: [\n`;
  for (const s of article.sections) {
    ts += `      { heading: "${esc(s.heading)}", content: "${esc(s.content)}" },\n`;
  }
  ts += `    ],\n`;
  ts += `    faq: [\n`;
  for (const f of article.faq) {
    ts += `      { q: "${esc(f.q)}", a: "${esc(f.a)}" },\n`;
  }
  ts += `    ],\n`;
  ts += `    keywords: [${article.keywords.map(k => `"${esc(k)}"`).join(", ")}],\n`;
  ts += `  },\n`;
  return ts;
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const singleSlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
  const batchSize = args.includes("--batch") ? parseInt(args[args.indexOf("--batch") + 1]) : Infinity;

  console.log("🤖 AI Content Generator for uspostaltracking.com");
  console.log("================================================\n");

  // Find missing slugs
  const allKeywords = getAllArticleKeywords();
  const existingSlugs = getExistingArticleSlugs();
  
  let missingSlugs;
  if (singleSlug) {
    missingSlugs = [singleSlug];
    console.log(`🎯 Generating single article: ${singleSlug}\n`);
  } else {
    missingSlugs = allKeywords.filter(k => !existingSlugs.has(k));
    console.log(`📊 Total keywords: ${allKeywords.length}`);
    console.log(`✅ Already have content: ${existingSlugs.size}`);
    console.log(`❌ Missing content: ${missingSlugs.length}`);
    if (batchSize < Infinity) {
      missingSlugs = missingSlugs.slice(0, batchSize);
      console.log(`📦 Batch size: ${batchSize}`);
    }
    console.log("");
  }

  if (missingSlugs.length === 0) {
    console.log("🎉 All articles have content! Nothing to generate.");
    return;
  }

  // Create output dir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate articles
  const generated = [];
  let tsOutput = "";

  for (let i = 0; i < missingSlugs.length; i++) {
    const slug = missingSlugs[i];
    console.log(`📝 [${i + 1}/${missingSlugs.length}] Generating: ${slug}`);
    
    try {
      const article = await generateArticle(slug);
      
      // Save individual JSON
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `article-${slug}.json`),
        JSON.stringify({ slug, ...article }, null, 2)
      );
      
      // Accumulate TypeScript
      tsOutput += "\n" + articleToTS(slug, article);
      generated.push(slug);
      
      console.log(`   ✅ Done (${article.sections.length} sections, ${article.faq.length} FAQs)`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
    
    // Rate limit: 1.5s between requests
    if (i < missingSlugs.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Save combined TypeScript snippet
  if (tsOutput) {
    const tsFile = path.join(OUTPUT_DIR, "generated-articles.ts.txt");
    const header = `// Generated ${new Date().toISOString()}\n// ${generated.length} articles\n// Copy these entries into articleContentMap in src/data/articleContent.ts\n\n`;
    fs.writeFileSync(tsFile, header + tsOutput);
    console.log(`\n📄 TypeScript snippet saved: ${tsFile}`);
  }

  // Summary
  console.log("\n================================================");
  console.log(`🎉 Generated ${generated.length}/${missingSlugs.length} articles`);
  console.log(`📁 JSON files: ${OUTPUT_DIR}/`);
  console.log(`📋 TypeScript: ${OUTPUT_DIR}/generated-articles.ts.txt`);
  console.log("\n📌 Next steps:");
  console.log("   1. Review generated-articles.ts.txt");
  console.log("   2. Copy entries into src/data/articleContent.ts");
  console.log("   3. Build and deploy");
}

main().catch(console.error);
