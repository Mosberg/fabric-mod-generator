import { Validator } from "../utils/validators.js";

export class BaseGenerator {
  constructor(config) {
    this.config = config;
    this.validator = new Validator();
  }

  validateName(name, type) {
    const validation = this.getValidationForType(type, name);
    if (!validation.valid) {
      throw new Error(`Invalid ${type} name \"${name}\": ${validation.error}`);
    }
    return true;
  }

  getValidationForType(type, name) {
    return this.validator.getValidationForType(type, name);
  }

  getModId(name) {
    return `${this.config.modId}:${name.toLowerCase()}`;
  }

  getPackage(type) {
    const packages = {
      entity: `${this.config.packageName}.entity`,
      block: `${this.config.packageName}.block`,
      item: `${this.config.packageName}.item`,
      command: `${this.config.packageName}.command`,
      renderer: `${this.config.packageName}.client.render`,
      screen: `${this.config.packageName}.client.screen`,
      overlay: `${this.config.packageName}.client.overlay`,
      config: `${this.config.packageName}.config`,
      mixin: `${this.config.packageName}.mixin`,
    };
    return packages[type] || this.config.packageName;
  }

  getFabricImports(type) {
    const commonImports = [
      "import net.minecraft.util.Identifier;",
      "import net.minecraft.registry.Registries;",
      "import net.minecraft.registry.Registry;",
      "import net.fabricmc.api.ModInitializer;",
    ];

    const typeImports = {
      entity: [
        "import net.minecraft.entity.EntityType;",
        "import net.minecraft.entity.LivingEntity;",
        "import net.minecraft.entity.SpawnGroup;",
        "import net.minecraft.entity.ai.goal.MeleeAttackGoal;",
        "import net.minecraft.entity.ai.goal.WanderAroundFarGoal;",
        "import net.minecraft.entity.ai.goal.LookAroundGoal;",
        "import net.minecraft.entity.attribute.DefaultAttributeContainer;",
        "import net.minecraft.entity.attribute.EntityAttributes;",
        "import net.minecraft.entity.damage.DamageSource;",
        "import net.minecraft.entity.player.PlayerEntity;",
        "import net.minecraft.world.World;",
      ],
      block: [
        "import net.minecraft.block.Block;",
        "import net.minecraft.block.BlockState;",
        "import net.minecraft.block.Material;",
        "import net.minecraft.block.ShapeContext;",
        "import net.minecraft.item.BlockItem;",
        "import net.minecraft.item.Item;",
        "import net.minecraft.item.ItemGroup;",
        "import net.minecraft.sound.BlockSoundGroup;",
        "import net.minecraft.util.math.BlockPos;",
        "import net.minecraft.util.shape.VoxelShape;",
        "import net.minecraft.util.shape.VoxelShapes;",
        "import net.minecraft.world.BlockView;",
      ],
      item: [
        "import net.minecraft.item.Item;",
        "import net.minecraft.item.ItemGroup;",
        "import net.minecraft.item.ItemStack;",
        "import net.minecraft.client.item.TooltipContext;",
        "import net.minecraft.text.Text;",
        "import net.minecraft.world.World;",
      ],
      command: [
        "import com.mojang.brigadier.CommandDispatcher;",
        "import com.mojang.brigadier.arguments.IntegerArgumentType;",
        "import com.mojang.brigadier.context.CommandContext;",
        "import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;",
        "import net.minecraft.server.command.CommandManager;",
        "import net.minecraft.server.command.ServerCommandSource;",
        "import net.minecraft.server.network.ServerPlayerEntity;",
        "import net.minecraft.text.Text;",
      ],
      renderer: [
        "import net.fabricmc.api.EnvType;",
        "import net.fabricmc.api.Environment;",
        "import net.minecraft.client.render.VertexConsumerProvider;",
        "import net.minecraft.client.render.entity.EntityRendererFactory;",
        "import net.minecraft.client.render.entity.LivingEntityRenderer;",
        "import net.minecraft.client.util.math.MatrixStack;",
      ],
      screen: [
        "import net.minecraft.client.gui.screen.ingame.HandledScreens;",
        "import net.minecraft.client.gui.screen.ingame.HandledScreen;",
        "import net.minecraft.entity.player.PlayerInventory;",
        "import net.minecraft.text.Text;",
        "import net.minecraft.screen.ScreenHandler;",
        "import net.minecraft.screen.slot.Slot;",
        "import net.fabricmc.api.EnvType;",
        "import net.fabricmc.api.Environment;",
      ],
      overlay: [
        "import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;",
        "import net.minecraft.client.MinecraftClient;",
        "import net.minecraft.client.gui.DrawContext;",
        "import net.minecraft.client.util.math.MatrixStack;",
        "import net.minecraft.text.Text;",
        "import net.minecraft.util.math.MathHelper;",
        "import net.fabricmc.api.EnvType;",
        "import net.fabricmc.api.Environment;",
      ],
      config: [
        "import me.shedaniel.autoconfig.ConfigData;",
        "import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.RequiresRestart;",
        "import me.shedaniel.autoconfig.annotation.ConfigName;",
        "import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.TransitiveObject;",
        "import me.shedaniel.cloth.clothconfig.shadowed.blue.endless.jankson.Comment;",
      ],
      mixin: [
        "import org.slf4j.Logger;",
        "import org.slf4j.LoggerFactory;",
        "import org.spongepowered.asm.mixin.Mixin;",
        "import org.spongepowered.asm.mixin.injection.At;",
        "import org.spongepowered.asm.mixin.injection.Inject;",
        "import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;",
        "import net.minecraft.entity.player.PlayerEntity;",
        "import net.minecraft.text.Text;",
      ],
    };

    return [...commonImports, ...(typeImports[type] || [])];
  }

  getRegistryType(type) {
    const registryMap = {
      entity: "ENTITY_TYPE",
      block: "BLOCK",
      item: "ITEM",
    };
    return registryMap[type] || type.toUpperCase();
  }

  javaClassHeader(pkg, className, type, extraImports = "") {
    const imports = [...this.getFabricImports(type), extraImports.split("\n")]
      .flat()
      .filter(Boolean);
    const registryField = this.getRegistryField(type, className);

    return `package ${pkg};

${imports.map((i) => i.trim()).join("\n")}

public class ${className} {
    ${registryField}

    // Constructor and methods...
}`;
  }

  getRegistryField(type, className) {
    const registryType = this.getRegistryType(type);
    const modId = this.getModId(className);
    return `public static final ${className}${
      type === "block" ? "Block" : ""
    } ${className.toUpperCase()} = Registry.register(
    Registries.${registryType},
    Identifier.of("${this.config.modId}", "${className.toLowerCase()}"),
    new ${className}());`;
  }
}
