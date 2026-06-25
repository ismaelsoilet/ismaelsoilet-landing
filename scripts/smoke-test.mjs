import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error(`Error: build output directory not found at ${distDir}. Run 'pnpm build' first.`);
  process.exit(1);
}

// Inline script content to check for
const expectedScript = 'localStorage.getItem("theme")';

function checkHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let hasError = false;

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      hasError = checkHtmlFiles(res) || hasError;
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(res, 'utf8');
      
      // Look for the script. Since it's inlined, it should be present in the HTML.
      if (!content.includes(expectedScript)) {
        console.error(`Smoke test failed: ${path.relative(distDir, res)} does not contain the inlined theme script.`);
        hasError = true;
      }
    }
  }

  return hasError;
}

console.log('Running build smoke test for inlined theme script...');
const hasFoucFixError = checkHtmlFiles(distDir);

if (hasFoucFixError) {
  console.error('Smoke test completed with errors.');
  process.exit(1);
} else {
  console.log('Smoke test passed: inlined theme script found in all HTML files.');
  process.exit(0);
}
