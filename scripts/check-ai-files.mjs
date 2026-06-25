import fs from 'fs';
import path from 'path';

const filesToCheck = [
  { name: 'agents.md', path: path.resolve('agents.md') },
  { name: '.cursorrules', path: path.resolve('.cursorrules') },
  { name: '.windsurfrules', path: path.resolve('.windsurfrules') }
];

console.log('Running AI file integrity checks...');

let hasWarning = false;

// 1. Verify existence of all three files
for (const file of filesToCheck) {
  if (!fs.existsSync(file.path)) {
    console.warn(`[WARNING] AI configuration file missing: ${file.name}`);
    hasWarning = true;
  }
}

if (!hasWarning) {
  const contents = filesToCheck.map(f => ({
    name: f.name,
    content: fs.readFileSync(f.path, 'utf8')
  }));

  // 2. Check if all three files contain the correct version tag
  const versionRegex = /\(v2\.0\.0\)/;
  for (const item of contents) {
    if (!versionRegex.test(item.content)) {
      console.warn(`[WARNING] ${item.name} does not seem to contain the current version tag (v2.0.0)`);
      hasWarning = true;
    }
  }

  // 3. Extract major headers (h1 and h2) from each file
  const getHeaders = (text) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('#') || line.startsWith('##'))
      .map(line => line.replace(/^#+\s*/, '').toLowerCase());
  };

  const headersMap = contents.map(item => ({
    name: item.name,
    headers: getHeaders(item.content)
  }));

  // 4. Compare headers key concepts (Behavioral/Architecture/SEO/Budgets/Quality)
  const requiredKeywords = ['behavioral', 'architecture', 'seo', 'budget', 'quality'];
  
  for (const item of headersMap) {
    const joinedHeaders = item.headers.join(' ');
    for (const keyword of requiredKeywords) {
      const match = item.headers.some(h => h.includes(keyword));
      if (!match) {
        console.warn(`[WARNING] ${item.name} is missing a section covering the key concept: "${keyword}"`);
        hasWarning = true;
      }
    }
  }
}

if (hasWarning) {
  console.log('AI Integrity check completed with warnings. (Gated as warn-only)');
} else {
  console.log('AI Integrity check passed successfully! All AI files are in sync.');
}

// Exit with 0 since this is a warn-only check
process.exit(0);
