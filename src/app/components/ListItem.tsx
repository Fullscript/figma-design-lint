import * as React from "react";
import classNames from "classnames";

const importantNodeTypes = [
  "COMPONENT",
  "ELLIPSE",
  "FRAME",
  "GROUP",
  "MEDIA",
  "INSTANCE",
  "LINE",
  "RECTANGLE",
  "SECTION",
  "TEXT",
  "VECTOR",
];

function ListItem(props) {
  const { onClick } = props;
  const node = props.node;
  let childNodes = null;
  let errorObject = { errors: [] };
  let childErrorsCount = 0;

  let filteredErrorArray = props.errorArray;

  // Check to see if this node has corresponding errors.
  if (filteredErrorArray.some((e) => e.id === node.id)) {
    errorObject = filteredErrorArray.find((e) => e.id === node.id);
  }

  if (!importantNodeTypes.includes(node.type)) return null;

  // The component calls itself if there are children
  if (node.children && node.children.length) {
    // Find errors in this node's children.
    childErrorsCount = findNestedErrors(node);

    let reversedArray = node.children.slice().reverse();
    childNodes = reversedArray.map(function(childNode) {
      return (
        <ListItem
          ignoredErrorArray={props.ignoredErrorArray}
          activeNodeIds={props.activeNodeIds}
          selectedListItems={props.selectedListItems}
          errorArray={filteredErrorArray}
          onClick={onClick}
          key={childNode.id}
          node={childNode}
        />
      );
    });
  }

  // Recursive function for finding the amount of errors
  // nested within this nodes children.
  function findNestedErrors(node) {
    let errorCount = 0;

    node.children.forEach((childNode) => {
      if (filteredErrorArray.some((e) => e.id === childNode.id)) {
        let childErrorObject = filteredErrorArray.find(
          (e) => e.id === childNode.id
        );
        errorCount = errorCount + childErrorObject.errors.length;
      }

      if (childNode.children) {
        errorCount = errorCount + findNestedErrors(childNode);
      }
    });

    return errorCount;
  }

  return (
    <li
      id={node.id}
      className={classNames(`list-item`, {
        "list-item--active": props.activeNodeIds.includes(node.id),
        "list-item--selected": props.selectedListItems.includes(node.id),
      })}
      onClick={(event) => {
        event.stopPropagation();
        onClick(node.id);
      }}
    >
      <div className="list-flex-row">
        <span className="list-arrow">
          {childNodes ? (
            <img
              className="list-arrow-icon"
              src={require("../assets/caret.svg")}
            />
          ) : null}
        </span>
        <span className="list-icon">
          <img
            src={require("../assets/node-type/" +
              node.type.toLowerCase() +
              ".svg")}
          />
        </span>
        <span className="list-name">{node.name}</span>
        {childErrorsCount >= 1 && <span className="dot"></span>}
        {errorObject.errors.length >= 1 && (
          <span className="badge">{errorObject.errors.length}</span>
        )}
      </div>
      {childNodes ? <ul className="sub-list">{childNodes}</ul> : null}
    </li>
  );
}

export default ListItem;
