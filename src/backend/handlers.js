import { parseDebugOutput, parsePerl } from "./components/perlParser.js";
import { genJavaAst } from "./components/javaAstGenerator.js";
import { generateJavaCode } from "./components/javaCodeGenerator.js";

export function handleFileUpload(code){
    const perlAst = parsePerl(code);

    const javaAst = genJavaAst(perlAst);

    const target = generateJavaCode(javaAst);

    return target;
}