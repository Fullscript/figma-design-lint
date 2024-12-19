import { lintElementRules } from "./lintElementRules";

export function lintElement(nodes, lockedParentNode = false) {
  let errorArray = [];

  // Use a for loop instead of forEach
  for (const node of nodes) {
    // Determine if the layer or its parent is locked.
    const isLayerLocked = lockedParentNode || node.locked;
    const nodeChildren = node.children;

    // Create a new object.
    const newObject = {
      id: node.id,
      errors: isLayerLocked ? [] : lintElementRules(node),
      children: [],
    };

    // Check if the node has children.
    if (nodeChildren) {
      // Recursively run this function to flatten out children and grandchildren nodes.
      newObject.children = node.children.map((childNode) => childNode.id);
      errorArray.push(...lintElement(node.children, isLayerLocked));
    }

    errorArray.push(newObject);
  }

  return errorArray;
}

let nodeCounter = 0;

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function* lintElementAsync(nodes, lockedParentNode = false) {
  let errorArray = [];

  for (const node of nodes) {
    // Determine if the layer or its parent is locked.
    const isLayerLocked = lockedParentNode || node.locked;

    // Create a new object.
    const newObject = {
      id: node.id,
      errors: isLayerLocked ? [] : lintElementRules(node),
      children: [],
    };

    // Check if the node has children.
    if (node.children) {
      // Recursively run this function to flatten out children and grandchildren nodes.
      newObject.children = node.children.map((childNode) => childNode.id);
      for await (const result of lintElementAsync(
        node.children,
        isLayerLocked
      )) {
        errorArray.push(...result);
      }
    }

    errorArray.push(newObject);

    // Increment the node counter, this is our number of layers total.
    nodeCounter++;
    // console.log(nodeCounter);

    // Yield the result after processing a certain number of nodes
    if (nodeCounter % 1000 === 0) {
      yield errorArray;
      errorArray = [];
      await delay(5);
    }
  }

  // Yield any remaining results
  if (errorArray.length > 0) {
    yield errorArray;
  }
}
