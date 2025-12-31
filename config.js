import configData from "./data/fabricConfig.js"; // Change .json to .js

export class ConfigManager {
  constructor() {
    this.staticConfig = configData;
    this.config = {
      ...configData.defaultValues,
      ...configData,
      modId: "example-mod",
      modName: "Example Mod",
      packageName: "com.example",
      className: "MyExampleEntity",
    };
  }

  getPackage(type) {
    return this.staticConfig.packageStructure[type] || this.config.packageName;
  }

  getRegistryType(type) {
    return this.staticConfig.registryTypes[type] || type.toUpperCase();
  }

  getCurrentConfig() {
    return {
      ...this.config,
      modId:
        document.getElementById("modId")?.value.trim() || this.config.modId,
      modName:
        document.getElementById("modName")?.value.trim() || this.config.modName,
      packageName:
        document.getElementById("packageName")?.value.trim() ||
        this.config.packageName,
      className:
        document.getElementById("className")?.value.trim() ||
        this.config.className,
      version:
        document.getElementById("version")?.value.trim() || this.config.version,
      authors:
        document.getElementById("authors")?.value.trim() || this.config.authors,
      description:
        document.getElementById("description")?.value.trim() ||
        this.config.description,
      clientSideOnly:
        document.getElementById("clientSideOnly")?.checked ?? false,
      minecraftVersion:
        document.querySelector(".version-card.active")?.dataset.mc || "1.21.10",
    };
  }

  setMinecraftVersion(version) {
    this.config.minecraftVersion = version;
  }
}
function assert(condition, message) {
  if (!condition) {
    console.error("Assertion failed:", message);
    // Optionally throw an error or handle it differently
    // throw new Error(message || "Assertion failed");
  }
}

// Now you can use it:
assert(true, "This is a test assertion.");
