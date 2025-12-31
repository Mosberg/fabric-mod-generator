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

  getValidationForType(type, name) {
    const validators = {
      command: this.validateModId,
      entity: this.validateClassName,
      block: this.validateClassName,
      item: this.validateClassName,
    };

    const validator = validators[type] || this.validateClassName;
    return validator.call(this, name);
  }

  validateBasicConfig() {
    const modId = document.getElementById("modId").value.trim();
    const className = document.getElementById("className").value.trim();
    return (
      modId &&
      className &&
      this.validateModId(modId).valid &&
      this.validateClassName(className).valid
    );
  }

  validateFullConfig() {
    return this.validateBasicConfig();
  }
}
