import { createErrorObject } from "./createErrorObject";
import { determineFill } from "./determineFill";
import { gradientToCSS } from "./gradientToCSS";

export function checkBorderToken(node, errors) {
  if (typeof node.boundVariables !== "undefined") {
    if (typeof node.boundVariables.strokes !== "undefined") {
      return;
    }
  }

  if (node.strokes.length && node.visible === true) {
    let strokeStyleId = node.strokeStyleId;

    if (typeof strokeStyleId === "symbol") {
      return;
    }

    if (node.strokeStyleId === "") {
      let strokeObject = {
        strokeWeight: "",
        strokeAlign: "",
        strokeFills: [],
      };

      let strokeWeight = node.strokeWeight;

      if (typeof strokeWeight === "symbol") {
        strokeWeight = `${node.strokeTopWeight}, ${node.strokeRightWeight}, ${node.strokeBottomWeight}, ${node.strokeLeftWeight}`;
      }

      strokeObject.strokeWeight = strokeWeight;
      strokeObject.strokeAlign = node.strokeAlign;
      strokeObject.strokeFills = determineFill(node.strokes);

      // If there are multiple strokes on a node,
      // it's probbaly intentional or shouldn't be matched.
      if (node.strokes.length > 1) {
        return errors.push(
          createErrorObject(
            node,
            "border",
            "Mutiple fills on a stroke",
            `Stroke: ${strokeObject.strokeWeight} / ${strokeObject.strokeAlign}`
          )
        );
      }

      // We only want to check the first stroke for a missing color.

      let currentStroke = `${strokeObject.strokeFills} / ${strokeObject.strokeWeight} / ${strokeObject.strokeAlign}`;
      let strokeFill = strokeObject.strokeFills;

      let nodeFillType = node.strokes[0].type;
      let cssSyntax = null;

      if (nodeFillType === "SOLID") {
        cssSyntax = strokeFill;
      } else if (nodeFillType !== "SOLID") {
        cssSyntax = gradientToCSS(node.strokes[0]);
      }

      return errors.push(
        createErrorObject(
          node,
          "border",
          "Missing border token",
          currentStroke,
          cssSyntax
        )
      );
    } else {
      return;
    }
  }
}
