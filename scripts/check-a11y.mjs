import { execSync } from 'child_process';

console.log('Running Accessibility audits with @axe-core/cli on dist/...');

// Check if chrome/chromium binary is available in PATH
let hasChrome = false;
try {
  execSync('which google-chrome || which chromium || which google-chrome-stable || which chromium-browser || which microsoft-edge', { stdio: 'ignore' });
  hasChrome = true;
} catch (e) {
  // Chrome binary not found
}

if (!hasChrome) {
  console.warn('\x1b[33m%s\x1b[0m', 'Warning: Skipping accessibility CLI checks because Chrome/Chromium binary was not found in the PATH.');
  console.warn('To run accessibility audits locally, please install Google Chrome or Chromium.');
  process.exit(0);
}

try {
  // Execute axe CLI against all compiled html files
  execSync('npx axe "dist/**/*.html" --exit', { stdio: 'inherit' });
  console.log('Accessibility audits completed successfully.');
  process.exit(0);
} catch (err) {
  console.error('Accessibility audit failed. Please review the errors listed above.');
  process.exit(1);
}
