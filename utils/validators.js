export class Validator {
  validateModId(modId) {
    const validModId = /^[a-z0-9\-_]{2,64}$/;
    if (!validModId.test(modId)) {
      return {
        valid: false,
        error:
          "Mod ID must be 2-64 lowercase letters, numbers, hyphens, underscores",
      };
    }
    return { valid: true };
  }

  validateClassName(className) {
    const validClassName = /^[A-Z][A-Za-z0-9]{2,64}$/;
    if (!validClassName.test(className)) {
      return {
        valid: false,
        error:
          "Class name must start with uppercase letter, 3-64 alphanumeric characters",
      };
    }
    return { valid: true };
  }

  validatePackageName(packageName) {
    const validPackage = /^[a-z][a-z0-9_.]{2,64}$/;
    if (!validPackage.test(packageName)) {
      return {
        valid: false,
        error:
          "Package name must be 3-64 chars, lowercase, dot-separated (e.g., com.example.mod)",
      };
    }
    return { valid: true };
  }

  validateVersion(version) {
    const validVersion = /^\d+\.\d+\.\d+([-.\w]*)?$/;
    if (!validVersion.test(version)) {
      return {
        valid: false,
        error: "Version must be in format X.Y.Z (e.g., 1.0.0)",
      };
    }
    return { valid: true };
  }

  validateAuthors(authors) {
    if (!authors || authors.length === 0) {
      return { valid: false, error: "At least one author required" };
    }
    return { valid: true };
  }

  getValidationForType(type, name) {
    const validators = {
      command: this.validateModId,
      entity: this.validateClassName,
      block: this.validateClassName,
      item: this.validateClassName,
      mixin: this.validateClassName,
      config: this.validateClassName,
      overlay: this.validateClassName,
      renderer: this.validateClassName,
      screen: this.validateClassName,
      biome: this.validateClassName,
    };
    const validator = validators[type] || this.validateClassName;
    return validator.call(this, name);
  }

  validateBasicConfig() {
    const modId = document.getElementById("modId").value.trim();
    const className = document.getElementById("className").value.trim();
    const packageName = document.getElementById("packageName").value.trim();
    const version = document.getElementById("version")?.value.trim() || "1.0.0";
    const authors = document.getElementById("authors")?.value.trim() || "";
    const errors = {};
    if (!this.validateModId(modId).valid)
      errors.modId = this.validateModId(modId).error;
    if (!this.validateClassName(className).valid)
      errors.className = this.validateClassName(className).error;
    if (!this.validatePackageName(packageName).valid)
      errors.packageName = this.validatePackageName(packageName).error;
    if (!this.validateVersion(version).valid)
      errors.version = this.validateVersion(version).error;
    if (!this.validateAuthors(authors.split(",")).valid)
      errors.authors = this.validateAuthors(authors.split(",")).error;
    return Object.keys(errors).length === 0 ? true : errors;
  }

  validateFullConfig() {
    return this.validateBasicConfig();
  }
}
