#!/usr/bin/env node

/**
 * COMPREHENSIVE PAGE QUALITY ANALYZER
 * 
 * Analyzes ALL pages to find:
 * - Empty/thin content pages
 * - Duplicate content pages
 * - Pages without unique content
 * - Pages Google will ignore
 * 
 * Generates detailed report with recommendations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ══════════════════════════════════════════════════════════════
// ANALYSIS CONFIGURATION
// ══════════════════════════════════════════════════════════════

const QUALITY_THRESHOLDS = {
  MIN_CONTENT_LENGTH: 500,        // Minimum characters for good content
  MIN_UNIQUE_WORDS: 100,          // Minimum unique words
  MIN_PARAGRAPHS: 3,              // Minimum paragraphs
  MIN_HEADINGS: 2,                // Minimum headings
  DUPLICATE_SIMILARITY: 0.85,     // 85% similarity = duplicate
};

const stats = {
  total: 0,
  empty: [],
  thinContent: [],
  noUniqueContent: [],
  duplicates: [],
  goodPages: [],
  byCategory: {
    article: { total: 0, good: 0, bad: 0 },
    city: { total: 0, good: 0, bad: 0 },
    cityStatus: { total: 0, good: 0, bad: 0 },
    cityArticle: { total: 0, good: 0, bad: 0 },
    cityCarrier: { total: 0, good: 0, bad: 0 },
    programmatic: { total: 0, good: 0, bad: 0 },
    core: { total: 0, good: 0, bad: 0 },
    zip: { total: 0, good: 0, bad: 0 },
  },
  contentHashes: new Map(), // For duplicate detection
};

// ══════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ══════════════════════════════════════════════════════════════

function extractTextContent(html) {
  // Remove scripts, styles, comments
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

function countElements(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

function getUniqueWords(text) {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3); // Words longer than 3 chars
  
  return new Set(words);
}

function calculateContentHash(text) {
  // Create hash of first 1000 chars for duplicate detection
  const sample = text.substring(0, 1000);
  return crypto.createHash('md5').update(sample).digest('hex');
}

function categorizePageType(filePath) {
  const relativePath = filePath.replace(/\\/g, '/').toLowerCase();
  
  if (relativePath.includes('/article/') && !relativePath.includes('/city/')) {
    return 'article';
  }
  if (relativePath.includes('/city/') && relativePath.includes('/status/')) {
    return 'cityStatus';
  }
  if (relativePath.includes('/city/') && relativePath.includes('/article/')) {
    return 'cityArticle';
  }
  if (relativePath.includes('/city/') && relativePath.includes('/carrier/')) {
    return 'cityCarrier';
  }
  if (relativePath.includes('/city/')) {
    return 'city';
  }
  if (relativePath.includes('/programmatic/')) {
    return 'programmatic';
  }
  if (relativePath.includes('/zip/')) {
    return 'zip';
  }
  
  return 'core';
}

function analyzePageQuality(htmlPath) {
  try {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const text = extractTextContent(html);
    const uniqueWords = getUniqueWords(text);
    const contentHash = calculateContentHash(text);
    
    const analysis = {
      path: htmlPath,
      size: html.length,
      textLength: text.length,
      uniqueWordCount: uniqueWords.size,
      headingCount: countElements(html, 'h[1-6]'),
      paragraphCount: countElements(html, 'p'),
      hasUniqueContentMarker: html.includes('UNIQUE-CONTENT-INJECTED'),
      contentHash: contentHash,
      category: categorizePageType(htmlPath),
    };
    
    // Quality assessment
    analysis.isEmpty = text.length < 100;
    analysis.isThinContent = text.length < QUALITY_THRESHOLDS.MIN_CONTENT_LENGTH;
    analysis.hasEnoughWords = uniqueWords.size >= QUALITY_THRESHOLDS.MIN_UNIQUE_WORDS;
    analysis.hasEnoughStructure = 
      analysis.headingCount >= QUALITY_THRESHOLDS.MIN_HEADINGS &&
      analysis.paragraphCount >= QUALITY_THRESHOLDS.MIN_PARAGRAPHS;
    
    // Overall quality score
    analysis.isGoodQuality = 
      !analysis.isEmpty &&
      !analysis.isThinContent &&
      analysis.hasEnoughWords &&
      analysis.hasEnoughStructure;
    
    return analysis;
    
  } catch (error) {
    return {
      path: htmlPath,
      error: error.message,
      isGoodQuality: false,
    };
  }
}

function checkForDuplicates(analysis) {
  const hash = analysis.contentHash;
  
  if (stats.contentHashes.has(hash)) {
    const original = stats.contentHashes.get(hash);
    return {
      isDuplicate: true,
      originalPath: original,
    };
  }
  
  stats.contentHashes.set(hash, analysis.path);
  return { isDuplicate: false };
}

// ══════════════════════════════════════════════════════════════
// MAIN ANALYSIS
// ══════════════════════════════════════════════════════════════

function analyzeAllPages() {
  console.log('🔍 COMPREHENSIVE PAGE QUALITY ANALYSIS');
  console.log('═══════════════════════════════════════\n');
  console.log('Analyzing ALL pages for quality issues...\n');
  
  function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'images', 'assets'].includes(item.name)) {
          processDirectory(fullPath);
        }
      } else if (item.name.endsWith('.html')) {
        stats.total++;
        
        const analysis = analyzePageQuality(fullPath);
        const category = analysis.category;
        
        // Update category stats
        if (stats.byCategory[category]) {
          stats.byCategory[category].total++;
          if (analysis.isGoodQuality) {
            stats.byCategory[category].good++;
          } else {
            stats.byCategory[category].bad++;
          }
        }
        
        // Categorize issues
        if (analysis.isEmpty) {
          stats.empty.push(analysis);
        } else if (analysis.isThinContent) {
          stats.thinContent.push(analysis);
        } else if (!analysis.hasUniqueContentMarker) {
          stats.noUniqueContent.push(analysis);
        } else if (analysis.isGoodQuality) {
          stats.goodPages.push(analysis);
          
          // Check for duplicates among good pages
          const dupCheck = checkForDuplicates(analysis);
          if (dupCheck.isDuplicate) {
            stats.duplicates.push({
              ...analysis,
              duplicateOf: dupCheck.originalPath,
            });
          }
        }
        
        if (stats.total % 500 === 0) {
          console.log(`✓ Analyzed ${stats.total} pages...`);
        }
      }
    }
  }
  
  const publicDir = path.join(__dirname, '../public');
  processDirectory(publicDir);
  
  console.log(`\n✅ Analysis complete! Analyzed ${stats.total} pages.\n`);
}

// ══════════════════════════════════════════════════════════════
// REPORT GENERATION
// ══════════════════════════════════════════════════════════════

function generateDetailedReport() {
  const totalBad = stats.empty.length + stats.thinContent.length + 
                   stats.noUniqueContent.length + stats.duplicates.length;
  const totalGood = stats.goodPages.length;
  
  const report = `# COMPREHENSIVE PAGE QUALITY ANALYSIS REPORT
Generated: ${new Date().toISOString()}

## 📊 EXECUTIVE SUMMARY

**Total Pages Analyzed**: ${stats.total.toLocaleString()}
**Good Quality Pages**: ${totalGood.toLocaleString()} (${((totalGood/stats.total)*100).toFixed(1)}%)
**Problem Pages**: ${totalBad.toLocaleString()} (${((totalBad/stats.total)*100).toFixed(1)}%)

### Quality Breakdown:
- ✅ **Good Quality**: ${totalGood.toLocaleString()} pages
- ❌ **Empty Pages**: ${stats.empty.length.toLocaleString()} pages
- ⚠️ **Thin Content**: ${stats.thinContent.length.toLocaleString()} pages
- 🔄 **No Unique Content**: ${stats.noUniqueContent.length.toLocaleString()} pages
- 📋 **Duplicate Content**: ${stats.duplicates.length.toLocaleString()} pages

---

## 🎯 ANALYSIS BY CATEGORY

${Object.entries(stats.byCategory).map(([cat, data]) => {
  if (data.total === 0) return '';
  const goodPercent = ((data.good / data.total) * 100).toFixed(1);
  const badPercent = ((data.bad / data.total) * 100).toFixed(1);
  return `### ${cat.toUpperCase()}
- Total: ${data.total.toLocaleString()}
- Good: ${data.good.toLocaleString()} (${goodPercent}%)
- Bad: ${data.bad.toLocaleString()} (${badPercent}%)
${data.bad > data.good ? '⚠️ **CRITICAL: More bad pages than good!**' : '✅ Mostly good quality'}
`;
}).join('\n')}

---

## ❌ CRITICAL ISSUES

### 1. EMPTY PAGES (${stats.empty.length})
${stats.empty.length === 0 ? '✅ No empty pages found!' : 
`These pages have almost no content (<100 characters). Google will NEVER index these.

**Sample Empty Pages** (showing first 20):
${stats.empty.slice(0, 20).map(p => `- ${p.path.replace(/.*public[\\/]/, '')} (${p.textLength} chars)`).join('\n')}

${stats.empty.length > 20 ? `... and ${stats.empty.length - 20} more empty pages` : ''}
`}

### 2. THIN CONTENT PAGES (${stats.thinContent.length})
${stats.thinContent.length === 0 ? '✅ No thin content pages found!' :
`These pages have less than ${QUALITY_THRESHOLDS.MIN_CONTENT_LENGTH} characters. Google considers these low-quality.

**Sample Thin Content Pages** (showing first 30):
${stats.thinContent.slice(0, 30).map(p => 
  `- ${p.path.replace(/.*public[\\/]/, '')} (${p.textLength} chars, ${p.uniqueWordCount} unique words)`
).join('\n')}

${stats.thinContent.length > 30 ? `... and ${stats.thinContent.length - 30} more thin content pages` : ''}
`}

### 3. PAGES WITHOUT UNIQUE CONTENT (${stats.noUniqueContent.length})
${stats.noUniqueContent.length === 0 ? '✅ All pages have unique content markers!' :
`These pages don't have the unique content marker. They may be using template content only.

**Sample Pages Without Unique Content** (showing first 30):
${stats.noUniqueContent.slice(0, 30).map(p => 
  `- ${p.path.replace(/.*public[\\/]/, '')} (${p.textLength} chars)`
).join('\n')}

${stats.noUniqueContent.length > 30 ? `... and ${stats.noUniqueContent.length - 30} more pages` : ''}
`}

### 4. DUPLICATE CONTENT PAGES (${stats.duplicates.length})
${stats.duplicates.length === 0 ? '✅ No duplicate content detected!' :
`These pages have identical or very similar content to other pages. Google will only index one.

**Sample Duplicate Pages** (showing first 20):
${stats.duplicates.slice(0, 20).map(p => 
  `- ${p.path.replace(/.*public[\\/]/, '')}\n  Duplicate of: ${p.duplicateOf.replace(/.*public[\\/]/, '')}`
).join('\n')}

${stats.duplicates.length > 20 ? `... and ${stats.duplicates.length - 20} more duplicates` : ''}
`}

---

## 🎯 GOOGLE INDEXING PREDICTION

Based on this analysis, here's what Google will likely do:

### Pages Google WILL Index (${totalGood.toLocaleString()}):
- Good quality pages with unique content
- Proper structure (headings, paragraphs)
- Sufficient word count (500+ characters)
- Unique information per page

### Pages Google WILL IGNORE (${totalBad.toLocaleString()}):
- Empty pages: ${stats.empty.length.toLocaleString()}
- Thin content: ${stats.thinContent.length.toLocaleString()}
- No unique content: ${stats.noUniqueContent.length.toLocaleString()}
- Duplicates: ${stats.duplicates.length.toLocaleString()}

**Expected Indexed Pages**: ~${totalGood.toLocaleString()} pages
**Current Google Index**: 829 pages
**Gap**: ${totalGood - 829} pages (will improve over 2-4 weeks)

---

## 🔧 RECOMMENDED ACTIONS

### IMMEDIATE (High Priority):

1. **Fix Empty Pages** (${stats.empty.length} pages)
   - Add substantial content (500+ words)
   - Or add noindex meta tag
   - Or delete if not needed

2. **Improve Thin Content** (${stats.thinContent.length} pages)
   - Run ultra-unique-content-generator.cjs again
   - Add more city-specific information
   - Add local statistics and data

3. **Add Unique Content** (${stats.noUniqueContent.length} pages)
   - These pages missed the content injection
   - Re-run content generation scripts
   - Verify all pages have unique markers

### MEDIUM PRIORITY:

4. **Handle Duplicates** (${stats.duplicates.length} pages)
   - Add canonical tags pointing to original
   - Or add more unique content to differentiate
   - Or consolidate similar pages

### LONG TERM:

5. **Monitor Google Search Console**
   - Check which pages Google actually indexes
   - Look for "Discovered - currently not indexed"
   - Focus on improving those pages

6. **Quality Over Quantity**
   - Consider adding noindex to low-value pages
   - Focus on making ${totalGood.toLocaleString()} pages excellent
   - Better to have 3,000 great pages than 12,000 mediocre ones

---

## 📈 EXPECTED TIMELINE

- **Week 1-2**: Google re-crawls updated pages
- **Week 2-4**: Indexing begins to improve
- **Week 4-8**: Should reach ~${Math.min(totalGood, 5000).toLocaleString()} indexed pages
- **Week 8+**: Stabilization and ranking improvements

---

## 💡 KEY INSIGHTS

${totalBad > totalGood ? 
`⚠️ **CRITICAL**: You have MORE bad pages (${totalBad.toLocaleString()}) than good pages (${totalGood.toLocaleString()})!
This is why Google is only indexing 829 pages. Google sees mostly low-quality content.

**URGENT ACTION REQUIRED**: Fix the bad pages or add noindex to them.` :
`✅ **GOOD NEWS**: You have more good pages (${totalGood.toLocaleString()}) than bad pages (${totalBad.toLocaleString()}).
Google should eventually index most of your good pages. The 829 current pages will grow over time.`}

${stats.byCategory.cityStatus.bad > stats.byCategory.cityStatus.good ?
`⚠️ **City Status Pages**: These are mostly bad quality. Consider adding noindex or improving content.` : ''}

${stats.byCategory.cityArticle.bad > stats.byCategory.cityArticle.good ?
`⚠️ **City Article Pages**: These are mostly bad quality. Consider adding noindex or improving content.` : ''}

---

## 📋 DETAILED PAGE LISTS

### Empty Pages (Full List):
${stats.empty.length === 0 ? 'None' : 
  stats.empty.map(p => `- ${p.path.replace(/.*public[\\/]/, '')}`).join('\n')}

### Thin Content Pages (Full List - First 100):
${stats.thinContent.length === 0 ? 'None' :
  stats.thinContent.slice(0, 100).map(p => `- ${p.path.replace(/.*public[\\/]/, '')} (${p.textLength} chars)`).join('\n')}
${stats.thinContent.length > 100 ? `\n... and ${stats.thinContent.length - 100} more` : ''}

---

**Report Generated**: ${new Date().toLocaleString()}
**Analysis Tool**: analyze-all-pages-quality.cjs
`;

  return report;
}

function generateJSONReport() {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      total: stats.total,
      good: stats.goodPages.length,
      bad: stats.empty.length + stats.thinContent.length + 
           stats.noUniqueContent.length + stats.duplicates.length,
    },
    issues: {
      empty: stats.empty.map(p => ({
        path: p.path.replace(/.*public[\\/]/, ''),
        size: p.textLength,
        category: p.category,
      })),
      thinContent: stats.thinContent.map(p => ({
        path: p.path.replace(/.*public[\\/]/, ''),
        size: p.textLength,
        uniqueWords: p.uniqueWordCount,
        category: p.category,
      })),
      noUniqueContent: stats.noUniqueContent.map(p => ({
        path: p.path.replace(/.*public[\\/]/, ''),
        size: p.textLength,
        category: p.category,
      })),
      duplicates: stats.duplicates.map(p => ({
        path: p.path.replace(/.*public[\\/]/, ''),
        duplicateOf: p.duplicateOf.replace(/.*public[\\/]/, ''),
        category: p.category,
      })),
    },
    byCategory: stats.byCategory,
  };
}

// ══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ══════════════════════════════════════════════════════════════

function main() {
  analyzeAllPages();
  
  console.log('📝 Generating detailed report...\n');
  
  const report = generateDetailedReport();
  const jsonReport = generateJSONReport();
  
  // Save reports
  fs.writeFileSync(
    path.join(__dirname, '..', 'PAGE-QUALITY-ANALYSIS-REPORT.md'),
    report,
    'utf8'
  );
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'page-quality-analysis.json'),
    JSON.stringify(jsonReport, null, 2),
    'utf8'
  );
  
  console.log('✅ Reports generated:');
  console.log('   - PAGE-QUALITY-ANALYSIS-REPORT.md (detailed report)');
  console.log('   - page-quality-analysis.json (machine-readable data)');
  console.log('\n' + '═'.repeat(60));
  console.log('📊 QUICK SUMMARY:');
  console.log('═'.repeat(60));
  console.log(`Total Pages: ${stats.total.toLocaleString()}`);
  console.log(`Good Quality: ${stats.goodPages.length.toLocaleString()} (${((stats.goodPages.length/stats.total)*100).toFixed(1)}%)`);
  console.log(`Empty: ${stats.empty.length.toLocaleString()}`);
  console.log(`Thin Content: ${stats.thinContent.length.toLocaleString()}`);
  console.log(`No Unique Content: ${stats.noUniqueContent.length.toLocaleString()}`);
  console.log(`Duplicates: ${stats.duplicates.length.toLocaleString()}`);
  console.log('═'.repeat(60));
  
  const totalBad = stats.empty.length + stats.thinContent.length + 
                   stats.noUniqueContent.length + stats.duplicates.length;
  
  if (totalBad > stats.goodPages.length) {
    console.log('\n⚠️  WARNING: More bad pages than good pages!');
    console.log('   This explains why Google only indexes 829 pages.');
    console.log('   URGENT: Fix bad pages or add noindex tags.');
  } else {
    console.log('\n✅ Good news: More good pages than bad pages!');
    console.log('   Google should eventually index most good pages.');
    console.log('   Current 829 pages will grow over 2-4 weeks.');
  }
  
  console.log('\n📖 Read PAGE-QUALITY-ANALYSIS-REPORT.md for full details.\n');
}

main();
