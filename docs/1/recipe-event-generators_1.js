import { BaseGenerator } from "./baseGenerator.js";

const RECIPE_TYPES = {
  CRAFTING_SHAPED: "crafting_shaped",
  CRAFTING_SHAPELESS: "crafting_shapeless",
  SMELTING: "smelting",
  SMOKING: "smoking",
  BLASTING: "blasting",
};

const EVENT_TYPES = {
  SERVER_TICK: "server_tick",
  CLIENT_TICK: "client_tick",
  PLAYER_JOIN: "player_join",
  BLOCK_BREAK: "block_break",
  ENTITY_DAMAGE: "entity_damage",
  ITEM_USE: "item_use",
};

const RECIPE_GENERATORS = {
  [RECIPE_TYPES.CRAFTING_SHAPED]: "_generateShapedRecipe",
  [RECIPE_TYPES.CRAFTING_SHAPELESS]: "_generateShapelessRecipe",
  [RECIPE_TYPES.SMELTING]: "_generateSmeltingRecipe",
  [RECIPE_TYPES.SMOKING]: "_generateSmokingRecipe",
  [RECIPE_TYPES.BLASTING]: "_generateBlastingRecipe",
};

const EVENT_CONFIG = {
  [EVENT_TYPES.SERVER_TICK]: {
    import:
      "import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;",
    method: "_generateServerTickMethod",
    registration:
      "ServerTickEvents.END_SERVER_TICK.register(server => new {name}().onTick(server));",
  },
  [EVENT_TYPES.CLIENT_TICK]: {
    import:
      "import net.fabricmc.fabric.api.event.lifecycle.v1.ClientTickEvents;",
    method: "_generateClientTickMethod",
    registration:
      "ClientTickEvents.END_CLIENT_TICK.register(client => new {name}().onTick(client));",
  },
  [EVENT_TYPES.PLAYER_JOIN]: {
    import:
      "import net.fabricmc.fabric.api.networking.v1.ServerPlayConnectionEvents;",
    method: "_generatePlayerJoinMethod",
    registration:
      "ServerPlayConnectionEvents.JOIN.register((handler, server) => new {name}().onPlayerJoin());",
  },
  [EVENT_TYPES.BLOCK_BREAK]: {
    import:
      "import net.fabricmc.fabric.api.event.player.PlayerBlockBreakEvents;",
    method: "_generateBlockBreakMethod",
    registration:
      "PlayerBlockBreakEvents.AFTER.register(world => new {name}().onBlockBreak());",
  },
  [EVENT_TYPES.ENTITY_DAMAGE]: {
    import: "import net.fabricmc.fabric.api.event.entity.EntitySoundEvents;",
    method: "_generateEntityDamageMethod",
    registration:
      "EntitySoundEvents.HURT.register((entity, source) => new {name}().onDamage());",
  },
  [EVENT_TYPES.ITEM_USE]: {
    import: "import net.fabricmc.fabric.api.event.player.UseItemCallback;",
    method: "_generateItemUseMethod",
    registration:
      "UseItemCallback.EVENT.register((player, world, hand) => new {name}().onItemUse());",
  },
};

export class RecipeGenerator extends BaseGenerator {
  static getOptions() {
    return [
      {
        name: "recipeType",
        label: "Recipe Type",
        type: "select",
        options: Object.values(RECIPE_TYPES),
        default: RECIPE_TYPES.CRAFTING_SHAPED,
      },
      {
        name: "outputItem",
        label: "Output Item (modid:item_name)",
        type: "text",
        default: "examplemod:example_item",
      },
      {
        name: "outputCount",
        label: "Output Count",
        type: "number",
        default: 1,
      },
      {
        name: "ingredients",
        label: "Ingredients (for crafting recipes)",
        type: "textarea",
        default: "A: minecraft:iron_ingot\nB: minecraft:stick",
      },
      {
        name: "pattern",
        label: "Pattern (for shaped recipes)",
        type: "textarea",
        default: "AAA\n B \n B ",
      },
      {
        name: "cookingTime",
        label: "Cooking Time (for smelting, smoking, blasting)",
        type: "number",
        default: 200,
      },
      {
        name: "experience",
        label: "Experience (for smelting, smoking, blasting)",
        type: "number",
        default: 0.7,
      },
    ];
  }

