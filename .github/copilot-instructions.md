
# Copilot Instructions for fabric-mod-generator

## Project Overview
This is a modular Node.js code generator for Minecraft Fabric mods. It features a live web UI, robust config profiles, and modular code generation for all major mod elements.

## Architecture & Key Components
- **app.js**: Main backend, orchestrates UI requests, loads and manages all generators, handles caching and logging.
- **generators/**: Each file is a generator module (e.g., `blockGenerator.js`, `itemGenerator.js`). All extend `BaseGenerator` and implement a `generate(config)` method. Generators use config and templates to scaffold code/assets for their mod element.
- **utils/**: Shared utilities for template management (`templateManager.js`), config profiles (`configProfiles.js`), downloads, logging, and validation (`validators.js`).
- **data/fabricConfig.js**: Central mod config (JS object, not JSON). Defines mod metadata, package structure, and generator types.
- **index.html, style.css**: Web UI for user interaction, preview, and export.

## Developer Workflows
- **Run the app**: `node app.js` (serves backend, open `index.html` in browser)
- **Edit or add generators**: Create/modify files in `generators/`, export a class with a `generate(config)` method, and register in `app.js`.
- **Templates**: Use `utils/templateManager.js` for project scaffolding and file templates.
- **Validation**: Add/modify rules in `utils/validators.js` (used by all generators via `BaseGenerator`).
- **Config**: Edit `data/fabricConfig.js` for mod defaults, structure, and generator types. Changes require app restart.
- **Debugging**: No build step. Edit code and reload app/UI.

## Project-Specific Patterns
- **Generator Pattern**: All generators extend `BaseGenerator`, use `validateName` and `getPackage` helpers, and expect a config object. Example: see `blockGenerator.js` or `entityGenerator.js`.
- **Config Profiles**: Managed in-browser via `utils/configProfiles.js` (uses localStorage). UI allows save/load of profiles.
- **Caching**: Code generation is cache-aware (see `GenerationCache` in `utils/loggerCache.js`).
- **Logging**: Use the `Logger` class for structured logs. Errors are handled via `ErrorHandler`.
- **No build tools**: Pure Node.js, no transpilers or bundlers. All code is ES modules.

## Integration Points
- **External dependencies**: Only Node.js built-ins and those in `package.json` (if present).
- **Cross-component flow**: UI triggers backend (via `app.js`), which loads config, validates, and delegates to the correct generator. Generators use templates/utilities and return code/assets to the UI for preview/export.
- **Export**: Full project export uses `TemplateManager.createFullProject(config)` to scaffold a ready-to-build Fabric mod.

## Examples
- **Add a generator**: Copy a file in `generators/`, export a class with `generate(config)`, and register in `app.js`.
- **Change mod config**: Edit `data/fabricConfig.js` and restart the app.
- **Edit templates**: Update `utils/templateManager.js`.

## References
- See `generators/` for code generation patterns.
- See `utils/templateManager.js` for project scaffolding.
- See `app.js` for orchestration and generator registration.
- See `README.md` and `docs/1/IMPLEMENTATION_GUIDE.md` for more details.

---
If any section is unclear or missing details, please provide feedback for further refinement.
