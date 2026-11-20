/* Turns a CSS colour (a token like var(--map-water), or any oklch value) into an rgb() string,
 * for libraries such as MapLibre that cannot read CSS variables or oklch. Browsers keep oklch as
 * oklch even on a canvas, so the colour is painted into one pixel and read back as sRGB. */
export function resolveCssColor(value: string): string {
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.color = value;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return computed;
  context.fillStyle = computed;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  return `rgba(${red}, ${green}, ${blue}, ${Math.round((alpha / 255) * 100) / 100})`;
}
