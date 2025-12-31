import { BaseGenerator } from "./baseGenerator.js";

export class CommandGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    // Validate using modId, not className
    this.validateName(config.modId, "command");

    const pkg = this.getPackage("command");
    const commandId = config.modId; // Use modId for command ID
    const code = `package ${pkg};

import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.IntegerArgumentType;
import com.mojang.brigadier.context.CommandContext;
import net.fabricmc.fabric.api.command.v2.CommandRegistrationCallback;
import net.minecraft.server.command.CommandManager;
import net.minecraft.server.command.ServerCommandSource;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.item.ItemStack;
import net.minecraft.item.Items;

public class ${name}Command {
    public static void register() {
        CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
            dispatcher.register(CommandManager.literal("${commandId}")
                .then(CommandManager.argument("amount", IntegerArgumentType.integer(1, 64))
                    .executes(${name}Command::execute))
                .executes(${name}Command::executeNoArgs);
        });
    }

    private static int executeNoArgs(CommandContext<ServerCommandSource> context) {
        return execute(context, 1);
    }

    private static int execute(CommandContext<ServerCommandSource> context, int amount) {
        ServerPlayerEntity player = context.getSource().getPlayer();
        if (player != null) {
            ItemStack stack = new ItemStack(Items.DIAMOND, amount);
            boolean inserted = player.getInventory().insertStack(stack);
            context.getSource().sendFeedback(
                () -> Text.literal("§aGave " + amount + " diamonds! " + (inserted ? "§aInserted!" : "§eFull inventory!")),
                false
            );
        }
        return 1;
    }
}

// Register in your main mod class onInitialize():
// ${name}Command.register();
`;

    return {
      content: code,
      filename: `${name}Command.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}Command.java`,
    };
  }
}
