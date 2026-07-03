import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error(`Error: build output directory not found at ${distDir}. Run 'pnpm build' first.`);
  process.exit(1);
}

let hasError = false;

// 1. Assert AIO files exist
const llmsPath = path.join(distDir, 'llms.txt');
const llmsFullPath = path.join(distDir, 'llms-full.txt');

if (!fs.existsSync(llmsPath)) {
  console.error('QA Error: llms.txt is missing from dist/.');
  hasError = true;
} else {
  const content = fs.readFileSync(llmsPath, 'utf8');
  // Check for placeholders
  const placeholders = ['Lorem', 'TODO', 'FIXME', '[CLIENTE]', '[PLACEHOLDER]'];
  for (const placeholder of placeholders) {
    if (content.toLowerCase().includes(placeholder.toLowerCase())) {
      console.error(`QA Error: llms.txt contains placeholder text "${placeholder}".`);
      hasError = true;
    }
  }
}

if (!fs.existsSync(llmsFullPath)) {
  console.error('QA Error: llms-full.txt is missing from dist/.');
  hasError = true;
}

// 2. Validate Sitemap indexation exclusions (noindex pages must be excluded)
const sitemapPath = path.join(distDir, 'sitemap-0.xml');
if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const excludedPaths = ['/privacidade', '/termos', '/components', '/quickstart'];
  for (const exPath of excludedPaths) {
    if (content.includes(exPath)) {
      console.error(`QA Error: sitemap-0.xml contains noindex path "${exPath}".`);
      hasError = true;
    }
  }
}

// 3. Scan HTML files for structured schemas
function scanHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      scanHtml(res);
    } else if (entry.name.endsWith('.html')) {
      const relativePath = path.relative(distDir, res);
      const content = fs.readFileSync(res, 'utf8');

      // Skip 404 page for standard schema checks
      if (entry.name === '404.html') continue;

      // Assert Organization JSON-LD exists on all pages
      if (!content.includes('"@type": "Organization"') && !content.includes('"@type":"Organization"')) {
        console.error(`QA Error: ${relativePath} is missing Organization JSON-LD.`);
        hasError = true;
      }

      // Assert WebPage or ProfilePage JSON-LD exists on all pages
      const hasWebPage = content.includes('"@type": "WebPage"') || content.includes('"@type":"WebPage"') ||
                         content.includes('"@type": "ProfilePage"') || content.includes('"@type":"ProfilePage"') ||
                         content.includes('"ProfilePage"');
      if (!hasWebPage) {
        console.error(`QA Error: ${relativePath} is missing WebPage or ProfilePage JSON-LD.`);
        hasError = true;
      }

      // Blog posting schemas
      if (relativePath.startsWith('blog/') && relativePath !== 'blog/index.html') {
        if (!content.includes('"@type": "BlogPosting"') && !content.includes('"@type":"BlogPosting"')) {
          console.error(`QA Error: Blog post ${relativePath} is missing BlogPosting JSON-LD.`);
          hasError = true;
        }

        // Check if "como-" guides have HowTo schema
        if (relativePath.includes('como-')) {
          if (!content.includes('"@type": "HowTo"') && !content.includes('"@type":"HowTo"')) {
            console.error(`QA Error: "como-" blog post ${relativePath} is missing HowTo JSON-LD.`);
            hasError = true;
          }
        }
      }
    }
  }
}

console.log('Running SEO and Structured Schema QA checks...');
scanHtml(distDir);

if (hasError) {
  console.error('SEO/Schema QA checks completed with errors.');
  process.exit(1);
} else {
  console.log('SEO/Schema QA checks passed successfully!');
  process.exit(0);
}
