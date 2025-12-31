export class Validator {
  static MODID_REGEX = /^[a-z0-9\-_]{2,64}$/;
  static CLASSNAME_REGEX = /^[A-Z][A-Za-z0-9]{2,63}$/;
  static PACKAGE_REGEX = /^[a-z][a-z0-9_.]{2,63}$/;
  static VERSION_REGEX = /^\d+\.\d+\.\d+([-.\w]*)?$/;

  validateModId(modId) {
    if (!Validator.MODID_REGEX.test(modId)) {
      return {
        valid: false,
        error:
          "Mod ID must be 2-64 lowercase letters, numbers, hyphens, underscores",
      };
    }
    return { valid: true };
  }

  validateClassName(className) {
    if (!Validator.CLASSNAME_REGEX.test(className)) {
      return {
        valid: false,
        error:
          "Class name must start with uppercase letter, 3-64 alphanumeric characters",
      };
    }
    return { valid: true };
  }

  validatePackageName(packageName) {
    if (!Validator.PACKAGE_REGEX.test(packageName)) {
      return {
        valid: false,
        error:
          "Package name must be 3-64 chars, lowercase, dot-separated (e.g., com.example.mod)",
      };
    }
    return { valid: true };
  }

  validateVersion(version) {
    if (!Validator.VERSION_REGEX.test(version)) {
      return {
        valid: false,
        error: "Version must be in format X.Y.Z (e.g., 1.0.0)",
      };
    }
    return { valid: true };
  }

  validateAuthors(authors) {
    if (!authors || authors.filter((a) => a.trim()).length === 0) {
      // ^ ensure at least one non-empty author
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
    const modIdResult = this.validateModId(modId);
    if (!modIdResult.valid) errors.modId = modIdResult.error;
    const classNameResult = this.validateClassName(className);
    if (!classNameResult.valid) errors.className = classNameResult.error;
    const packageNameResult = this.validatePackageName(packageName);
    if (!packageNameResult.valid) errors.packageName = packageNameResult.error;
    const versionResult = this.validateVersion(version);
    if (!versionResult.valid) errors.version = versionResult.error;
    const authorsArr = authors
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    const authorsResult = this.validateAuthors(authorsArr);
    if (!authorsResult.valid) errors.authors = authorsResult.error;
    return Object.keys(errors).length === 0 ? true : errors;
  }

  validateFullConfig() {
    return this.validateBasicConfig();
  }
}
