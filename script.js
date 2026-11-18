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
/* Store category shortcuts and app concept details */
const detailModal=document.querySelector("#app-detail-modal");
const detailTitle=document.querySelector("#detail-title");
const detailDescription=document.querySelector("#detail-description");
const detailCategory=document.querySelector("#detail-category");
const detailIcon=document.querySelector("#detail-icon");
function openAppDetail(card){if(!detailModal)return;detailTitle.textContent=card.dataset.name||"App concept";detailDescription.textContent=card.querySelector(".app-card-body p")?.textContent||"";detailCategory.textContent=(card.querySelector(".app-category")?.textContent||"CONCEPT")+" · CONCEPT PREVIEW";detailIcon.textContent=card.querySelector(".app-icon")?.textContent?.trim()||"A";detailModal.hidden=false;document.body.style.overflow="hidden";detailModal.querySelector(".detail-close")?.focus();}
function closeAppDetail(){if(detailModal){detailModal.hidden=true;document.body.style.overflow="";}}
appCards.forEach(card=>{card.tabIndex=0;card.setAttribute("role","button");card.setAttribute("aria-label","View "+(card.dataset.name||"app")+" concept details");card.addEventListener("click",()=>openAppDetail(card));card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openAppDetail(card);}});});
detailModal?.querySelectorAll("[data-close-detail]").forEach(el=>el.addEventListener("click",closeAppDetail));
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&detailModal&&!detailModal.hidden)closeAppDetail();});
document.querySelectorAll("[data-category-shortcut]").forEach(link=>link.addEventListener("click",()=>{const category=link.dataset.categoryShortcut;filterInputs.forEach(input=>{if(input.dataset.filterType==="category")input.checked=input.value===category;});document.querySelectorAll("[data-category-shortcut]").forEach(item=>item.classList.toggle("active",item===link));filterApps();}));
document.querySelector("[data-featured-jump]")?.addEventListener("click",()=>{filterInputs.forEach(input=>{input.checked=input.dataset.filterType==="category"&&input.value==="productivity";});if(appSearch)appSearch.value="INDUS Notes";filterApps();});

/* Mobile-first storefront search, category shortcuts and concept detail sheets */
const storeSearch=document.querySelector("#app-search");
const storeCards=[...document.querySelectorAll(".store-app-card[data-name]")];
const storeModal=document.querySelector("#app-detail-modal");
const storeTitle=document.querySelector("#detail-title");
const storeDesc=document.querySelector("#detail-description");
const storeCategory=document.querySelector("#detail-category");
const storeIcon=document.querySelector("#detail-icon");
const storeDescriptions={"INDUS Notes":"A simple space for collecting thoughts, notes and everyday ideas.","StudySpark":"A learning companion concept for organising study topics and revision.","PromptDesk":"A tidy workspace concept for saving and organising useful AI prompts.","PixelKit":"A creative toolkit concept for collecting visual references and design ideas.","QuickConvert":"A handy conversion tools concept for everyday tasks.","Arena Companion":"A team organiser concept for practice plans, match notes and schedules."};
function storeFilter(){const q=(storeSearch?.value||"").trim().toLowerCase();storeCards.forEach(card=>{card.hidden=!!q&&!((card.dataset.search+" "+card.dataset.name).toLowerCase().includes(q));});document.querySelectorAll(".app-shelf").forEach(shelf=>{const cards=[...shelf.querySelectorAll(".store-app-card")];if(cards.length)shelf.hidden=cards.every(card=>card.hidden);});}
storeSearch?.addEventListener("input",storeFilter);
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)){e.preventDefault();storeSearch?.focus();}});
document.querySelectorAll("[data-shelf]").forEach(link=>link.addEventListener("click",()=>{const category=link.dataset.shelf;const first=storeCards.find(card=>card.dataset.category===category);if(first){storeCards.forEach(card=>card.hidden=card.dataset.category!==category);document.querySelectorAll(".app-shelf").forEach(shelf=>{const cards=[...shelf.querySelectorAll(".store-app-card")];if(cards.length)shelf.hidden=cards.every(card=>card.hidden);});}}));
/* Open a dedicated app information page instead of a temporary modal */
const appDetailData={
"INDUS Notes":"indus-notes","StudySpark":"studyspark","PromptDesk":"promptdesk","PixelKit":"pixelkit","QuickConvert":"quickconvert","Arena Companion":"arena-companion"
};
document.querySelectorAll("[data-open-app]").forEach(button=>button.addEventListener("click",()=>{const slug=appDetailData[button.dataset.openApp];if(slug)window.location.href="app.html?app="+encodeURIComponent(slug);}));
