import { createErrorObject } from "./createErrorObject";
import { determineFill } from "./determineFill";

export function checkBackgroundToken(node, errors) {
  if (typeof node.boundVariables !== "undefined") {
    if (typeof node.boundVariables.fills !== "undefined") {
      return;
    }
  }

  if (
    (node.fills.length && node.visible === true) ||
    typeof node.fills === "symbol"
  ) {
    let nodeFills = node.fills;

    let fillStyleId = node.fillStyleId;

    if (typeof nodeFills === "symbol") {
      return errors.push(
        createErrorObject(
          node,
          "background",
          "Missing background token",
          "Mixed values"
        )
      );
    }

    if (typeof fillStyleId === "symbol") {
      return;
    }

    // If the fills are visible, aren't an image or a video, then lint them.
    if (
      node.fillStyleId === "" &&
      node.fills[0].type !== "IMAGE" &&
      node.fills[0].type !== "VIDEO" &&
      node.fills[0].visible === true
    ) {
      let currentFill = determineFill(node.fills);

      return errors.push(
        createErrorObject(
          node,
          "background",
          "Missing background token",
          currentFill
        )
      );
    } else {
      return;
    }
  }
}
