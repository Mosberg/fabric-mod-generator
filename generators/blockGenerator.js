import { BaseGenerator } from "./baseGenerator.js";

export class BlockGenerator extends BaseGenerator {
  static getOptions() {
    return [
      {
        name: "hardness",
        label: "Block Hardness",
        type: "number",
        min: 0,
        max: 100,
        step: 0.1,
        default: 5.0,
      },
      {
        name: "sound",
        label: "Block Sound",
        type: "select",
        options: [
          { value: "STONE", label: "Stone" },
          { value: "WOOD", label: "Wood" },
          { value: "METAL", label: "Metal" },
          { value: "GLASS", label: "Glass" },
        ],
        default: "STONE",
      },
    ];
  }

  async generate(config) {
    this.config = config;
    const name = config.className;
    this.validateName(name, "block");

    const pkg = this.getPackage("block");
    const code = `package ${pkg};

import net.minecraft.block.Block;
import net.minecraft.block.BlockState;
import net.minecraft.block.Material;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.sound.BlockSoundGroup;
import net.minecraft.util.Identifier;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.block.FabricBlockSettings;

public class ${name}Block extends Block {
    public static final ${name}Block BLOCK = Registry.register(
        Registries.BLOCK,
        Identifier.of("${config.modId}", "${name.toLowerCase()}"),
        new ${name}Block(FabricBlockSettings.create()
            .material(Material.STONE)
            .strength(5.0f, 6.0f)
            .sounds(BlockSoundGroup.STONE))
    );

    public static final Item ITEM = Registry.register(
        Registries.ITEM,
        Identifier.of("${config.modId}", "${name.toLowerCase()}"),
        new BlockItem(BLOCK, new Item.Settings().groups(ItemGroup.BUILDING_BLOCKS))
    );

    public ${name}Block(Settings settings) {
        super(settings);
    }

    @Override
    public boolean hasRandomTicks(BlockState state) {
        return true; // Enable random ticks for growth/decay
    }
}

// Register in your main mod class:
// ${name}Block.BLOCK
// ${name}Block.ITEM
`;

    return {
      content: code,
      filename: `${name}Block.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}Block.java`,
    };
  }
}
