const $ = (s) => document.querySelector(s);

let M = null;
let sceneId = null;
let items = [];
let lbIndex = 0;
let lbScene = null;

async function boot() {
  const res = await fetch("manifest.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`manifest.json: HTTP ${res.status}`);
  M = await res.json();
  sceneId = M.scenes[0].id;
  renderTabs();
  renderGrid();
  bindKeys();
}

function renderTabs() {
  const nav = $("#tabs");
  nav.replaceChildren(...M.scenes.map((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = s.id === sceneId ? "tab active" : "tab";
    b.textContent = s.name;
    b.onclick = () => {
      sceneId = s.id;
      renderTabs();
      renderGrid();
      window.scrollTo({ top: 0 });
    };
    return b;
  }));
}

function renderGrid() {
  items = M.presets.filter((p) => p.files[sceneId]);
  const frag = document.createDocumentFragment();

  items.forEach((p, i) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";

    const img = document.createElement("img");
    img.src = p.files[sceneId];
    img.alt = p.name;
    img.loading = "lazy";
    img.decoding = "async";

    const cap = document.createElement("span");
    cap.textContent = p.name;

    tile.append(img, cap);
    tile.onclick = () => openLightbox(i, sceneId);
    frag.append(tile);
  });

  $("#grid").replaceChildren(frag);
  $("#count").textContent =
    `${items.length} presets · ${M.scenes.length} scenes`;
}

function openLightbox(index, sid) {
  lbIndex = index;
  lbScene = sid;
  $("#lightbox").hidden = false;
  document.body.classList.add("locked");
  paintLightbox();
}

function closeLightbox() {
  $("#lightbox").hidden = true;
  document.body.classList.remove("locked");
}

function paintLightbox() {
  const p = items[lbIndex];
  if (!p) return;

  const img = $("#lb-img");
  img.src = p.files[lbScene];
  img.alt = `${p.name} — ${sceneName(lbScene)}`;

  $("#lb-caption").textContent = `${p.name} — ${sceneName(lbScene)}`;

  $("#lb-strip").replaceChildren(...M.scenes.map((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "strip-tile" + (s.id === lbScene ? " active" : "");
    b.title = `${p.name} — ${s.name}`;

    if (p.files[s.id]) {
      const im = document.createElement("img");
      im.src = p.files[s.id];
      im.alt = "";
      im.loading = "lazy";
      b.append(im);
      b.onclick = () => { lbScene = s.id; paintLightbox(); };
    } else {
      b.disabled = true;
    }

    const lab = document.createElement("span");
    lab.textContent = s.name;
    b.append(lab);
    return b;
  }));
}

function step(delta) {
  if (!items.length) return;
  lbIndex = (lbIndex + delta + items.length) % items.length;
  paintLightbox();
}

function sceneName(id) {
  const s = M.scenes.find((x) => x.id === id);
  return s ? s.name : id;
}

function bindKeys() {
  $("#lb-close").onclick = closeLightbox;
  $("#lb-prev").onclick = () => step(-1);
  $("#lb-next").onclick = () => step(1);

  $("#lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if ($("#lightbox").hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
}

boot().catch((err) => {
  document.querySelector("#grid").textContent = `Failed to load: ${err.message}`;
  console.error(err);
});