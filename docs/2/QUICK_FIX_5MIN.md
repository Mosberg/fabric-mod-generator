# ⚡ QUICK REFERENCE - 5-MINUTE FIX

## 🎯 TL;DR

**Problem**: Recipe & Event generators fail with "undefined" error  
**Solution**: Add 20 lines of code to app.js  
**Time**: 5 minutes  
**Result**: All 11 generators work  

---

## 📝 Copy-Paste Solution

### Step 1: Find this in app.js

Search for `async generateMod()` (around line 270)

### Step 2: Replace this section:

**FIND:**
```javascript
for (const type of this.#selectedGenerators) {
  const result = await this.generators.generate(type, config);
  results.push(result);
  this.#generatedFiles.set(result.filename, result);
}
```

**REPLACE WITH:**
```javascript
for (const type of this.#selectedGenerators) {
  const generatorOptions = this._getGeneratorOptions(type);
  const configWithOptions = { ...config, generatorOptions };
  const result = await this.generators.generate(type, configWithOptions);
  results.push(result);
  this.#generatedFiles.set(result.filename, result);
}
```

### Step 3: Add this helper method

Paste anywhere inside the `FabricModGenerator` class:

```javascript
/**
 * Get generator-specific options for recipe and event generators
 * @private
 * @param {string} type - Generator type ('recipe', 'event', etc.)
 * @returns {Object} Generator-specific options
 */
_getGeneratorOptions(type) {
  if (type === 'recipe') {
    return {
      recipeType: 'crafting_shaped',
      outputItem: 'examplemod:example_item',
      outputCount: 1,
      ingredients: 'A: minecraft:iron_ingot\nB: minecraft:stick',
      pattern: 'AAA\n B \n B ',
      cookingTime: 200,
      experience: 0.7
    };
  } else if (type === 'event') {
    return {
      eventType: 'server_tick',
      className: 'MyEventListener'
    };
  }
  return {};
}
```

### Step 4: Save & Reload

1. Save app.js
2. Reload page in browser
3. Click "Generate"
4. ✅ All 11 generators work!

---

## ✅ Verification

### Before Fix
```
[ERROR] generate:recipe "Unsupported recipe type: undefined"
[ERROR] generate:event "Unsupported event type: undefined"
[INFO] Generation complete {files: 9}
```

### After Fix
```
[INFO] Cache MISS: recipe
[INFO] Cache MISS: event
[INFO] Generation complete {files: 11}
```

---

## 🔍 What Changed?

| Line | Before | After |
|------|--------|-------|
| 1 | `const result =` | `const generatorOptions =` |
| 2 | `this.generators.generate` | `this._getGeneratorOptions(type)` |
| 3 | (no line) | `const configWithOptions = {...}` |
| 4 | (no line) | `this.generators.generate(type,` |
| 5 | (no line) | `configWithOptions)` |

**Net change**: Add 3 lines to loop, add 20-line helper method

---

## 📚 For More Details

- **ROOT CAUSE**: See ERROR_ROOT_CAUSE_ANALYSIS.md
- **VISUAL GUIDE**: See VISUAL_DEBUG_GUIDE.md
- **FULL IMPLEMENTATION**: See HOTFIX_RECIPE_EVENT_BUG.md
- **CURRENT STATUS**: See FINAL_STATUS_SUMMARY.md

---

## ⏱️ Timeline

```
Start: 0 min
│
├─ 1 min: Find app.js
├─ 2 min: Update loop
├─ 3 min: Add helper method
├─ 4 min: Save file
├─ 5 min: Reload page
│
└─ ✅ Done! Verify in console
   
   Total: 5 minutes
```

---

## ⚠️ Don't Forget

- [ ] Save app.js after changes
- [ ] Reload page (Ctrl+R or Cmd+R)
- [ ] Check browser console for verification
- [ ] Test with "Generate" button
- [ ] Verify 11 files generated (not 9)

---

## 🚀 You're Ready!

This is a simple, low-risk fix. Just copy-paste the two code blocks, save, and reload.

**Good luck! 🎉**
