import fs from 'fs';
import path from 'path';

const spritePath = path.resolve('public/icons/sprite.svg');
if (!fs.existsSync(spritePath)) {
  console.error(`Sprite not found at ${spritePath}`);
  process.exit(1);
}
const spriteContent = fs.readFileSync(spritePath, 'utf8');

// Get all symbol IDs from the sprite
const symbolRegex = /<symbol\s+[^>]*id="([^"]+)"/g;
const symbols = new Set();
let match;
while ((match = symbolRegex.exec(spriteContent)) !== null) {
  symbols.add(match[1]);
}

console.log(`Found ${symbols.size} symbols in sprite.svg:`, Array.from(symbols).join(', '));

// Scan src folder recursively using native readdirSync
function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(res));
    } else if (/\.(astro|mdx|html|js|ts)$/.test(entry.name)) {
      files.push(res);
    }
  }
  return files;
}

const srcDir = path.resolve('src');
let hasError = false;

if (fs.existsSync(srcDir)) {
  const files = getFiles(srcDir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const useRegex = /href="[^"]*sprite\.svg#([^"\}]+)"/g;
    let useMatch;
    while ((useMatch = useRegex.exec(content)) !== null) {
      const iconName = useMatch[1];
      if (!symbols.has(iconName)) {
        console.error(`Error in ${path.relative(process.cwd(), file)}: Icon "${iconName}" referenced but not found in sprite.svg`);
        hasError = true;
      }
    }
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('All referenced icons are valid!');
  process.exit(0);
}
