const scienceArt = (path) => new URL(`../../assets/GRADE 4/science game/${path}`, import.meta.url).href;
const foodArt = (path) => new URL(`../../assets/GRADE 3/Food We Eat/${path}`, import.meta.url).href;
const levelArt = { level1: {
  rice: scienceArt("level 2/rice (1).png"), potato: scienceArt("level 1/potato (1).png"),
  banana: scienceArt("level 1/banana.png"), millets: foodArt("level 2/grains (1).png"),
  pulses: foodArt("LEVEL 1/pulses.png"), milk: scienceArt("level 1/milk (1).png"), eggs: foodArt("level 2/eggs (1).png"),
  carrot: scienceArt("level 1/carrot (1).png"), spinach: scienceArt("level 1/spinach (1).png"), orange: scienceArt("level 1/orange.png"),
} };
export function resolveMathArt(artId, assetSet) { return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.rice; }
const blankBin = "assets/ui/sorting-bin-blank.png";
export const assets = {
  characters: { idle: "assets/characters/idle.png", presentation: "assets/characters/final_presentation_clean.png" },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: { conveyorRims: "assets/ui/conveyor-rims.png", conveyorFrame: "assets/ui/conveyor-frame.png", conveyorTrackMask: "assets/ui/conveyor-track.png",
    sortingBins: { energy: blankBin, building: blankBin, protective: blankBin }, boxLeaves: "assets/ui/ui-box-leaves.png" }, audio: {}, fx: {},
};
const imageRequests = new Map();
export function preloadImage(src) {
  if (!src) return Promise.resolve(); if (imageRequests.has(src)) return imageRequests.get(src);
  const request = new Promise((resolve) => { const image = new Image(); image.decoding = "async";
    image.onload = async () => { await image.decode?.().catch(() => {}); resolve({ src, loaded: true }); };
    image.onerror = () => resolve({ src, loaded: false }); image.src = src; });
  imageRequests.set(src, request); return request;
}
export function hydrateDeferredImages(root = document) {
  return Promise.all([...root.querySelectorAll("img[data-src]")].map((image) => { const src = image.dataset.src; delete image.dataset.src;
    image.src = src; return image.decode?.().catch(() => {}) ?? preloadImage(src); }));
}
export function preloadLevelAssets(level) {
  if (!level) return Promise.resolve([]);
  const urls = new Set([assets.ui.boxLeaves, ...level.items.map((entry) => resolveMathArt(entry.art, entry.assetSet)),
    ...level.bins.flatMap((entry) => [resolveMathArt(entry.art, entry.assetSet), assets.ui.sortingBins[entry.id] ?? blankBin])]);
  return Promise.all([...urls].map(preloadImage));
}
