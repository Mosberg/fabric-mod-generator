# 🚀 Fabric Mod Generator v3.0 – Quick Start Checklist

## 1. Installation Checklist

### Step 1: Copy New Files

```bash
# Copy to utils/ directory
□ logger-cache.js

# Copy to generators/ directory
□ recipe-event-generators.js

# Copy to root directory
□ app-enhanced-v3.js (optional – keep app.js as fallback)
```

### Step 2: Update Existing Files

#### `config.js`

```javascript
// Add after existing imports:
import { Logger, GenerationCache } from "./utils/logger-cache.js";

// Add to class:
this.logger = new Logger("Config", "INFO");
this.cache = new GenerationCache(50); // 50 MB max
```

#### `index.html`

```html
<!-- Add to header section (before closing </header> or at top of body): -->
<button id="themeToggle" class="theme-btn" title="Toggle dark/light mode">
  🌙
</button>

<!-- Add search box before generator grid: -->
<input
  type="text"
  id="generatorSearch"
  placeholder="Search generators..."
  class="search-input"
  aria-label="Search generators"
/>
```

#### `style.css`

```css
/* Add at the very top: */
:root {
  --bg-primary: #0f1419;
  --bg-secondary: #1a2332;
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
  --primary: #ffd700;
  --success: #48bb78;
  --error: #f56565;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fc;
  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --primary: #e6c200;
  --success: #22863a;
  --error: #cb2431;
}

/* Theme toggle button styling */
.theme-btn {
  background: none;
  border: 1px solid var(--primary);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}
.theme-btn:hover {
  transform: scale(1.1);
  background: var(--primary);
  color: var(--bg-primary);
}

/* Search input styling */
.search-input {
  width: 100%;
  max-width: 300px;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border: 1px solid var(--primary);
  color: var(--text-primary);
  border-radius: 6px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}
.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}
```

### Step 3: Update `app.js` (or create `app-enhanced-v3.js`)

```javascript
// Add after existing imports:
import { Logger, GenerationCache } from './utils/logger-cache.js';
import { RecipeGenerator, EventListenerGenerator } from './generators/recipe-event-generators.js';

// Add to class constructor:
this.logger = new Logger('FabricGen', 'INFO');
this.generationCache = new GenerationCache(50);
this.history = { undo: [], redo: [] };
this.currentTheme = localStorage.getItem('theme') || 'dark';

// Add these methods:

/** Initialize theme system */
initTheme() {
  document.documentElement.setAttribute('data-theme', this.currentTheme);
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => this.toggleTheme());
    this.updateThemeButton();
  }
}

/** Toggle between dark and light theme */
toggleTheme() {
  this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', this.currentTheme);
  localStorage.setItem('theme', this.currentTheme);
  this.updateThemeButton();
  this.logger.info(`Theme switched to ${this.currentTheme}`);
}

/** Update theme button icon */
updateThemeButton() {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
  }
}

/** Initialize search/filter */
initSearch() {
  const searchInput = document.getElementById('generatorSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.filterGenerators(query);
    });
  }
}

/** Filter generators by search query */
filterGenerators(query) {
  const cards = document.querySelectorAll('.generator-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? 'block' : 'none';
  });
}

/** Initialize keyboard shortcuts */
initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+G: Generate
    if (e.ctrlKey && e.key === 'g') {
      e.preventDefault();
      this.generateTemplates();
    }
    // Ctrl+E: Export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      this.downloadManager.generateZip(Array.from(this.generatedFiles.values()));
    }
    // Ctrl+S: Save configuration
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      this.saveConfiguration();
    }
    // Ctrl+Z: Undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.undo();
    }
    // Ctrl+Shift+Z: Redo
    if (e.ctrlKey && e.shiftKey && e.key === 'z') {
      e.preventDefault();
      this.redo();
    }
  });
}

/** Show toast notification */
showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

/** Save configuration to profile */
saveConfiguration() {
  const config = this.config.getCurrentConfig();
  const profileName = prompt('Profile name:');
  if (profileName) {
    const key = `fabric_profile_${profileName}`;
    localStorage.setItem(key, JSON.stringify(config));
    this.showToast(`Configuration saved: ${profileName}`, 'success');
    this.logger.info('Configuration saved', { profileName });
  }
}

/** Undo last action */
undo() {
  if (this.history.undo.length > 0) {
    const state = this.history.undo.pop();
    this.history.redo.push(this.config.getCurrentConfig());
    this.config.setConfig(state);
    this.showToast('Undo executed', 'info');
  }
}

/** Redo last undo */
redo() {
  if (this.history.redo.length > 0) {
    const state = this.history.redo.pop();
    this.history.undo.push(this.config.getCurrentConfig());
    this.config.setConfig(state);
    this.showToast('Redo executed', 'info');
  }
}

/** Update in registerAllGenerators() to include new generators: */
registerAllGenerators() {
  // ... existing code ...
  this.generators.registerGenerator('recipe', RecipeGenerator);
  this.generators.registerGenerator('event', EventListenerGenerator);
}

/** Update in init() to initialize new systems: */
init() {
  // ... existing code ...
  this.initTheme();
  this.initSearch();
  this.initKeyboardShortcuts();
}
```

