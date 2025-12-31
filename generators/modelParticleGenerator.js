const path = require("path");
const BaseGenerator = require("./baseGenerator");

class ModelGenerator extends BaseGenerator {
  static getOptions() {
    return [
      {
        name: "modelType",
        label: "Model Type",
        type: "select",
        options: [
          { value: "humanoid", label: "Humanoid" },
          { value: "quadruped", label: "Quadruped" },
          { value: "custom", label: "Custom" },
        ],
        default: "humanoid",
      },
    ];
  }

  async generate(config) {
    const name = config.className;
    const type = config.options?.modelType || "humanoid";
    this.validateName(name, "entity");

    const modelCode = this._generateEntityModel(name, type);
    // Use getPackage('renderer') to determine the Java package path
    const javaPackage = this.getPackage("renderer").replace(/\./g, "/");
    return {
      content: modelCode,
      filename: `${name}Model.java`,
      path: `src/main/java/${javaPackage}/${name}Model.java`,
    };
  }

  _generateEntityModel(name, type) {
    return `package ${this.getPackage("renderer")};

import net.minecraft.client.model.ModelData;
import net.minecraft.client.render.entity.model.EntityModel;
import net.minecraft.entity.Entity;

public class ${name}Model extends EntityModel<Entity> {
    public ${name}Model(ModelData data) {
        super(data);
    }

    @Override
    public void setAngles(Entity entity, float limbSwing, float limbSwingAmount,
                         float ageInTicks, float netHeadYaw, float headPitch) {
        // Set animation angles
    }
}
`;
  }
}

module.exports = ModelGenerator;
