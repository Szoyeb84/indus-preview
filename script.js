const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const appSearch = document.querySelector("#app-search");
const appCards = [...document.querySelectorAll(".app-card")];
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const resetFilters = document.querySelector("#reset-filters");
let activeCategory = "all";

function filterApps() {
  const query = (appSearch?.value || "").trim().toLowerCase();
  let visible = 0;
  appCards.forEach((card) => {
    const categoryMatches = activeCategory === "all" || card.dataset.category === activeCategory;
    const searchMatches = !query || (card.dataset.search + " " + card.textContent).toLowerCase().includes(query);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible++;
  });
  if (resultsCount) resultsCount.textContent = `Showing ${visible} of ${appCards.length} sample concepts`;
  if (emptyState) emptyState.hidden = visible !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter || "all";
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    filterApps();
  });
});

if (appSearch) {
  appSearch.addEventListener("input", filterApps);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      appSearch.focus();
    }
  });
}
if (resetFilters) {
  resetFilters.addEventListener("click", () => {
    activeCategory = "all";
    if (appSearch) appSearch.value = "";
    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === "all";
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    filterApps();
  });
}
