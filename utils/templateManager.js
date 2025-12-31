export class TemplateManager {
  async createFullProject(config) {
    const files = {
      "build.gradle": this.getBuildGradle(config),
      "gradle.properties": this.getGradleProperties(config),
      "src/main/resources/fabric.mod.json": this.getFabricModJson(config),
      "src/main/resources/META-INF/mods.toml": this.getModsToml(config),
      ".gitignore": this.getGitignore(),
      "README.md": this.getReadme(config),
    };

    // Add example main class
    files[
      "src/main/java/" + config.packageName.replace(/\./g, "/") + "/Mod.java"
    ] = this.getModInitializer(config);

    return files;
  }

  getBuildGradle(config) {
    return `plugins {
    id 'fabric-loom' version '${
      config.minecraftVersion === "1.21.10" ? "1.7-SNAPSHOT" : "1.6-SNAPSHOT"
    }'
    id 'maven-publish'
}

version = project.mod_version
group = project.maven_group

base {
    archivesName = project.archives_base_name
}

repositories {
    // Add repositories to fetch dependencies from here
    maven { name = "Fabric"; url = "https://maven.fabricmc.net/" }
}

loom {
    splitEnvironmentSourceSets()

    mods {
        "${config.modId}" {
            sourceSet sourceSets.main
            sourceSet sourceSets.client
        }
    }
}

dependencies {
    minecraft "com.mojang:minecraft:${config.minecraftVersion}"
    mappings "net.fabricmc:yarn:${config.minecraftVersion}+build.1:v2"
    modImplementation "net.fabricmc:fabric-loader:0.16.7"
    modImplementation "net.fabricmc.fabric-api:fabric-api:${
      config.minecraftVersion === "1.21.10" ? "0.108.0+1.21.10" : "0.100.7+1.21"
    }"
}`;
  }

  getFabricModJson(config) {
    return JSON.stringify(
      {
        schemaVersion: 1,
        id: config.modId,
        version: "${version}",
        name: config.modName,
        description: config.description,
        authors: [config.authors],
        contact: {
          homepage: "https://github.com/yourusername/${config.modId}",
          sources: "https://github.com/yourusername/${config.modId}",
        },
        license: "MIT",
        icon: "assets/${config.modId}/icon.png",
        environment: config.clientSideOnly ? "client" : "*",
        entrypoints: {
          main: ["${config.packageName}.Mod"],
          client: ["${config.packageName}.client.ModClient"],
        },
        mixins: ["${config.modId}.mixins.json"],
        depends: {
          fabricloader: ">=0.16.7",
          minecraft: config.minecraftVersion,
          java: ">=21",
          "fabric-api": "*",
        },
      },
      null,
      2
    );
  }

  getModInitializer(config) {
    return `package ${config.packageName};

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Mod implements ModInitializer {
    public static final String MOD_ID = "${config.modId}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID.toUpperCase());

    @Override
    public void onInitialize() {
        LOGGER.info("${config.modName} initializing!");
        // Register your blocks, items, entities here
    }
}
`;
  }

  getGitignore() {
    return `*.iml
/out
/.idea
/.gradle
/build
!.gradle/wrapper
!.gradle/wrapper/gradle-wrapper.jar
*.class
*.jar
*.log
.DS_Store
.idea/
run/
`;
  }

  getReadme(config) {
    return `# ${config.modName}

A Fabric mod for Minecraft ${config.minecraftVersion}.

## Setup

1. Run the Gradle refresh tasks
2. Run \`gradlew genSources\` to generate IDE workspace
3. Open this directory as a Gradle project

## Building

\`\`\`bash
gradlew build
\`\`\`

Output JARs are in \`build/libs/\`
`;
  }

  getGradleProperties(config) {
    return "";
  }

  getModsToml(config) {
    return "";
  }
}
