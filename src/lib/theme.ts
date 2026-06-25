// inline script to apply dark/light theme before first paint to prevent Flash of Unstyled Content (FOUC)
export const themeScript = `(function(){const t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}})();`;

export function getTheme() {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  return 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
