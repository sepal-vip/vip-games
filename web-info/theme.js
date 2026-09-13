// web-info/theme.js

// 1. Apply theme immediately to avoid screen flash
const htmlElement = document.documentElement;
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

// 2. Attach button listener once the page loads
window.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (themeToggle && themeIcon) {
        // Set initial icon state
        themeIcon.textContent = htmlElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        
        themeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            if (htmlElement.classList.contains('dark')) {
                localStorage.theme = 'dark';
                themeIcon.textContent = 'light_mode';
            } else {
                localStorage.theme = 'light';
                themeIcon.textContent = 'dark_mode';
            }
        });
    }
});