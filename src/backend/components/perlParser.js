import Parser from "tree-sitter";
import Perl from "@ganezdragon/tree-sitter-perl";

export function parsePerl(code) {
    const parser = new Parser();
    parser.setLanguage(Perl);

    let tree;
    try {
        tree = parser.parse(code);
    } catch (err) {
        throw new Error(`Failed to parse Perl source: ${err.message}`);
    }

    return tree.rootNode;
}

