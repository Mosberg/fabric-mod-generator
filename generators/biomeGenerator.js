import { BaseGenerator } from "./baseGenerator.js";

export class BiomeGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    this.validateName(name, "biome");
    const pkg =
      this.getPackage("biome") || `${this.config.packageName}.world.biome`;
    const code = `package ${pkg};

import net.minecraft.world.biome.Biome;
import net.minecraft.world.biome.BiomeEffects;
import net.minecraft.sound.BiomeMoodSound;

public class ${name}Biome {
    public static final Biome BIOME = createBiome();

    private static Biome createBiome() {
        return new Biome.Builder()
            .precipitation(Biome.Precipitation.RAIN)
            .temperature(0.8F)
            .downfall(0.4F)
            .effects(new BiomeEffects.Builder()
                .fogColor(12638463)
                .waterColor(4159204)
                .waterFogColor(329011)
                .skyColor(7972607)
                .moodSound(BiomeMoodSound.CAVE)
                .build())
            .build();
    }
}
`;
    return [{ filename: `${name}Biome.java`, content: code }];
  }
}
