import { lintElement } from "./lintElement";
import { serializeNodes } from "../utilities/serializeNodes";

/*
 * Function triggered when the app first boots, or general
 * linting is requested.
 *
 * @param {Object} msg - The message object from the UI.
 * @param {String} documentUUID - The UUID of the current document.
 *
 * @returns {Array} - The original node tree.
 *
 */
export const runApp = (msg, documentUUID) => {
  let originalNodeTree;

  if (figma.currentPage.selection.length === 0 && msg.selection === "user") {
    figma.notify(`Select some layers, then try running again!`, {
      timeout: 2000,
    });

    // If the user hasn't selected anything, show the empty state.
    figma.ui.postMessage({
      type: "show-empty-state",
    });

    return;
  } else {
    let nodes = null;
    let firstNode = [];

    // Determine whether we scan the page for the user,
    // or use their selection
    if (msg.selection === "user") {
      nodes = figma.currentPage.selection;
      firstNode.push(figma.currentPage.selection[0]);
    } else if (msg.selection === "page") {
      nodes = figma.currentPage.children;
      firstNode.push(nodes[0]);
    }

    // Maintain the original tree structure so we can enable
    // refreshing the tree and live updating errors.
    originalNodeTree = nodes;

    // Show the preloader until we're ready to render content.
    figma.ui.postMessage({
      type: "show-preloader",
    });

    // Fetch the ignored errors from client storage
    const ignoredErrorsPromise = figma.clientStorage.getAsync(documentUUID);

    Promise.all([ignoredErrorsPromise]).then(async ([ignoredErrors]) => {
      if (ignoredErrors && ignoredErrors.length) {
        figma.ui.postMessage({
          type: "fetched storage",
          storage: ignoredErrors,
        });
      }

      // await loadLibraryStyles();

      // Now that libraries are available, call lint with libraries and localStylesLibrary, then send the message
      figma.ui.postMessage({
        type: "step-1",
        message: serializeNodes(nodes),
        errors: lintElement(firstNode),
      });
    });

    figma.clientStorage.getAsync("storedActivePage").then((result) => {
      if (result.length) {
        figma.ui.postMessage({
          type: "fetched active page",
          storage: result,
        });
      }
    });
  }

  return originalNodeTree;
}
