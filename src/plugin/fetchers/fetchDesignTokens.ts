import { RGBToHex, convertColor } from "../utilities";

// revisit this to show suggested fixes for errors
async function fetchDesignTokens(usedRemoteStyles) {
  const libs = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  const colorTokens = libs.find((lib) => lib.name === "theme-colours");

  const themeColorsLib = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
    colorTokens.key
  );

  for (const vars of themeColorsLib) {
    const importedVariable = await figma.variables.importVariableByKeyAsync(
      vars.key
    );

    const colorVar = importedVariable.resolveForConsumer(
      figma.currentPage.selection[0]
    );

    let rgbObj = convertColor(colorVar.value);

    const hexCode = RGBToHex(rgbObj["r"], rgbObj["g"], rgbObj["b"]);

    const colorObj = {
      id: importedVariable.id,
      type: "background",
      paint: {
        type: "SOLID",
        visible: true,
        opacity: 1,
        blendMode: "NORMAL",
        color: colorVar.value,
      },
      name: importedVariable.name,
      count: 1,
      consumers: [figma.currentPage.selection[0]],
      fillColor: hexCode,
    };

    const existingStyle = usedRemoteStyles.fills.find(
      (style) => style.id === importedVariable.id
    );

    if (!existingStyle) {
      usedRemoteStyles.fills.push(colorObj);
    }
  }
}

export { fetchDesignTokens };
