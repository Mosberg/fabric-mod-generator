export class ConfigurationProfileManager {
  /**
   * Save configuration profile
   * @param {string} name - Profile name
   * @param {Object} config - Configuration object
   */
  save(name, config) {
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
    const key = `fabric_profile_${name}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get all saved profiles
   * @returns {string[]}
   */
  listAll() {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith("fabric_profile_"))
      .map((k) => k.replace("fabric_profile_", ""));
  }

  /**
   * Delete profile
   * @param {string} name - Profile name
   */
  delete(name) {
    localStorage.removeItem(`fabric_profile_${name}`);
    this.updateProfileList();
  }

  /**
   * Update UI profile list
   * @private
   */
  updateProfileList() {
    const profiles = this.listAll();
    const select = document.getElementById("profileSelect");
    if (select) {
      select.innerHTML = profiles
        .map((p) => `<option value="${p}">${p}</option>`)
        .join("");
    }
  }
}
