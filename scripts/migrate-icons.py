import os, re, urllib.request

astro_files = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.astro'):
            astro_files.append(os.path.join(root, file))

sprite_file = 'public/icons/sprite.svg'
with open(sprite_file, 'r', encoding='utf-8') as f:
    sprite_content = f.read()

sprite_close_idx = sprite_content.rfind('</svg>')
i_tag_pattern = re.compile(r'<i\s+([^>]*)class="([^"]*ph[- ][^"]*)"([^>]*)>\s*</i>', re.IGNORECASE)

new_symbols = ""
downloaded = set()
existing_symbols = set(re.findall(r'<symbol id="([^"]+)"', sprite_content))

def download_icon(weight, name):
    if weight == 'ph': w_path = 'regular'; suffix = ''
    elif weight == 'ph-bold': w_path = 'bold'; suffix = '-bold'
    elif weight == 'ph-fill': w_path = 'fill'; suffix = '-fill'
    elif weight == 'ph-light': w_path = 'light'; suffix = '-light'
    elif weight == 'ph-thin': w_path = 'thin'; suffix = '-thin'
    elif weight == 'ph-duotone': w_path = 'duotone'; suffix = '-duotone'
    else: return None
    
    url = f"https://raw.githubusercontent.com/phosphor-icons/core/main/assets/{w_path}/{name}{suffix}.svg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            svg = response.read().decode('utf-8')
            inner = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.DOTALL | re.IGNORECASE)
            if inner:
                return inner.group(1).strip()
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return None

for file in astro_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    def replacer(match):
        global new_symbols, modified
        pre_class = match.group(1)
        classes = match.group(2)
        post_class = match.group(3)
        
        weight = 'ph'
        name = ''
        other_classes = []
        for c in classes.split():
            if c in ['ph', 'ph-bold', 'ph-fill', 'ph-light', 'ph-thin', 'ph-duotone']:
                weight = c
            elif c.startswith('ph-'):
                name = c[3:]
            else:
                other_classes.append(c)
                
        if not name:
            return match.group(0)
            
        icon_id = f"icon-{name}"
        if weight != 'ph':
            icon_id += f"-{weight.split('-')[1]}"
            
        if icon_id not in existing_symbols and icon_id not in downloaded:
            print(f"Downloading {weight} {name} as {icon_id}...")
            svg_inner = download_icon(weight, name)
            if svg_inner:
                new_symbols += f'  <!-- {name} {weight} -->\n  <symbol id="{icon_id}" viewBox="0 0 256 256">\n    {svg_inner}\n  </symbol>\n'
                downloaded.add(icon_id)
            else:
                print(f"Could not fetch {icon_id}, leaving tag unmodified.")
                return match.group(0)
                
        cls_str = " ".join(other_classes)
        if not 'w-' in cls_str and not 'h-' in cls_str:
            cls_str = f"w-[1em] h-[1em] {cls_str}".strip()
            
        full_attrs = f"{pre_class}class=\"{cls_str}\"{post_class}"
        full_attrs = re.sub(r'\s+', ' ', full_attrs).strip()
        if full_attrs:
            full_attrs = " " + full_attrs
            
        modified = True
        return f'<svg{full_attrs}><use href="/icons/sprite.svg#{icon_id}" /></svg>'

    new_content = i_tag_pattern.sub(replacer, content)
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

if new_symbols:
    sprite_content = sprite_content[:sprite_close_idx] + new_symbols + sprite_content[sprite_close_idx:]
    with open(sprite_file, 'w', encoding='utf-8') as f:
        f.write(sprite_content)
    print("Updated sprite.svg")
else:
    print("No new symbols to add.")
