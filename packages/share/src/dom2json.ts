interface JsonElement {
  tag?: string;
  text?: string;
  attributes?: { [key: string]: string };
  content?: JsonElement[];
}

export function dom2json(node: Node | NodeList): JsonElement | JsonElement[] | null {
  if (node instanceof NodeList) {
    // Process each node in the NodeList
    return Array.from(node)
      .map((singleNode) => dom2json(singleNode))
      .filter((e) => e !== null) as JsonElement[];
  } else {
    // Process a single node
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        return processTextNode(node);
      case Node.ELEMENT_NODE:
        return processElementNode(node as Element);
      default:
        return null; // Ignore other node types
    }
  }
}

function processTextNode(node: Node): JsonElement | null {
  const textContent = node.nodeValue?.trim();
  return textContent ? { text: textContent } : null;
}

function processElementNode(element: Element): JsonElement {
  const jsonElement: JsonElement = {
    tag: element.tagName.toLowerCase(),
    content: [],
    attributes:
      element.attributes.length > 0 ? getAttributes(element) : undefined,
  };

  element.childNodes.forEach((child) => {
    const childJson = dom2json(child) as JsonElement;
    if (childJson) {
      jsonElement.content!.push(childJson);
    }
  });

  return jsonElement;
}

function getAttributes(element: Element): { [key: string]: string } {
  const attributes: { [key: string]: string } = {};
  Array.from(element.attributes).forEach((attr) => {
    attributes[attr.name] = attr.value;
  });
  return attributes;
}
