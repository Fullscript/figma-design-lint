import { lintElement, lintElementAsync } from "./ui-handlers/lintElement";
import { runApp } from "./ui-handlers/runApp";
import { fetchLayerData } from "./ui-handlers/fetchLayerData";
import { serializeNodes } from "./utilities/serializeNodes";

figma.showUI(__html__, { width: 360, height: 580 });

let originalNodeTree: readonly any[] = [];

figma.skipInvisibleInstanceChildren = true;

// Function to generate a UUID
// This way we can store ignored errors per document rather than
// sharing ignored errors across all documents.
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getDocumentUUID() {
  // Try to get the UUID from the document's plugin data
  let uuid = figma.root.getPluginData("documentUUID");

  // If the UUID does not exist (empty string), generate a new one and store it
  if (!uuid) {
    uuid = generateUUID();
    figma.root.setPluginData("documentUUID", uuid);
  }

  return uuid;
}

// Set the unique ID we use for client storage.
const documentUUID = getDocumentUUID();

figma.on("documentchange", (_event) => {
  // When a change happens in the document
  // send a message to the plugin to look for changes.'
  figma.ui.postMessage({
    type: "change",
  });
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "run-app") {
    originalNodeTree = runApp(msg, documentUUID);
  }

  if (msg.type === "step-2") {
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
      type: "step-2-complete",
      message: layerData,
    });
  }

  if (msg.type === "step-3") {
    // Use an async function to handle the asynchronous generator
    async function processLint() {
      const finalResult = [];

      for await (const result of lintElementAsync(originalNodeTree)) {
        finalResult.push(...result);
      }

      // Pass the final result back to the UI to be displayed.
      figma.ui.postMessage({
        type: "step-3-complete",
        errors: finalResult,
        message: serializeNodes(originalNodeTree),
      });
    }

    // Start the lint process
    figma.notify(`Aviary Lint is running and automatically detect changes`, {
      timeout: 1500,
    });

    processLint();
  }

  // Fetch a specific node by ID.
  if (msg.type === "fetch-layer-data") {
    fetchLayerData(msg);
  }

  // Called when an update in the Figma file happens
  // so we can check what changed.
  if (msg.type === "update-errors") {
    figma.ui.postMessage({
      type: "updated errors",
      errors: lintElement(originalNodeTree),
    });
  }

  // Notify the user of an issue.
  if (msg.type === "notify-user") {
    figma.notify(msg.message, { timeout: 1000 });
  }

  // Updates client storage with a new ignored error
  // when the user selects "ignore" from the context menu
  if (msg.type === "update-storage") {
    let arrayToBeStored = JSON.stringify(msg.storageArray);
    figma.clientStorage.setAsync(documentUUID, arrayToBeStored);
  }

  // Clears all ignored errors
  // invoked from the settings menu
  if (msg.type === "update-storage-from-settings") {
    let arrayToBeStored = JSON.stringify(msg.storageArray);
    figma.clientStorage.setAsync(documentUUID, arrayToBeStored);

    figma.ui.postMessage({
      type: "reset storage",
      storage: arrayToBeStored,
    });

    figma.notify("Cleared ignored errors", { timeout: 1000 });
  }

  // Remembers the last tab selected in the UI and sets it
  // to be active (layers vs error by category view)
  if (msg.type === "update-active-page-in-settings") {
    let pageToBeStored = JSON.stringify(msg.page);
    figma.clientStorage.setAsync("storedActivePage", pageToBeStored);
  }

  if (msg.type === "select-multiple-layers") {
    const layerArray = msg.nodeArray;
    let nodesToBeSelected = [];

    layerArray.forEach((item) => {
      let layer = figma.getNodeById(item);
      // Using selection and viewport requires an array.
      nodesToBeSelected.push(layer);
    });

    // Moves the layer into focus and selects so the user can update it.
    figma.currentPage.selection = nodesToBeSelected;
    figma.viewport.scrollAndZoomIntoView(nodesToBeSelected);
    figma.notify(`${nodesToBeSelected.length} layers selected`, {
      timeout: 750,
    });
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};
