import { createErrorObject } from "./createErrorObject";

export function checkDeprecatedComponent(node, errors) {
  if (
    node.type === "INSTANCE" &&
    node.name.toLowerCase().includes("deprecated")
  ) {
    return errors.push(
      createErrorObject(
        node,
        "deprecated",
        "Using a deprecated component",
        node.name
      )
    );
  }
}
