import { BaseGenerator } from "./baseGenerator.js";

export class ScreenGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    const screenHandlerName = name.replace("Screen", "") + "ScreenHandler";
    this.validateName(name.replace("Screen", ""), "screen");

    const pkg = this.getPackage("screen");
    const code = `package ${pkg};

import net.minecraft.client.gui.screen.ingame.HandledScreen;
import net.minecraft.client.gui.screen.ingame.HandledScreens;
import net.minecraft.entity.player.PlayerInventory;
import net.minecraft.text.Text;
import net.minecraft.screen.ScreenHandler;
import net.minecraft.screen.slot.Slot;
import net.minecraft.util.Identifier;
import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;

@Environment(EnvType.CLIENT)
public class ${name} extends HandledScreen<${screenHandlerName}> {
    private static final Identifier TEXTURE = Identifier.of(
        "${config.modId}",
        "textures/gui/${name.toLowerCase().replace("screen", "")}.png"
    );

    public ${name}(${screenHandlerName} handler, PlayerInventory inventory, Text title) {
        super(handler, inventory, title);
        this.backgroundWidth = 176;
        this.backgroundHeight = 166;
        this.titleX = (this.backgroundWidth - this.textRenderer.getWidth(title)) / 2;
        this.titleY = 6;
        this.playerInventoryTitleX = 8;
        this.playerInventoryTitleY = this.backgroundHeight - 94;
    }

    @Override
    protected void drawBackground(MatrixStack matrices, float delta, int mouseX, int mouseY) {
        RenderSystem.setShaderTexture(0, TEXTURE);
        this.drawTexture(matrices, this.x, this.y, 0, 0, this.backgroundWidth, this.backgroundHeight);

        // Draw progress bars, energy, etc.
        this.drawProgressBar(matrices, delta);
    }

    private void drawProgressBar(MatrixStack matrices, float delta) {
        // Example progress bar (0-24 pixels)
        int progress = (int)(24 * (System.currentTimeMillis() % 2000) / 2000.0);
        this.drawTexture(matrices, this.x + 80, this.y + 34, 176, 0, progress, 16);
    }

    @Override
    protected void drawForeground(MatrixStack matrices, int mouseX, int mouseY) {
        this.textRenderer.draw(matrices, this.title, this.titleX, this.titleY, 0xFFFFFF);
        this.textRenderer.draw(matrices, Text.translatable("container.inventory").getString(),
                              this.playerInventoryTitleX, this.playerInventoryTitleY, 0xFFFFFF);
    }

    @Override
    public boolean mouseClicked(double mouseX, double mouseY, int button) {
        // Custom button handling
        return super.mouseClicked(mouseX, mouseY, button);
    }
}

// Register in client initializer:
// HandledScreens.register(${screenHandlerName}.TYPE, ${name}::new);
`;

    return {
      content: code,
      filename: `${name}.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}.java`,
    };
  }
}
