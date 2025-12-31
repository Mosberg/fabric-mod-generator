import { BaseGenerator } from "./baseGenerator.js";

export class ConfigGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    const configName = name.replace("Config", "");
    this.validateName(configName, "config");

    const pkg = this.getPackage("config");
    const code = `package ${pkg};

import me.shedaniel.autoconfig.ConfigData;
import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.RequiresRestart;
import me.shedaniel.autoconfig.annotation.ConfigName;
import me.shedaniel.autoconfig.annotation.ConfigEntry.Gui.TransitiveObject;
import me.shedaniel.cloth.clothconfig.shadowed.blue.endless.jankson.Comment;

@ConfigName("${configName}")
public class ${name} implements ConfigData {

    @Comment("General mod settings")
    @TransitiveObject
    public General general = new General();

    @Comment("${configName} specific settings")
    @TransitiveObject
    public ${configName}Settings settings = new ${configName}Settings();

    public static class General {
        @Comment("Enable custom features")
        public boolean enableCustomFeatures = true;

        @RequiresRestart
        @Comment("Debug logging")
        public boolean debugMode = false;

        @Comment("Performance optimizations")
        public boolean performanceMode = true;
    }

    public static class ${configName}Settings {
        @Comment("${configName} spawn weight (0 = disabled)")
        public int spawnWeight = 10;

        @Comment("Minimum spawn group size")
        public int minGroupSize = 1;

        @Comment("Maximum spawn group size")
        public int maxGroupSize = 4;

        @Comment("Custom ${configName.toLowerCase()} health")
        public float customHealth = 20.0f;

        @Comment("Enable ${configName.toLowerCase()} sounds")
        public boolean enableSounds = true;
    }
}

// Registration (add to main mod class):
// ${configName}Config.init(${name}.class);
//
// Client screen registration (add to client initializer):
// ConfigScreenRegistry.register(${name}.class, ${configName}ConfigScreen::new);
`;

    return {
      content: code,
      filename: `${name}.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}.java`,
    };
  }
}
