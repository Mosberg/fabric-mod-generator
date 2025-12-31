import { BaseGenerator } from "./baseGenerator.js";

export class RendererGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    const entityName = name.replace("Renderer", "");
    this.validateName(entityName, "entity");

    const pkg = this.getPackage("renderer");
    const code = `package ${pkg};

import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.client.render.VertexConsumerProvider;
import net.minecraft.client.render.entity.EntityRendererFactory;
import net.minecraft.client.render.entity.LivingEntityRenderer;
import net.minecraft.client.util.math.MatrixStack;
import net.minecraft.util.Identifier;
import ${this.config.packageName}.entity.${entityName}Entity;
import ${this.config.packageName}.client.render.${entityName}Model;

@Environment(EnvType.CLIENT)
public class ${name} extends LivingEntityRenderer<${entityName}Entity, ${entityName}Model> {
    private static final Identifier TEXTURE = Identifier.of(
        "${this.config.modId}",
        "textures/entity/${entityName.toLowerCase()}.png"
    );

    public ${name}(EntityRendererFactory.Context context) {
        super(context, new ${entityName}Model(context.getPart(EntityModelLayers.${entityName.toUpperCase()}_MAIN)), 0.5F);
    }

    @Override
    public Identifier getTexture(${entityName}Entity entity) {
        return TEXTURE;
    }

    @Override
    public void render(${entityName}Entity entity, float yaw, float tickDelta, MatrixStack matrices,
                      VertexConsumerProvider vertexConsumers, int light) {
        super.render(entity, yaw, tickDelta, matrices, vertexConsumers, light);

        // Custom rendering effects
        if (entity.isGlowing()) {
            // Add glowing effect
        }
    }
}

// Register in ManaClient.onInitializeClient():
// EntityRendererRegistry.register(${entityName}Entity.TYPE, ${name}::new);
`;

    return {
      content: code,
      filename: `${name}.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}.java`,
    };
  }
}
