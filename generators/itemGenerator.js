import { BaseGenerator } from "./baseGenerator.js";

export class ItemGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    this.validateName(name, "item");

    const pkg = this.getPackage("item");
    const code = `package ${pkg};

import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.client.item.TooltipContext;
import net.minecraft.text.Text;
import net.minecraft.world.World;
import net.minecraft.util.Identifier;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;

public class ${name}Item extends Item {
    public static final ${name}Item ITEM = Registry.register(
        Registries.ITEM,
        Identifier.of("${config.modId}", "${name.toLowerCase()}"),
        new ${name}Item(new Item.Settings()
            .group(ItemGroup.MISC)
            .maxCount(64)
            .fireproof())
    );

    public ${name}Item(Settings settings) {
        super(settings);
    }

    @Override
    public void appendTooltip(ItemStack stack, World world, List<Text> tooltip, TooltipContext context) {
        tooltip.add(Text.literal("§6Custom ${name.toLowerCase()} item"));
        tooltip.add(Text.literal("§7Right-click for special effect"));
    }

    @Override
    public ActionResult useOnBlock(ItemUsageContext context) {
        // Custom block interaction
        return ActionResult.SUCCESS;
    }
}

// Register in your main mod class:
// ${name}Item.ITEM
`;

    return {
      content: code,
      filename: `${name}Item.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}Item.java`,
    };
  }
}
