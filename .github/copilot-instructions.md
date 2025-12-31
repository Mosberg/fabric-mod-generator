# Copilot Instructions for fabric-mod-generator

## Project Overview
This is a Node.js-based code generator for Minecraft Fabric mods. The project is organized by generator modules, utilities, configuration, and a simple web UI.

## Architecture & Key Components
- **generators/**: Contains modular generators for different mod elements (block, item, entity, command, config, mixin, overlay, renderer, screen). Each generator exports functions for code and asset generation.
- **utils/**: Shared utilities for template management, downloads, and validation.
- **data/fabricConfig.json**: Stores mod configuration data, read by generators and utilities.
- **app.js**: Main backend logic, orchestrates requests from the UI and delegates to generators.
- **index.html, style.css**: Simple web UI for user interaction.

## Developer Workflows
- **Run the app**: Use `node app.js` to start the backend. The UI is served via `index.html`.
- **Debugging**: Edit generator modules in `generators/` and reload the app. No build step required.
- **Configuration**: Update `data/fabricConfig.json` for mod settings. Changes are picked up on restart.

## Project-Specific Patterns
- **Generator Pattern**: Each generator module follows a similar export structure (e.g., `generateBlock`, `generateItem`). Utilities are imported from `utils/`.
- **Template Usage**: Templates are managed via `utils/templateManager.js` and used in generators for code scaffolding.
- **Validation**: Input validation is centralized in `utils/validators.js`.
- **No external build tools**: Pure Node.js, no bundlers or transpilers.

## Integration Points
- **External dependencies**: Only Node.js standard modules and any dependencies listed in `package.json` (if present).
- **Cross-component communication**: Generators are called from `app.js` based on UI actions; data flows from `fabricConfig.json` through utilities to generators.

## Examples
- To add a new generator, create a new file in `generators/`, export a function, and update `app.js` to use it.
- To change mod config, edit `data/fabricConfig.json` and restart the app.

## References
- See `generators/` for code generation patterns.
- See `utils/templateManager.js` for template usage.
- See `app.js` for orchestration logic.

---
If any section is unclear or missing details, please provide feedback for further refinement.
