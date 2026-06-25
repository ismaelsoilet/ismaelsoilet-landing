import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error(`Error: build output directory not found at ${distDir}. Run 'pnpm build' first.`);
  process.exit(1);
}

const checkedLinks = new Set();
let hasError = false;

function checkUrl(urlPath, referrer) {
  // Normalize and remove hash anchors
  const cleanPath = urlPath.split('#')[0];
  
  if (cleanPath === '' || cleanPath.startsWith('http://') || cleanPath.startsWith('https://') || cleanPath.startsWith('//') || cleanPath.startsWith('mailto:') || cleanPath.startsWith('tel:')) {
    return; // Skip external and protocol links
  }

  const checkKey = `${referrer} -> ${cleanPath}`;
  if (checkedLinks.has(checkKey)) return;
  checkedLinks.add(checkKey);

  // Map URL to local file path in dist/
  let filePath = '';
  if (cleanPath === '/' || cleanPath === '') {
    filePath = path.join(distDir, 'index.html');
  } else if (cleanPath.endsWith('/')) {
    filePath = path.join(distDir, cleanPath, 'index.html');
  } else if (path.extname(cleanPath) !== '') {
    // Has file extension (e.g. /feed.xml or /logo.svg)
    filePath = path.join(distDir, cleanPath);
  } else {
    // Clean URLs (e.g. /servicos or /blog/my-post)
    // Could resolve as cleanUrl folder (e.g. /servicos/index.html) or direct file (e.g. /servicos.html)
    const folderPath = path.join(distDir, cleanPath, 'index.html');
    const directFilePath = path.join(distDir, `${cleanPath}.html`);
    if (fs.existsSync(folderPath)) {
      filePath = folderPath;
    } else if (fs.existsSync(directFilePath)) {
      filePath = directFilePath;
    } else {
      filePath = folderPath; // Fallback to check existence of folder path
    }
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Link Error: Broken link "${urlPath}" found in ${path.relative(distDir, referrer)} (Resolved file: ${path.relative(distDir, filePath)})`);
    hasError = true;
  }
}

function scanHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      scanHtmlFiles(res);
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(res, 'utf8');
      
      // Match all href attributes
      const hrefRegex = /href="([^"]+)"/g;
      let match;
      while ((match = hrefRegex.exec(content)) !== null) {
        const hrefValue = match[1];
        // Skip root sprite icon references or visual helper hashes
        if (hrefValue.startsWith('/icons/sprite.svg#') || hrefValue === '#') continue;
        checkUrl(hrefValue, res);
      }
    }
  }
}

console.log('Crawling built pages for broken internal links...');
scanHtmlFiles(distDir);

if (hasError) {
  console.error('Broken links check completed with errors.');
  process.exit(1);
} else {
  console.log('Broken links check passed: all internal links are valid!');
  process.exit(0);
}
