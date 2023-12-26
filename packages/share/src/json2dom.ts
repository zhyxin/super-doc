interface JsonElement {
  tag?: string;
  text?: string;
  attributes?: { [key: string]: string };
  content?: JsonElement[];
}

export function json2dom(json: HTMLElement[]) {
  const els = [];
  json.forEach(_json => {
    els.push(_json2dom(_json));
  });
  return els;
}

export function _json2dom(json): Node {
  if (json.text !== undefined) {
    // Create a text node
    return document.createTextNode(json.text);
  }

  if (!json.tag) {
    throw new Error("Invalid JSON: Element must have a 'tag' or 'text'");
  }

  // Create an element node
  const element = document.createElement(json.tag);

  // Add attributes if any
  if (json.attributes) {
    Object.keys(json.attributes).forEach((key) => {
      element.setAttribute(key, json.attributes[key]);
    });
  }

  // Recursively add child elements
  if (json.content) {
    json.content.forEach((childJson) => {
      const childNode = json2dom(childJson);
      element.appendChild(childNode);
    });
  }

  return element;
}
