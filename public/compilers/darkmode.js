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

function buildSearchUI() {
  const searchContainer = document.querySelector("#search");
  if (!searchContainer) return;

  // create search input and results container
  searchContainer.classList.add("search-ui");
  searchContainer.innerHTML = `
    <img id="search-icon" src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Search" title="Search languages" />
    <input id="lang-search-input" type="text" placeholder="Search languages..." autocomplete="off" />
    <div id="lang-search-results" class="search-results"></div>
    <button id="theme-toggle" title="Toggle dark/light mode">☀️</button>
  `;

  const searchIcon = document.querySelector("#search-icon");
  const searchInput = document.querySelector("#lang-search-input");
  const searchResults = document.querySelector("#lang-search-results");

  const langTiles = Array.from(document.querySelectorAll("#langlist a, #langlist > img"));

  function closeResults() {
    searchResults.classList.remove("active");
  }

  function openInput() {
    searchInput.classList.add("active");
    searchInput.focus();
  }

  function getLanguageItems() {
    return langTiles
      .map((tile) => {
        let text = "";
        let href = "";

        if (tile.tagName.toLowerCase() === "a") {
          const img = tile.querySelector("img");
          text = (img && img.alt) ? img.alt : (tile.textContent || "");
          href = tile.getAttribute("href") || "";
        } else if (tile.tagName.toLowerCase() === "img") {
          text = tile.alt || tile.title || "";
          href = "";
        }

        text = text.toString().trim();

        return { tile, text, href };
      })
      .filter((item) => item.text);
  }

  function filterLanguages(query) {
    const value = (query || "").trim().toLowerCase();
    searchResults.innerHTML = "";
    if (!value) {
      closeResults();
      return;
    }

    const languageItems = getLanguageItems();

    const matches = languageItems.filter((item) => item.text.toLowerCase().includes(value));

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="result-item">No matching language found</div>`;
      searchResults.classList.add("active");
      return;
    }

    for (const match of matches.slice(0, 8)) {
      const item = document.createElement("div");
      item.className = "result-item";
      item.textContent = match.text || "(unknown)";
      item.addEventListener("click", () => {
        if (match.href) {
          window.location.href = match.href;
        } else {
          match.tile.scrollIntoView({ behavior: "smooth", inline: "center" });
          match.tile.style.outline = "3px solid #2a9df4";
          setTimeout(() => {
            match.tile.style.outline = "";
          }, 1400);
        }
      });
      searchResults.appendChild(item);
    }

    searchResults.classList.add("active");
  }

  searchIcon.addEventListener("click", () => {
    if (searchInput.classList.contains("active") && searchInput.value.trim()) {
      filterLanguages(searchInput.value);
    } else {
      openInput();
      searchResults.classList.remove("active");
    }
  });

  searchInput.addEventListener("input", (event) => {
    filterLanguages(event.target.value);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      closeResults();
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchContainer.contains(event.target)) {
      closeResults();
    }
  });

  const themeToggleBtn = document.querySelector("#theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", (event) => {
      event.preventDefault();
      toggleTheme();
      themeToggleBtn.textContent = document.body.classList.contains(darkClass) ? "🌙" : "☀️";
    });

    themeToggleBtn.textContent = document.body.classList.contains(darkClass) ? "🌙" : "☀️";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getPreferredTheme());
  buildSearchUI();
});