---

## 2. Testing Checklist

### Unit Tests

- [ ] Logger logs at all levels (DEBUG, INFO, WARN, ERROR)
- [ ] Cache stores and retrieves items correctly
- [ ] Cache hit rate tracks properly
- [ ] Theme toggle saves to localStorage
- [ ] Search filter hides/shows generators
- [ ] Keyboard shortcuts work for all 5 commands
- [ ] Undo/redo stack maintains state correctly

### Integration Tests

- [ ] Recipe generator creates valid JSON
- [ ] Event listener generator creates valid Java code
- [ ] Multiple generators work together
- [ ] Download manager works with cached files
- [ ] Configuration profiles save and load
- [ ] Theme persists across page reload

### User Acceptance Tests

- [ ] Full workflow: Config → Select → Generate → Download
- [ ] Theme toggle switches and persists
- [ ] Search finds all generators
- [ ] Keyboard shortcuts work smoothly
- [ ] Toast notifications display correctly
- [ ] Error messages are helpful
- [ ] Performance is acceptable (<1.5s generation)

---

## 3. Performance Verification

### Browser Console Commands

```javascript
// Check cache statistics
console.log(app.generationCache.getStats());
// Output: { hits: 45, misses: 15, hitRate: '75%', size: '12.34 MB', items: 23, ... }

// Check logger output
app.logger.debug("Test message");
app.logger.info("Test info");
app.logger.warn("Test warning");
app.logger.error("Test error");

// Measure generation time
console.time("generate");
await app.generateTemplates();
console.timeEnd("generate");

// Check localStorage
console.log(localStorage.getItem("theme")); // 'dark' or 'light'
console.log(
  Object.keys(localStorage).filter((k) => k.startsWith("fabric_profile_"))
);
```

---

## 4. Troubleshooting Guide

### Generators Not Loading

**Solution:** Check browser console for import errors

```javascript
Object.keys(window); // Should include all generator classes
```

### Cache Not Working

**Solution:** Check if localStorage quota is exceeded

```javascript
app.generationCache.clearAll();
console.log(app.generationCache.getStats());
```

### Theme Not Persisting

**Solution:** Check localStorage access

```javascript
localStorage.setItem("test", "value");
console.log(localStorage.getItem("test")); // Should return 'value'
```

### Keyboard Shortcuts Not Responding

**Solution:** Check if focus is on an input field

```javascript
app.generateTemplates(); // Should work
```

---

## 5. Performance Optimization Tips

1. **Enable caching** for repeated generation
   ```javascript
   // Cache is automatic, monitor hit rate
   console.log(app.generationCache.getStats().hitRate);
   ```
2. **Use search filter** to reduce visual clutter
   - Speeds up DOM rendering
   - Better for large generator lists
3. **Save configurations** as profiles
   - Faster setup for common mod types
   - Reduces re-entry of data
4. **Use keyboard shortcuts**
   - Ctrl+G: 2-click to generate (vs 4-5 clicks)
   - Ctrl+E: Direct export (vs 3-4 clicks)
   - Ctrl+S: Save in 1 step (vs multiple dialogs)
5. **Monitor performance**
   ```javascript
   // Enable DEBUG logging
   app.logger.setLevel("DEBUG");
   // Watch console for timing information
   ```

---

## 6. Deployment Checklist

### Before Going Live

- [ ] All imports are correct and relative paths work
- [ ] No console errors on page load
- [ ] All 47 improvements are implemented
- [ ] Documentation is complete and linked
- [ ] JSDoc is 100% coverage
- [ ] All unit tests pass
- [ ] Performance is <1.5s with cache
- [ ] Mobile responsive tested
- [ ] Accessibility (WCAG 2.1 AA) verified
- [ ] Security review completed
- [ ] Backup of original files created

### After Deployment

- [ ] Monitor error rates in console
- [ ] Check cache hit rate periodically
- [ ] Collect user feedback
- [ ] Track performance metrics
- [ ] Monitor storage quota usage
- [ ] Plan next iteration (Phase 4)

---

## 7. Success Criteria

- ✅ **Performance:** <1.5s generation time (with cache)
- ✅ **Quality:** 100% JSDoc coverage
- ✅ **Features:** 47+ improvements implemented
- ✅ **User Experience:** 5 keyboard shortcuts available
- ✅ **Code:** Zero critical issues, <5% code duplication
- ✅ **Testing:** 85%+ test coverage
- ✅ **Documentation:** Complete with examples
- ✅ **Accessibility:** WCAG 2.1 AA compliant

---

**Status:** ✅ Ready to Implement
**Estimated Time:** 60–100 hours total
**Phase 1:** 16–20 hours
**Phase 2:** 24–32 hours
**Phase 3:** 16–24 hours
**Phase 4:** 20–30 hours (optional)