  generate(data) {
    const methodName = RECIPE_GENERATORS[data.recipeType];
    if (methodName && this[methodName]) {
      return this[methodName](data);
    }
    throw new Error("Unsupported recipe type: " + data.recipeType);
  }

  _generateShapedRecipe(data) {
    const ingredients = this._parseIngredients(data.ingredients);
    const pattern = data.pattern.split("\n").map((line) => line.trim());
    return {
      type: "minecraft:crafting_shaped",
      pattern: pattern,
      key: ingredients,
      result: {
        item: data.outputItem,
        count: data.outputCount,
      },
    };
  }

  _generateShapelessRecipe(data) {
    const ingredients = this._parseIngredients(data.ingredients);
    return {
      type: "minecraft:crafting_shapeless",
      ingredients: Object.values(ingredients),
      result: {
        item: data.outputItem,
        count: data.outputCount,
      },
    };
  }

  _generateSmeltingRecipe(data) {
    return {
      type: "minecraft:smelting",
      ingredient: { item: data.ingredients.trim() },
      result: data.outputItem,
      experience: data.experience,
      cookingtime: data.cookingTime,
    };
  }

  _generateSmokingRecipe(data) {
    return {
      type: "minecraft:smoking",
      ingredient: { item: data.ingredients.trim() },
      result: data.outputItem,
      experience: data.experience,
      cookingtime: data.cookingTime,
    };
  }

  _generateBlastingRecipe(data) {
    return {
      type: "minecraft:blasting",
      ingredient: { item: data.ingredients.trim() },
      result: data.outputItem,
      experience: data.experience,
      cookingtime: data.cookingTime,
    };
  }

  _parseIngredients(ingredientsText) {
    const ingredients = {};
    ingredientsText.split("\n").forEach((line) => {
      const [key, item] = line.split(":").map((part) => part.trim());
      if (key && item) {
        ingredients[key] = { item };
      }
    });
    return ingredients;
  }
}

export class EventGenerator extends BaseGenerator {
  static getOptions() {
    return [
      {
        name: "eventType",
        label: "Event Type",
        type: "select",
        options: Object.values(EVENT_TYPES),
        default: EVENT_TYPES.SERVER_TICK,
      },
      {
        name: "className",
        label: "Listener Class Name",
        type: "text",
        default: "MyEventListener",
      },
    ];
  }

  generate(data) {
    const config = EVENT_CONFIG[data.eventType];
    if (config) {
      return this._generateEventListener(data, config);
    }
    throw new Error("Unsupported event type: " + data.eventType);
  }

  _generateEventListener(data, config) {
    const className = data.className;
    const importStatement = config.import;
    const methodBody = this[config.method](className);
    const registrationCode = config.registration.replace("{name}", className);

    return (
      importStatement +
      "\n\n" +
      "class " +
      className +
      " {\n" +
      methodBody +
      "\n" +
      "}\n\n" +
      "// Registration\n" +
      registrationCode
    );
  }

  _generateServerTickMethod(className) {
    return "  onTick(server) {\n    // Your code here\n  }";
  }

  _generateClientTickMethod(className) {
    return "  onTick(client) {\n    // Your code here\n  }";
  }

  _generatePlayerJoinMethod(className) {
    return "  onPlayerJoin() {\n    // Your code here\n  }";
  }

  _generateBlockBreakMethod(className) {
    return "  onBlockBreak() {\n    // Your code here\n  }";
  }

  _generateEntityDamageMethod(className) {
    return "  onDamage() {\n    // Your code here\n  }";
  }

  _generateItemUseMethod(className) {
    return "  onItemUse() {\n    // Your code here\n  }";
  }
}
