export class ConfigurationProfileManager {
  /**
   * Save configuration profile
   * @param {string} name - Profile name
   * @param {Object} config - Configuration object
   */
  save(name, config) {
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    const key = `fabric_profile_${name}`;
    localStorage.setItem(key, JSON.stringify(config));
    this.updateProfileList();
  }

  /**
   * Load configuration profile
   * @param {string} name - Profile name
   * @returns {Object|null}
   */
  load(name) {
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    const key = `fabric_profile_${name}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get all saved profiles
   * @returns {string[]}
   */
  listAll() {
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    return Object.keys(localStorage)
      .filter((k) => k.startsWith("fabric_profile_"))
      .map((k) => k.replace("fabric_profile_", ""));
  }

  /**
   * Delete profile
   * @param {string} name - Profile name
   */
  delete(name) {
    if (typeof localStorage === "undefined") {
      throw new Error("localStorage is not available in this environment.");
    }
    localStorage.removeItem(`fabric_profile_${name}`);
    this.updateProfileList();
  }

  /**
   * Update UI profile list
   * @private
   */
  updateProfileList() {
    let profiles = [];
    try {
      profiles = this.listAll();
    } catch (e) {
      // localStorage not available, skip UI update
      return;
    }
    if (typeof document !== "undefined") {
      const select = document.getElementById("profileSelect");
      if (select) {
        select.innerHTML = profiles
          .map((p) => `<option value="${p}">${p}</option>`)
          .join("");
      }
    }
  }
}
