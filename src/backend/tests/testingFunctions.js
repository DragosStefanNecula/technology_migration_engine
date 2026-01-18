import { parsePerl } from "../components/perlParser.js";
import { genJavaAst } from "../components/javaAstGenerator.js";

export function genJavaAstDebug(code){
    const perlAst = parsePerl(code);

    const javaAst = genJavaAst(perlAst);

    return javaAst;
}

export function parseDebugOutput(code) {
  const treeRootNode = parsePerl(code);
  return walk(treeRootNode) + "\n";
}

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
