/*
 * Function triggered when we are fetching the layer data for a specific selected layer
 *
 * @param {Object} msg - The message object from the UI.
 *
 */
export const fetchLayerData = (msg) => {
  let layer = figma.getNodeById(msg.id);
  let layerArray = [];

  // Using figma UI selection and scroll to viewport requires an array.
  layerArray.push(layer);

  // Moves the layer into focus and selects so the user can update it.
  // uncomment the line below if you want to notify something has been selected.
  // figma.notify(`Layer ${layer.name} selected`, { timeout: 750 });
  figma.currentPage.selection = layerArray;
  figma.viewport.scrollAndZoomIntoView(layerArray);

  let layerData = JSON.stringify(layer, [
    "id",
    "name",
    "description",
    "fills",
    "key",
    "type",
    "remote",
    "paints",
    "fontName",
    "fontSize",
    "font",
  ]);

  figma.ui.postMessage({
    type: "fetched layer",
    message: layerData,
  });
};
