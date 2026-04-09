import { parsePerl } from "#src/backend/components/perlParser.js";
import { genJavaAst } from "#src/backend/components/javaAstGenerator.js";
import { JavaCodegen } from "#src/backend/components/javaCodeGenerator.js";

export function handlePerl(code) {
    const perlAst = parsePerl(code);

    const javaAst = genJavaAst(perlAst);

    let javaCodegen = new JavaCodegen({ indent: 2 });
    const target = javaCodegen.generate(javaAst);

    return target;
}