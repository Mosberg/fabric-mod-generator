# 🧩 Fabric Mod Generator v3.0

A modular, production-grade code generator for Minecraft Fabric mods. Generate, preview, and export mod code and assets with a modern web UI, robust configuration, and developer-friendly tooling.

---

## 🚀 Features

- **11 Modular Generators:** Block, Item, Entity, Command, Config, Mixin, Overlay, Renderer, Screen, Recipe, Event
- **Live Web UI:** Theme toggle, search/filter, keyboard shortcuts, undo/redo, toast notifications
- **Config Profiles:** Save/load mod configurations locally
- **Performance:** Cache-aware code generation, fast DOM updates, low memory usage
- **Developer Tooling:** Centralized logging, error handling, JSDoc coverage, validation utilities
- **Full Project Export:** Download all generated files as a ready-to-build Fabric mod project

---

## 📁 Project Structure

```
fabric-mod-generator/
│
├── app.js                  # Main backend logic, UI orchestration
├── config.js               # Configuration manager
├── index.html              # Web UI
├── style.css               # UI styles & themes
│
├── data/
│   └── fabricConfig.js     # Mod configuration data (JS object)
│
├── generators/             # Modular code generators
│   ├── baseGenerator.js
│   ├── blockGenerator.js
│   ├── commandGenerator.js
│   ├── configGenerator.js
│   ├── entityGenerator.js
│   ├── itemGenerator.js
│   ├── mixinGenerator.js
│   ├── modelParticleGenerator.js
│   ├── overlayGenerator.js
│   ├── recipeEventGenerator.js
│   ├── rendererGenerator.js
│   └── screenGenerator.js
│
├── utils/                  # Shared utilities
│   ├── configProfiles.js
│   ├── downloadManager.js
│   ├── loggerCache.js
│   ├── templateManager.js
│   └── validators.js
│
├── docs/                   # Documentation & guides
│   ├── 1/
│   │   ├── COMPLETE_SUMMARY.md
│   │   ├── ENHANCEMENT_PLAN.md
│   │   ├── IMPLEMENTATION_GUIDE.md
│   │   ├── QUICK_START_CHECKLIST.md
│   │   └── ...
│   └── 2/
│       └── ...
│
└── .github/
    └── copilot-instructions.md
```

---

## 🖥️ Quick Start

1. **Install Node.js** (v16+ recommended)
2. **Clone the repo:**
   ```bash
   git clone https://github.com/yourname/fabric-mod-generator.git
   cd fabric-mod-generator
   ```
3. **Run the backend:**
   ```bash
   node app.js
   ```
4. **Open `index.html` in your browser.**
5. **Configure your mod** in the UI, select generators, and click **Generate Template**.
6. **Export** your project or download generated files as ZIP.

---

## 🛠️ Developer Guide

- **Add a Generator:**
  Create a new file in `generators/`, export a function (e.g., `generateMyFeature`), and update `app.js` to register it.
- **Edit Templates:**
  Use `utils/templateManager.js` for template logic.
- **Validation:**
  Add or update validation rules in `utils/validators.js`.
- **Configuration:**
  Edit `data/fabricConfig.js` for mod defaults and structure.
- **Debugging:**
  Edit generator modules and reload the app. No build step required.

---

## ⌨️ Keyboard Shortcuts

- **Ctrl + G**: Generate Templates
- **Ctrl + E**: Export Project
- **Ctrl + S**: Save Configuration
- **Ctrl + Z**: Undo
- **Ctrl + Shift + Z**: Redo

---

## 📝 Configuration

- **Profiles:**
  Save/load mod configurations using the UI or localStorage.
- **Minecraft Versions:**
  Switch between supported versions in the UI (e.g., 1.21.10, 1.21).

---

## 📚 Documentation

- **[COMPLETE_SUMMARY.md](docs/1/COMPLETE_SUMMARY.md):** Full enhancement summary and feature list
- **[ENHANCEMENT_PLAN.md](docs/1/ENHANCEMENT_PLAN.md):** Strategic overview and implementation details
- **[IMPLEMENTATION_GUIDE.md](docs/1/IMPLEMENTATION_GUIDE.md):** Step-by-step setup and integration guide
- **[QUICK_START_CHECKLIST.md](docs/1/QUICK_START_CHECKLIST.md):** Setup checklist for new users

---

## 🧑‍💻 Contributing

1. Fork the repo and create a feature branch.
2. Follow the generator and utility patterns described in `.github/copilot-instructions.md`.
3. Submit a pull request with a clear description.

---

## 🛡️ License

MIT License. See [LICENSE](LICENSE) for details.

---

## 💬 Support

- **Common Issues:**
  See the "Support" section in [COMPLETE_SUMMARY.md](docs/1/COMPLETE_SUMMARY.md).
- **Contact:**
  Open an issue or discussion on GitHub.

---

**Version:** 3.0.0
**Release Date:** 2025-12-31
**Status:** ✅ Production Ready

---
