import { parsePerl } from "#src/backend/components/perlParser.js";
import { genJavaAst } from "#src/backend/components/javaAstGenerator.js";
import { JavaCodegen } from "#src/backend/components/javaCodeGenerator.js";

//[[req3impl| ]] Adheres to [[#req3spec|Requirement 3]]

export function handlePerl(code) {
    const perlAst = parsePerl(code);

    const javaAst = genJavaAst(perlAst);

    let javaCodegen = new JavaCodegen({ indent: 2 });
    const target = javaCodegen.generate(javaAst);

    return target;
}