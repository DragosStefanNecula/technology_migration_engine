# Wiki

Documentation for the Technology Migration Engine, the Perl Catalyst to Java Spring MVC converter.

> Exporting — these pages are designed to be exported as PDF project artefacts. Install [`yzane.markdown-pdf`](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf) (included in the VS Code recommended extensions), open any page, and run Markdown PDF: Export (pdf) from the command palette.

## Pages

### [Requirement Analysis](requirement_analysis/Requirement%20Analysis.md)

The eight functional requirements gathered from a developer questionnaire, each with a validation checklist, justification, and a link to the implementing component.

### [Perl Syntax Inventory](Perl%20Syntax%20Inventory.md)

A checklist of every Perl construct the programmatic transpiler covers. Checked items `[X]` are handled structurally; unchecked items `[ ]` fall back to LLM assistance where available. See [Requirement 5](requirement_analysis/Requirement%20Analysis.md) for why the programmatic/LLM split was chosen.

### [Test Driven Development](TestDrivenDevelopment.md)

A running log of incidents where the test suite caught real mistakes during development, a practical record that fed directly into [Requirement 7](requirement_analysis/Requirement%20Analysis.md).
