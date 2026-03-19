import { parsePerl } from "./perlParser.js";
import { genJavaAst } from "./javaAstGenerator.js";
import { JavaCodegen } from "./javaCodeGenerator.js";

export function handlePerl(code) {
    const perlAst = parsePerl(code);

    const javaAst = genJavaAst(perlAst);

    let javaCodegen = new JavaCodegen({ indent: 2 });
    const target = javaCodegen.generate(javaAst);

    return target;
}