const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");

// Groupes de bonnets : nom + nombre de cases (dans l'ordre, à partir de 01)
const GROUPS = [
  { name: "CH4T", size: 45 },
  { name: "FL3UR", size: 35 },
  { name: "8ULL3", size: 20 },
];

const groups = $("groups");
const viewer = $("viewer");
const viewerImg = $("viewer-img");

const { bonnets } = await fetch("manifest.json").then((r) => r.json());

// --- Grilles par groupe -------------------------------------------------
function cell(id) {
  const li = document.createElement("li");
  li.className = "item";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cell";
  if (bonnets[id]) {
    // Une photo par bonnet : la première du dossier
    const img = document.createElement("img");
    img.src = bonnets[id].photos[0];
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    btn.append(img);
    btn.setAttribute("aria-label", `Bonnet ${id}`);
    btn.addEventListener("click", () => open(id));
  } else {
    btn.disabled = true;
    btn.setAttribute("aria-label", `Bonnet ${id} — bientôt`);
  }
  const label = document.createElement("span");
  label.className = "item__label";
  label.textContent = id;
  label.setAttribute("aria-hidden", "true");
  li.append(btn, label);
  return li;
}

let next = 1;
for (const { name, size } of GROUPS) {
  const first = next;
  const last = next + size - 1;
  next = last + 1;

  const section = document.createElement("section");
  section.className = "group";
  const title = document.createElement("h2");
  title.className = "group__title";
  title.textContent = name;
  const range = document.createElement("span");
  range.className = "group__range";
  range.textContent = `${pad(first)} – ${pad(last)}`;
  title.append(range);

  const grid = document.createElement("ol");
  grid.className = "grid";
  grid.setAttribute("aria-label", `${name} : bonnets ${pad(first)} à ${pad(last)}`);
  for (let i = first; i <= last; i++) grid.append(cell(pad(i)));

  section.append(title, grid);
  groups.append(section);
}

// --- Pop-up : la photo en grand -----------------------------------------
function open(id) {
  const { photos, prix } = bonnets[id];
  $("viewer-num").textContent = id;
  $("viewer-price").textContent = prix ?? "";
  viewerImg.src = photos[0];
  viewerImg.alt = `Bonnet ${id}`;
  viewer.showModal();
}

$("viewer-close").addEventListener("click", () => viewer.close());

// Clic sur le fond sombre = fermer
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.close();
});
