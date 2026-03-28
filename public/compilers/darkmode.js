const themeStorageKey = "compilerTheme";
const darkClass = "dark";

function applyTheme(theme) {
  const body = document.body;
  if (!body) return;

  if (theme === "dark") {
    body.classList.add(darkClass);
  } else {
    body.classList.remove(darkClass);
  }
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function toggleTheme() {
  const body = document.body;
  const nextTheme = body.classList.contains(darkClass) ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(themeStorageKey, nextTheme);
}


document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getPreferredTheme());
  buildCompilerHeader();

  const searchTrigger = document.querySelector("#search");
  if (searchTrigger) {
    searchTrigger.addEventListener("click", () => {
      toggleTheme();
    });
  }
});
