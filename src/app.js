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
const track = $("viewer-track");
const dots = $("viewer-dots");
const prevBtn = $("viewer-prev");
const nextBtn = $("viewer-next");
const count = $("viewer-count");

let current = { photos: [], index: 0 };

const { bonnets } = await fetch("manifest.json").then((r) => r.json());

// --- Grilles par groupe -------------------------------------------------
function cell(id) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cell";
  btn.textContent = id;
  if (bonnets[id]) {
    btn.setAttribute("aria-label", `Bonnet ${id}`);
    btn.addEventListener("click", () => open(id));
  } else {
    btn.disabled = true;
    btn.setAttribute("aria-label", `Bonnet ${id} — bientôt`);
  }
  li.append(btn);
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

// --- Pop-up -------------------------------------------------------------
function open(id) {
  const { photos, prix } = bonnets[id];
  current = { photos, index: 0 };

  $("viewer-num").textContent = id;
  $("viewer-price").textContent = prix ?? "";

  track.replaceChildren(
    ...photos.map((src, i) => {
      const slide = document.createElement("div");
      slide.className = "viewer__slide";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Bonnet ${id} — photo ${i + 1} sur ${photos.length}`;
      img.loading = i === 0 ? "eager" : "lazy";
      img.decoding = "async";
      slide.append(img);
      return slide;
    }),
  );

  dots.replaceChildren(
    ...photos.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "viewer__dot";
      dot.setAttribute("aria-label", `Photo ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      return dot;
    }),
  );

  const single = photos.length < 2;
  dots.hidden = single;
  prevBtn.hidden = nextBtn.hidden = single;

  target = null;
  track.style.scrollBehavior = "auto";
  track.scrollLeft = 0;
  track.style.scrollBehavior = "";
  update(0);
  viewer.showModal();
}

// Cible d'un défilement lancé par un bouton : évite que des clics rapides
// soient « perdus » pendant l'animation.
let target = null;

function goTo(i) {
  const index = Math.max(0, Math.min(i, current.photos.length - 1));
  if (index === current.index) return;
  target = index;
  update(index);
  track.scrollTo({ left: index * track.clientWidth });
}

function update(index) {
  current.index = index;
  const n = current.photos.length;
  count.textContent = `${index + 1} / ${n}`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === n - 1;
  [...dots.children].forEach((d, i) => d.setAttribute("aria-current", String(i === index)));
}

// Suit le défilement (swipe, molette, flèches) pour mettre à jour le compteur
track.addEventListener(
  "scroll",
  () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (target !== null) {
      if (index === target) target = null;
      return;
    }
    if (index !== current.index) update(index);
  },
  { passive: true },
);

prevBtn.addEventListener("click", () => goTo(current.index - 1));
nextBtn.addEventListener("click", () => goTo(current.index + 1));
$("viewer-close").addEventListener("click", () => viewer.close());

// Clic sur le fond sombre = fermer
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.close();
});

viewer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current.index - 1);
  if (e.key === "ArrowRight") goTo(current.index + 1);
});
