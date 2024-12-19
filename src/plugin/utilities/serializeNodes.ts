// Serialize nodes to pass back to the UI.
export const serializeNodes = (nodes) => {
  let serializedNodes = JSON.stringify(nodes, [
    "name",
    "type",
    "children",
    "id",
  ]);

  return serializedNodes;
}
