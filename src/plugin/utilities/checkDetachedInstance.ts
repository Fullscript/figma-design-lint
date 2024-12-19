import { createErrorObject } from "./createErrorObject";

export function checkDetachedInstances(node, errors) {
  if (node.detachedInfo?.type === "library") {
    return errors.push(
      createErrorObject(
        node,
        "detached",
        "Detached component instance",
        node.name
      )
    );
  }
}
