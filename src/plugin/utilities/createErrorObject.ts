// Generic function for creating an error object to pass to the app.
export function createErrorObject(
  node,
  type,
  message,
  value?,
  fillColor?,
  textProperties?
) {
  let error = {
    message: "",
    type: "",
    node: "",
    value: "",
    fillColor: "",
    textProperties: {},
  };

  error.message = message;
  error.type = type;
  error.node = node;
  error.fillColor = fillColor;
  error.textProperties = textProperties;

  if (value !== undefined) {
    error.value = value;
  }

  return error;
}
