export function gradientToCSS(nodeFill) {
  const nodeFillType = nodeFill.type;
  let cssGradient = "";

  if (nodeFillType === "GRADIENT_LINEAR") {
    const stops = nodeFill.gradientStops
      .map((stop) => {
        const color = `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(
          stop.color.g * 255
        )}, ${Math.round(stop.color.b * 255)}, ${stop.color.a})`;
        return `${color} ${Math.round(stop.position * 100)}%`;
      })
      .join(", ");
    cssGradient = `linear-gradient(${stops})`;
  } else if (
    nodeFillType === "GRADIENT_RADIAL" ||
    nodeFillType === "GRADIENT_DIAMOND"
  ) {
    const stops = nodeFill.gradientStops
      .map((stop) => {
        const color = `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(
          stop.color.g * 255
        )}, ${Math.round(stop.color.b * 255)}, ${stop.color.a})`;
        return `${color} ${Math.round(stop.position * 100)}%`;
      })
      .join(", ");
    cssGradient = `radial-gradient(${stops})`;
  } else if (nodeFillType === "GRADIENT_ANGULAR") {
    const stops = nodeFill.gradientStops
      .map((stop) => {
        const color = `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(
          stop.color.g * 255
        )}, ${Math.round(stop.color.b * 255)}, ${stop.color.a})`;
        return `${color} ${Math.round(stop.position * 100)}%`;
      })
      .join(", ");
    cssGradient = `conic-gradient(${stops})`;
  }

  return cssGradient;
}
