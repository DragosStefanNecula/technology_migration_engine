import Parser from "tree-sitter";
import Perl from "@ganezdragon/tree-sitter-perl";

export function parsePerl(code) {
  const parser = new Parser();
  parser.setLanguage(Perl);

  const tree = parser.parse(code);

  return tree.rootNode;
}

