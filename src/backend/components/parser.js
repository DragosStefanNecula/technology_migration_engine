import Parser from "tree-sitter";
import Perl from "@ganezdragon/tree-sitter-perl";

export function parse(code) {
  const parser = new Parser();
  parser.setLanguage(Perl);

  const tree = parser.parse(code);

  const walk = (node, indent = 0) => {
    const padding = " ".repeat(indent);
    let result = `${padding}${node.type}: "${node.text.replace(/\n/g, "\\n")}"\n`;
    
    for (const child of node.children) {
      result += walk(child, indent + 2); // concatenate child strings
    }
    
    return result;
  };

  return walk(tree.rootNode);
}