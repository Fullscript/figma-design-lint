import { createErrorObject } from "./createErrorObject";

export function checkType(node, errors) {
  if (node.textStyleId === "" && node.visible === true) {
    let textObject = {
      font: "",
      fontStyle: "",
      fontSize: "",
      lineHeight: {},
      letterSpacingValue: "",
      letterSpacingUnit: "",
      textAlignHorizontal: "",
      textAlignVertical: "",
      paragraphIndent: "",
      paragraphSpacing: "",
      textCase: "",
    };

    let fontStyle = node.fontName;
    let fontSize = node.fontName;

    if (typeof fontStyle === "symbol" || typeof fontSize === "symbol") {
      return errors.push(
        createErrorObject(
          node,
          "text",
          "Missing text style",
          "Mixed sizes or families"
        )
      );
    }

    textObject.font = node.fontName.family;
    textObject.fontStyle = node.fontName.style;
    textObject.fontSize = node.fontSize;
    textObject.letterSpacingValue = node.letterSpacing.value;
    textObject.letterSpacingUnit = node.letterSpacing.unit;
    textObject.textAlignHorizontal = node.textAlignHorizontal;
    textObject.textAlignVertical = node.textAlignVertical;
    textObject.paragraphIndent = node.paragraphIndent;
    textObject.paragraphSpacing = node.paragraphSpacing;
    textObject.textCase = node.textCase;

    // Line height can be "auto" or a pixel value
    if (node.lineHeight.value !== undefined) {
      textObject.lineHeight = node.lineHeight.value;
    } else {
      textObject.lineHeight = "Auto";
    }

    let lineHeightFormatted = null;

    if (textObject.lineHeight === "Auto") {
      lineHeightFormatted = "Auto";
    } else {
      let roundedLineHeight = roundToDecimalPlaces(textObject.lineHeight, 1);
      if (node.lineHeight.unit === "PERCENT") {
        lineHeightFormatted = roundedLineHeight + "%";
      } else {
        lineHeightFormatted = roundedLineHeight;
      }
    }

    let currentStyle = `${textObject.font} ${textObject.fontStyle} · ${textObject.fontSize}/${lineHeightFormatted}`;

    return errors.push(
      createErrorObject(node, "text", "Missing text style", currentStyle)
    );
  } else {
    return;
  }
}

function roundToDecimalPlaces(value, decimalPlaces) {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
}
