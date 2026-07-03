// inline script to apply dark/light theme before first paint to prevent Flash of Unstyled Content (FOUC)
// Dark is the default (premium aesthetic); light is opt-in via the toggle.
export const themeScript = `(function(){const t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}})();`;

export function getTheme() {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  return 'dark';
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
