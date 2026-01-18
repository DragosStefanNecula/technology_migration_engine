import Parser from "tree-sitter";
import Perl from "@ganezdragon/tree-sitter-perl";

export function parsePerl(code) {
  const parser = new Parser();
  parser.setLanguage(Perl);

  const tree = parser.parse(code);

  return tree.rootNode;
}

export function parseDebugOutput(code) {
  const parser = new Parser();
  parser.setLanguage(Perl);

  const tree = parser.parse(code);

  const walk = (node, indent = 0) => {
    const pad = " ".repeat(indent);

    let result = `${pad}{\n`;
    result += `${pad}  "type": "${node.type}",\n`;

    // show text safely with real newlines
    const safeText = node.text.replace(/\n/g, "\\n");
    result += `${pad}  "text": "${safeText}",\n`;

    if (node.children.length > 0) {
      result += `${pad}  "children": [\n`;

      for (const child of node.children) {
        result += walk(child, indent + 4) + ",\n";
      }

      // drop trailing comma
      result = result.replace(/,\n$/, "\n");

      result += `${pad}  ]\n`;
    } else {
      result += `${pad}  "children": []\n`;
    }

    result += `${pad}}`;
    return result;
  };

  return walk(tree.rootNode) + "\n";
}
