const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }));
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
const appGrid = document.querySelector("#app-grid");
const appCards = appGrid ? [...appGrid.querySelectorAll(".app-card")] : [];
const filterInputs = [...document.querySelectorAll(".app-filter")];
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const resetFilters = document.querySelector("#reset-filters");
const resetEmpty = document.querySelector("#reset-empty");
const sortSelect = document.querySelector("#app-sort");
function filterApps() {
  if (!appGrid) return;
  const query = (appSearch?.value || "").trim().toLowerCase();
  const selected = (type) => filterInputs.filter((input) => input.dataset.filterType === type && input.checked).map((input) => input.value);
  const categories = selected("category"), industries = selected("industry"), availability = selected("availability");
  let visible = 0;
  appCards.forEach((card) => {
    const matches = (!categories.length || categories.includes(card.dataset.category)) &&
      (!industries.length || industries.includes(card.dataset.industry)) &&
      (!availability.length || availability.includes(card.dataset.availability)) &&
      (!query || (card.dataset.search + " " + card.textContent).toLowerCase().includes(query));
    card.hidden = !matches;
    if (matches) visible++;
  });
  if (resultsCount) resultsCount.textContent = "Showing " + visible + " of " + appCards.length + " sample concepts";
  if (emptyState) emptyState.hidden = visible !== 0;
}
function resetAppFilters() {
  if (appSearch) appSearch.value = "";
  filterInputs.forEach((input) => { input.checked = false; });
  if (sortSelect) sortSelect.value = "featured";
  if (appGrid) appCards.forEach((card) => appGrid.appendChild(card));
  filterApps();
}
filterInputs.forEach((input) => input.addEventListener("change", filterApps));
if (appSearch) {
  appSearch.addEventListener("input", filterApps);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
      event.preventDefault(); appSearch.focus();
    }
  });
}
if (sortSelect && appGrid) sortSelect.addEventListener("change", () => {
  const sorted = [...appCards].sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
  if (sortSelect.value === "featured") appCards.forEach((card) => appGrid.appendChild(card));
  else (sortSelect.value === "za" ? sorted.reverse() : sorted).forEach((card) => appGrid.appendChild(card));
  filterApps();
});
if (resetFilters) resetFilters.addEventListener("click", resetAppFilters);
if (resetEmpty) resetEmpty.addEventListener("click", resetAppFilters);