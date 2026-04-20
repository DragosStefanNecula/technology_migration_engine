# Maintaining the Software

← [Wiki index](README.md)

This page is a short guide for future maintenance of the Technology Migration Engine. The main aim is to keep the app working and keep the transpiler stable.

## Project Map

The main places to look during maintenance are:

- `src/main.js` for Electron startup
- `src/backend/components/` for the main transpiler logic
- `src/backend/agent/` for AI-assisted translation features
- `src/frontend/components/` for the interface
- `src/backend/tests/` for backend tests
- `src/frontend/tests/` for frontend tests
- `wiki/` for documentation

The core backend flow is:

1. `parsePerl()` in `src/backend/components/perlParser.js`
2. `genJavaAst()` in `src/backend/components/javaAstGenerator.js`
3. `JavaCodegen` in `src/backend/components/javaCodeGenerator.js`
4. `handlePerl()` in `src/backend/components/migrationLogic.js`

If the generated Java output is wrong, this is usually the first area to check.

## Testing

The tests are split into backend and frontend:

- `src/backend/tests/` checks the transpiler logic
- `src/frontend/tests/` checks the user flows with Playwright

The [Test Driven Development](TestDrivenDevelopment.md) page shows why this matters: small parser or generator changes can break more cases than expected.

## Release Checklist

Before finishing important changes, check:

- dependencies are installed and any native parser rebuild still works
- `npm run test` passes for the affected areas
- `npm run build` still produces a portable package
- documentation matches the new behaviour
- any new supported syntax is reflected in the inventory and tests