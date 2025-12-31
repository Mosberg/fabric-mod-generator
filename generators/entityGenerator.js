import { BaseGenerator } from "./baseGenerator.js";

export class EntityGenerator extends BaseGenerator {
  async generate(config) {
    this.config = config;
    const name = config.className;
    this.validateName(name, "entity");

    const pkg = this.getPackage("entity");
    const code = `package ${pkg};

import net.minecraft.entity.EntityType;
import net.minecraft.entity.LivingEntity;
import net.minecraft.entity.SpawnGroup;
import net.minecraft.entity.ai.goal.MeleeAttackGoal;
import net.minecraft.entity.ai.goal.WanderAroundFarGoal;
import net.minecraft.entity.ai.goal.LookAroundGoal;
import net.minecraft.entity.attribute.DefaultAttributeContainer;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.entity.damage.DamageSource;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.world.World;
import net.minecraft.util.Identifier;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;

public class ${name}Entity extends LivingEntity {
    public static final EntityType<${name}Entity> TYPE = Registry.register(
        Registries.ENTITY_TYPE,
        Identifier.of("${config.modId}", "${name.toLowerCase()}"),
        EntityType.Builder.<${name}Entity>create(${name}Entity::new, SpawnGroup.CREATURE)
            .dimensions(0.6f, 1.8f)
            .build("${name.toLowerCase()}")
    );

    public ${name}Entity(EntityType<${name}Entity> type, World world) {
        super(type, world);
    }

    @Override
    protected void initGoals() {
        this.goalSelector.add(1, new MeleeAttackGoal(this, 1.0, true));
        this.goalSelector.add(2, new WanderAroundFarGoal(this, 1.0));
        this.goalSelector.add(3, new LookAroundGoal(this));
    }

    public static DefaultAttributeContainer.Builder getAttributes() {
        return LivingEntity.createLivingAttributes()
            .add(EntityAttributes.GENERIC_MAX_HEALTH, 20.0)
            .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.25)
            .add(EntityAttributes.GENERIC_ATTACK_DAMAGE, 3.0);
    }
}

// Register in your main mod class:
// ${name}Entity.TYPE
// EntityRendererRegistry.register(${name}Entity.TYPE, ${name}Renderer::new);
`;

    return {
      content: code,
      filename: `${name}Entity.java`,
      path: `src/main/java/${pkg.replace(/\./g, "/")}/${name}Entity.java`,
    };
  }
}
