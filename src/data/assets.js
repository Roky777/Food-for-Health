const scienceArt = (path) => new URL(`../../assets/GRADE 4/science game/${path}`, import.meta.url).href;
const foodArt = (path) => new URL(`../../assets/GRADE 3/Food We Eat/${path}`, import.meta.url).href;
const levelArt = { level1: {
  rice: scienceArt("level 2/rice (1).webp"), potato: scienceArt("level 1/potato (1).webp"),
  banana: scienceArt("level 1/banana.webp"), millets: foodArt("level 2/grains (1).webp"),
  pulses: foodArt("LEVEL 1/pulses.webp"), milk: scienceArt("level 1/milk (1).webp"), eggs: foodArt("level 2/eggs (1).webp"),
  carrot: scienceArt("level 1/carrot (1).webp"), spinach: scienceArt("level 1/spinach (1).webp"), orange: scienceArt("level 1/orange.webp"),
} };
export function resolveMathArt(artId, assetSet) { return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.rice; }
const blankBin = "assets/ui/sorting-bin-blank.webp";
export const assets = {
  characters: {
    idle: "assets/ui/sparky/idle.webp",
    presentation: "assets/ui/sparky/final_presentation_clean.webp",
    correct: "assets/ui/sparky/modified_thubms_up.webp",
    nod: "assets/ui/sparky/updated_nod.webp",
    happy: "assets/ui/sparky/happy.webp",
    thinking: "assets/ui/sparky/thinking.webp",
    surprised: "assets/ui/sparky/surprised.webp",
    successDance: "assets/ui/sparky/moon_walk_normalized.webp",
  },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: {
    success: ["assets/backgrounds/bg.webp?v=20260925-clear-food-bg-1", "assets/backgrounds/badge.webp", "assets/ui/image 18.webp", "assets/ui/success-star-1.webp", "assets/ui/success-star-2.webp", "assets/ui/success-star-3.webp"],
    conveyorRims: "assets/ui/conveyor-rims.webp", conveyorFrame: "assets/ui/conveyor-frame.webp", conveyorTrackMask: "assets/ui/conveyor-track.webp",
    sortingBins: { energy: blankBin, building: blankBin, protective: blankBin }, boxLeaves: "assets/ui/ui-box-leaves.webp" }, audio: {}, fx: {},
};
const imageRequests = new Map();
const decodedImages = new Map();
const DECODED_IMAGE_LIMIT = 64;
const sparkyFallback = (src) => src.startsWith("assets/ui/sparky/")
  ? src.replace("assets/ui/sparky/", "assets/characters/").replace(/\.webp$/, ".png")
  : "";
function retainDecodedImage(src, image) {
  decodedImages.delete(src); decodedImages.set(src, image);
  while (decodedImages.size > DECODED_IMAGE_LIMIT) decodedImages.delete(decodedImages.keys().next().value);
}
export function preloadImage(src) {
  if (!src) return Promise.resolve();
  if (imageRequests.has(src)) {
    const decoded = decodedImages.get(src); if (decoded) retainDecodedImage(src, decoded);
    return imageRequests.get(src);
  }
  const request = new Promise((resolve) => { const image = new Image(); image.decoding = "async";
    image.onload = async () => { await image.decode?.().catch(() => {}); retainDecodedImage(src, image); resolve({ src, loaded: true }); };
    image.onerror = () => {
      const fallback = sparkyFallback(src);
      if (fallback && image.dataset.fallback !== "true") {
        image.dataset.fallback = "true";
        image.src = fallback;
        return;
      }
      resolve({ src, loaded: false });
    };
    image.src = src;
  });
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
