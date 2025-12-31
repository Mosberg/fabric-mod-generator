import { BaseGenerator } from "./baseGenerator.js";

export class MixinGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    const targetClass = name.replace("Mixin", "") || "PlayerEntity";
    this.validateName(name, "mixin");

    const pkg = this.getPackage("mixin");
    const code = `package ${pkg};

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.text.Text;
import net.minecraft.entity.damage.DamageSource;

@Mixin(${targetClass}.class)
public class ${name} {
    private static final Logger LOGGER = LoggerFactory.getLogger("${config.modId.toUpperCase()}::${name}");

    @Shadow public abstract boolean isSneaking();
    @Shadow public abstract float getHealth();
    @Shadow public abstract void sendMessage(Text message, boolean actionBar);

    @Inject(method = "tick", at = @At("HEAD"))
    private void onTick(CallbackInfo ci) {
        ${targetClass} player = (${targetClass})(Object)this;
        if (player.getWorld().isClient()) return;

        // Custom tick behavior
        if (player.isSneaking() && player.getHealth() < 10.0f) {
            player.sendMessage(Text.literal("§6[${config.modId.toUpperCase()}] §rLow health while sneaking!"), true);
        }
    }

    @Inject(method = "damage", at = @At("HEAD"), cancellable = true)
    private void modifyDamage(DamageSource source, float amount, CallbackInfoReturnable<Boolean> cir) {
        ${targetClass} player = (${targetClass})(Object)this;

        // Custom damage modification
        if (source.isOutOfWorld() && player.isSneaking()) {
            cir.setReturnValue(false); // Void protection
            player.sendMessage(Text.literal("§c[${config.modId.toUpperCase()}] §rVoid protection activated!"), true);
            player.setHealth(5.0f); // Low health protection
        }
    }

    @Inject(method = "jump", at = @At("HEAD"))
    private void onJump(CallbackInfo ci) {
        LOGGER.info("${targetClass} jumped via mixin!");
    }
}

/* Required mixin config (${config.modId}.mixins.json):
{
    "required": true,
    "minVersion": "0.8",
    "package": "${pkg.replace(config.packageName + ".", "")}",
    "compatibilityLevel": "JAVA_21",
    "refmap": "${config.modId}.refmap.json",
    "mixins": [
        "${name.toLowerCase()}.json"
    ],
    "client": [
        "${name.toLowerCase()}.json"
    ],
    "injectors": {
        "defaultRequire": 1
    }
}
*/
`;

    return {
      content: code,
      filename: `${name}.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}.java`,
    };
  }
}
