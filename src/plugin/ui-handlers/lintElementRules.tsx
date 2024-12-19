import {
  checkBackgroundToken,
  checkBorderToken,
  checkDeprecatedComponent,
  checkDetachedInstances,
  checkType,
} from "../utilities";

export function lintElementRules(node) {
  switch (node.type) {
    case "SLICE":
    case "GROUP": {
      // Groups styles apply to their children so we can skip this node type.
      let errors = [];
      return errors;
    }
    case "POLYGON":
    case "STAR":
    case "ELLIPSE": {
      return lintShapeRules(node);
    }
    case "FRAME": {
      return lintFrameRules(node);
    }
    case "SECTION": {
      return lintSectionRules(node);
    }
    case "INSTANCE":
    case "RECTANGLE": {
      return lintRectangleRules(node);
    }
    case "COMPONENT": {
      return lintComponentRules(node);
    }
    case "COMPONENT_SET": {
      return lintVariantWrapperRules(node);
    }
    case "LINE": {
      return lintLineRules(node);
    }
    case "TEXT": {
      return lintTextRules(node);
    }
    default: {
      return [];
    }
  }
}

function lintComponentRules(node) {
  let errors = [];

  checkBackgroundToken(node, errors);
  checkBorderToken(node, errors);

  return errors;
}

function lintVariantWrapperRules(node) {
  let errors = [];

  checkBackgroundToken(node, errors);

  return errors;
}

function lintLineRules(node) {
  let errors = [];

  checkBorderToken(node, errors);

  return errors;
}

function lintFrameRules(node) {
  let errors = [];

  checkDetachedInstances(node, errors);
  checkBackgroundToken(node, errors);
  checkBorderToken(node, errors);

  return errors;
}

function lintSectionRules(node) {
  let errors = [];

  checkBackgroundToken(node, errors);

  return errors;
}

function lintTextRules(node) {
  let errors = [];

  checkType(node, errors);
  checkBackgroundToken(node, errors);
  checkBorderToken(node, errors);

  return errors;
}

function lintRectangleRules(node) {
  let errors = [];

  checkBackgroundToken(node, errors);
  checkBorderToken(node, errors);
  checkDeprecatedComponent(node, errors);

  return errors;
}

function lintShapeRules(node) {
  let errors = [];

  checkBackgroundToken(node, errors);
  checkBorderToken(node, errors);

  return errors;
}
