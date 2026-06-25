import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const siteConfigPath = path.resolve('src/content/site.ts');

if (!fs.existsSync(distDir)) {
  console.error(`Error: build output directory not found at ${distDir}. Run 'pnpm build' first.`);
  process.exit(1);
}

if (!fs.existsSync(siteConfigPath)) {
  console.error(`Error: site config not found at ${siteConfigPath}.`);
  process.exit(1);
}

// Simple parser to extract tracking values from site.ts
const siteContent = fs.readFileSync(siteConfigPath, 'utf8');

function extractField(fieldName) {
  const regex = new RegExp(`${fieldName}\\s*:\\s*["']([^"']*)["']`);
  const match = siteContent.match(regex);
  return match ? match[1].trim() : '';
}

const gtmId = extractField('gtmId');
const metaPixelId = extractField('metaPixelId');
const hotjarId = extractField('hotjarId');
const clarityId = extractField('clarityId');
const webVitalsEndpoint = extractField('webVitalsEndpoint');

const hasTracking = !!(gtmId || metaPixelId || hotjarId || clarityId || webVitalsEndpoint);

console.log('Tracking configuration detected:');
console.log(`- GTM ID: "${gtmId}"`);
console.log(`- Meta Pixel ID: "${metaPixelId}"`);
console.log(`- Hotjar ID: "${hotjarId}"`);
console.log(`- Clarity ID: "${clarityId}"`);
console.log(`- Web Vitals Endpoint: "${webVitalsEndpoint}"`);
console.log(`Tracking is enabled: ${hasTracking}`);

let hasError = false;

function checkHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      checkHtmlFiles(res);
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(res, 'utf8');
      
      // If tracking is disabled, we should not have any Partytown tags or our tracking logic
      if (!hasTracking) {
        if (content.includes('<script type="text/partytown"') || content.includes('__tracking_injected')) {
          console.error(`Error: ${path.relative(distDir, res)} contains tracking scripts or Partytown tags even though tracking is disabled.`);
          hasError = true;
        }
      }
    }
  }
}

console.log('Running build-time guard check-tracking...');
checkHtmlFiles(distDir);

if (hasError) {
  console.error('check-tracking failed.');
  process.exit(1);
} else {
  console.log('check-tracking passed successfully!');
  process.exit(0);
}
