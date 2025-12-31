/**
 * 🔧 FABRIC MOD GENERATOR V3.2 - HOTFIX GUIDE
 * 
 * ERROR: Recipe & Event generators receiving undefined options
 * ROOT CAUSE: app.js not properly passing generatorOptions to generators
 * 
 * SOLUTION: 2 simple fixes
 */

## ISSUE ANALYSIS

### Error Logs Show:
```
[ERROR] [GeneratorManager] generate:recipe {"message":"Unsupported recipe type: undefined",...}
[ERROR] [GeneratorManager] generate:event {"message":"Unsupported event type: undefined",...}
```

### Root Cause:
The generators expect options in `config.generatorOptions` but app.js passes generic config

### Fix Location: app.js → generateMod() method

---

## QUICK FIX (5 minutes)

### Step 1: Update app.js generateMod() method

**Find this section in app.js (around line 270-290):**
```javascript
async generateMod() {
  try {
    const config = this.config.getCurrentConfig();
    const results = [];

    for (const type of this.#selectedGenerators) {
      // FIX NEEDED HERE
      const result = await this.generators.generate(type, config);
      // ...
    }
  }
}
```

**Replace with:**
```javascript
async generateMod() {
  try {
    const config = this.config.getCurrentConfig();
    const results = [];

    for (const type of this.#selectedGenerators) {
      // Get generator-specific options from UI/form
      const generatorOptions = this._getGeneratorOptions(type);
      
      // Pass complete config with generatorOptions
      const configWithOptions = {
        ...config,
        generatorOptions
      };
      
      const result = await this.generators.generate(type, configWithOptions);
      results.push(result);
      this.#generatedFiles.set(result.filename, result);
    }

    this.renderOutput(results);
    this.logger.info(`Generation complete`, { files: results.length });
  } catch (error) {
    this.logger.error('Generation failed', error);
    this.showToast('Generation failed: ' + error.message, 'error');
  }
}
```

### Step 2: Add helper method to app.js

**Add this new method to the FabricModGenerator class (anywhere inside the class):**

```javascript
/**
 * Get generator-specific options for recipe and event generators
 * @private
 * @param {string} type - Generator type
 * @returns {Object} Generator options with type and defaults
 */
_getGeneratorOptions(type) {
  if (type === 'recipe') {
    return {
      recipeType: document.getElementById('recipeType')?.value || 'crafting_shaped',
      outputItem: document.getElementById('outputItem')?.value || 'examplemod:example_item',
      outputCount: parseInt(document.getElementById('outputCount')?.value || '1'),
      ingredients: document.getElementById('ingredients')?.value || 'A: minecraft:iron_ingot\\nB: minecraft:stick',
      pattern: document.getElementById('pattern')?.value || 'AAA\\n B \\n B ',
      cookingTime: parseInt(document.getElementById('cookingTime')?.value || '200'),
      experience: parseFloat(document.getElementById('experience')?.value || '0.7')
    };
  } else if (type === 'event') {
    return {
      eventType: document.getElementById('eventType')?.value || 'server_tick',
      className: document.getElementById('eventClassName')?.value || 'MyEventListener'
    };
  }
  
  // Return empty object for other generators (they don't use generatorOptions)
  return {};
}
```

### Step 3: Update index.html form fields

**Make sure these input elements exist in index.html for recipe options:**
```html
<select id="recipeType" name="recipeType">
  <option value="crafting_shaped">Crafting Shaped</option>
  <option value="crafting_shapeless">Crafting Shapeless</option>
  <option value="smelting">Smelting</option>
  <option value="smoking">Smoking</option>
  <option value="blasting">Blasting</option>
</select>

<input type="text" id="outputItem" name="outputItem" placeholder="examplemod:example_item" value="examplemod:example_item">
<input type="number" id="outputCount" name="outputCount" value="1">
<textarea id="ingredients" name="ingredients">A: minecraft:iron_ingot
B: minecraft:stick</textarea>
<textarea id="pattern" name="pattern">AAA
 B 
 B </textarea>
<input type="number" id="cookingTime" name="cookingTime" value="200">
<input type="number" id="experience" name="experience" step="0.1" value="0.7">
```

**And for event options:**
```html
<select id="eventType" name="eventType">
  <option value="server_tick">Server Tick</option>
  <option value="client_tick">Client Tick</option>
  <option value="player_join">Player Join</option>
  <option value="block_break">Block Break</option>
  <option value="entity_damage">Entity Damage</option>
  <option value="item_use">Item Use</option>
</select>

<input type="text" id="eventClassName" name="eventClassName" placeholder="MyEventListener" value="MyEventListener">
```

---

## VERIFICATION

**After applying fixes, check console for:**

✅ Before:
```
[ERROR] Unsupported recipe type: undefined
```

✅ After:
```
[INFO] Cache MISS: recipe
[INFO] Cache MISS: event
[INFO] Generation complete {files: 11}
```

### Test in Browser Console:
```javascript
// Check if options are being passed correctly
console.log(fabricModGenerator.config.getCurrentConfig());

// Should show:
// {
//   modId: "...",
//   modName: "...",
//   generatorOptions: {
//     recipeType: "crafting_shaped",
//     outputItem: "...",
//     ...
//   }
// }
```

---

## ALTERNATIVE: Minimal Quick Fix

If you want to keep things simple, just update the `generateMod()` method with hardcoded defaults:

```javascript
async generateMod() {
  const config = this.config.getCurrentConfig();
  const results = [];

  for (const type of this.#selectedGenerators) {
    // Add generator-specific defaults
    if (type === 'recipe') {
      config.generatorOptions = {
        recipeType: 'crafting_shaped',
        outputItem: 'examplemod:example_item',
        outputCount: 1,
        ingredients: 'A: minecraft:iron_ingot\\nB: minecraft:stick',
        pattern: 'AAA\\n B \\n B ',
        cookingTime: 200,
        experience: 0.7
      };
    } else if (type === 'event') {
      config.generatorOptions = {
        eventType: 'server_tick',
        className: 'MyEventListener'
      };
    }

    const result = await this.generators.generate(type, config);
    results.push(result);
    this.#generatedFiles.set(result.filename, result);
  }

  this.renderOutput(results);
}
```

---

## SUMMARY

**Problem**: Recipe/Event generators get `undefined` types  
**Cause**: app.js not passing `generatorOptions` in config  
**Solution**: 
1. Update `generateMod()` to include `generatorOptions`
2. Add `_getGeneratorOptions()` helper method
3. Update `index.html` form fields (optional but recommended)

**Time to fix**: 5-10 minutes  
**Impact**: All 11 generators will work properly  
**Testing**: Run generation, check console logs

---

**✅ After this fix, your logs should show:**
```
[INFO] ✅ v3.2 LOADED - Ultra Optimized [11/11 generators]
[INFO] Cache MISS: recipe
[INFO] Cache MISS: event
[INFO] Generation complete {files: 11}
```
