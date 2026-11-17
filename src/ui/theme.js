export function initTheme() {
  // Detectar preferencia del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Cargar preferencia guardada o usar preferencia del sistema
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  applyTheme(theme);
  
  // Escuchar cambios en la preferencia del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Crear botón de toggle
  createThemeToggle(theme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
}

function createThemeToggle(currentTheme) {
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Cambiar tema');
  toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    toggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  });
  
  document.body.appendChild(toggle);
}
