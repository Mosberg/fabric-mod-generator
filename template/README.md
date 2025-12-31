```plaintext
📦 template/
├── 📁 src/
│   ├── 📁 client/java/${package}/client/
│   │   ├── ${mod_name}Client.java
│   │   └── config/
│   │       └── ${mod_name}ModMenu.java
│   ├── 📁 main/java/${package}/
│   │   └── ${mod_name}.java
│   └── 📁 resources/
│       ├── assets/${mod_id}/lang/
│       │   └── en_us.json
│       └── fabric.mod.json
├── build.gradle
├── gradle.properties
└── settings.gradle
```

```json
{
  "schemaVersion": 1,
  "id": "${mod_id}",
  "version": "${mod_version}",
  "name": "${mod_name}",
  "description": "${mod_description}",
  "authors": ["${mod_author}"],
  "contact": {
    "homepage": "${mod_homepage}",
    "sources": "${mod_sources}",
    "issues": "${mod_issues}"
  },
  "license": "${mod_license}",
  "icon": "assets/${mod_id}/icon.png",
  "environment": "*",
  "entrypoints": {
    "main": ["${com_net_org_dk}.${your_name}.${mod_name}"],
    "client": ["${com_net_org_dk}.${your_name}.client.${mod_name}Client"],
    "modmenu": [
      "${com_net_org_dk}.${your_name}.client.config.${mod_name}ModMenu"
    ]
  },
  "mixins": [],
  "depends": {
    "fabricloader": ">=${loader_version}",
    "fabric-api": "*",
    "minecraft": "~${minecraft_version}",
    "java": ">=${java_version}"
  },
  "recommends": {
    "modmenu": "*",
    "cloth-config": "*"
  },
  "custom": {
    "modmenu": {
      "update_checker": true
    }
  }
}
```

```gradle
plugins {
    id 'fabric-loom' version "${loom_version}"
    id 'maven-publish'
    id 'java'
}

version = project.mod_version
group = project.maven_group

base {
    archivesName = project.archives_base_name
}

// ═════════════════════════════════════════════════════════════════════════════════
// Maven Repositories for Dependencies
// ═════════════════════════════════════════════════════════════════════════════════

repositories {
    mavenCentral()

    maven {
        name = "Fabric"
        url = "https://maven.fabricmc.net/"
    }

    maven {
        name = "Terraformers"
        url = "https://maven.terraformersmc.com/releases/"
    }

    maven {
        name = "Shedaniel"
        url = "https://maven.shedaniel.me/"
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Fabric Loom Configuration - IDE Integration and Run Configurations
// ═════════════════════════════════════════════════════════════════════════════════

loom {
    splitEnvironmentSourceSets()

    mods {
        ${mod_id} {
            sourceSet sourceSets.main
            sourceSet sourceSets.client
        }
    }

    runs {
        // Client run configuration (F5 in IDE)
        client {
            client()
            configName = "Minecraft Client"
            ideConfigGenerated = true
            runDir = "run"
        }

        // Server run configuration (F5 in IDE)
        server {
            server()
            configName = "Minecraft Server"
            ideConfigGenerated = true
            runDir = "run-server"
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Fabric API Data Generation Configuration
// ═════════════════════════════════════════════════════════════════════════════════

fabricApi {
    configureDataGeneration {
        client = false
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Dependencies - All Required Libraries and Frameworks
// ═════════════════════════════════════════════════════════════════════════════════

dependencies {
    // Minecraft & Fabric Core
    minecraft "com.mojang:minecraft:${project.minecraft_version}"
    mappings "net.fabricmc:yarn:${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:${project.loader_version}"
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_version}"

    // Optional Mods - Enhance Development Experience
    modImplementation "com.terraformersmc:modmenu:${project.modmenu_version}"
    modApi("me.shedaniel.cloth:cloth-config-fabric:${project.cloth_config_version}") {
        exclude group: "net.fabricmc.fabric-api"
    }

    // Libraries - Bundled with JAR
    include implementation("com.google.code.gson:gson:${project.gson_version}")

    // Compile-Only - Annotations for Better IDE Support
    compileOnly "org.jetbrains:annotations:${project.annotations_version}"

    // Testing Framework - JUnit 6 with BOM for Dependency Management
    testImplementation platform("org.junit:junit-bom:${project.junit_version}")
    testImplementation "org.junit.jupiter:junit-jupiter"
    testImplementation "org.junit.jupiter:junit-jupiter-params"
    testRuntimeOnly "org.junit.platform:junit-platform-launcher"
}

// ═════════════════════════════════════════════════════════════════════════════════
// Source Sets Configuration
// ═════════════════════════════════════════════════════════════════════════════════

sourceSets {
    main {
        resources {
            srcDirs += [
                "src/main/generated/resources"
            ]
            exclude ".cache"
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Resource Processing
// ═════════════════════════════════════════════════════════════════════════════════

processResources {
    // Capture properties as local variables to avoid Groovy closure issues
    def modId = project.mod_id
    def modVersion = project.mod_version
    def modName = project.mod_name
    def modDescription = project.mod_description
    def modAuthor = project.mod_author
    def modHomepage = project.mod_homepage
    def modSources = project.mod_sources
    def modIssues = project.mod_issues
    def modLicense = project.mod_license
    def fabricLoaderVer = project.loader_version
    def minecraftVer = project.minecraft_version
    def javaVer = project.java_version

    // Define inputs for build cache invalidation
    inputs.property "mod_id", modId
    inputs.property "mod_version", modVersion
    inputs.property "mod_name", modName
    inputs.property "mod_description", modDescription
    inputs.property "mod_author", modAuthor
    inputs.property "mod_homepage", modHomepage
    inputs.property "mod_sources", modSources
    inputs.property "mod_issues", modIssues
    inputs.property "mod_license", modLicense
    inputs.property "loader_version", fabricLoaderVer
    inputs.property "minecraft_version", minecraftVer
    inputs.property "java_version", javaVer

    // Process fabric.mod.json template with property values
    filesMatching("fabric.mod.json") {
        expand(
            "mod_id": modId,
            "mod_version": modVersion,
            "mod_name": modName,
            "mod_description": modDescription,
            "mod_author": modAuthor,
            "mod_homepage": modHomepage,
            "mod_sources": modSources,
            "mod_issues": modIssues,
            "mod_license": modLicense,
            "loader_version": fabricLoaderVer,
            "minecraft_version": minecraftVer,
            "java_version": javaVer
        )
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Java Compilation Configuration
// ═════════════════════════════════════════════════════════════════════════════════

tasks.withType(JavaCompile).configureEach {
    it.options.encoding = "UTF-8"
    it.options.release = 21
}

java {
    withSourcesJar()
    withJavadocJar()

    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

// ═════════════════════════════════════════════════════════════════════════════════
// JAR Manifest Configuration - Build Metadata
// ═════════════════════════════════════════════════════════════════════════════════

jar {
    // Capture properties for manifest
    def archivesBaseName = project.archives_base_name
    def modName = project.mod_name
    def modAuthor = project.mod_author
    def modVersion = project.version

    from("LICENSE") {
        rename { "${it}_${archivesBaseName}" }
    }

    manifest {
        attributes(
            "Specification-Title": modName,
            "Specification-Vendor": modAuthor,
            "Specification-Version": "1",
            "Implementation-Title": modName,
            "Implementation-Version": modVersion,
            "Implementation-Vendor": modAuthor,
            "Implementation-Timestamp": new Date().format("yyyy-MM-dd'T'HH:mm:ssZ")
        )
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Javadoc Configuration - Documentation Generation
// ═════════════════════════════════════════════════════════════════════════════════

javadoc {
    options.encoding = 'UTF-8'
    options.charSet = 'UTF-8'
    options.addStringOption('Xdoclint:none', '-quiet')
}

// ═════════════════════════════════════════════════════════════════════════════════
// Test Configuration - JUnit 5 with Comprehensive Logging
// ═════════════════════════════════════════════════════════════════════════════════

test {
    useJUnitPlatform()

    testLogging {
        events "passed", "skipped", "failed"
        exceptionFormat = "full"
        showStandardStreams = false
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Maven Publication Configuration - JAR Distribution
// ═════════════════════════════════════════════════════════════════════════════════

publishing {
    publications {
        mavenJava(MavenPublication) {
            artifactId = project.archives_base_name
            from components.java

            pom {
                name = project.mod_name
                description = project.mod_description
                url = project.mod_homepage

                licenses {
                    license {
                        name = project.mod_license
                    }
                }

                developers {
                    developer {
                        name = project.mod_author
                    }
                }

                scm {
                    url = project.mod_sources
                    connection = "scm:git:${project.mod_sources}.git"
                }
            }
        }
    }

    repositories {
        // Uncomment to publish to local Maven repository
        // mavenLocal()

        // Template for custom Maven repository
        // maven {
        //     name = "MyMaven"
        //     url = "https://maven.example.com/releases"
        //     credentials {
        //         username = project.findProperty("maven.username") ?: System.getenv("MAVEN_USERNAME")
        //         password = project.findProperty("maven.password") ?: System.getenv("MAVEN_PASSWORD")
        //     }
        // }
    }
}

// ═════════════════════════════════════════════════════════════════════════════════
// Custom Tasks - Utility Commands
// ═════════════════════════════════════════════════════════════════════════════════

// Display build information - Configuration cache compliant
tasks.register("projectInfo") {
    // Capture properties at configuration time for configuration cache compatibility
    def modName = project.mod_name
    def modVersion = project.mod_version
    def minecraftVersion = project.minecraft_version
    def loaderVersion = project.loader_version
    def fabricVersion = project.fabric_version
    def javaVersion = project.java_version
    def gradleVersion = gradle.gradleVersion
    doLast {
        println """
            ======================================
            ${mod_name} Build Information
            ======================================
            Mod Name:       ${modName}
            Version:        ${modVersion}
            Minecraft:      ${minecraftVersion}
            Fabric Loader:  ${loaderVersion}
            Fabric API:     ${fabricVersion}
            Java Version:   ${javaVersion}
            Gradle Version: ${gradleVersion}
            ======================================
        """.stripIndent()
    }
}

// Clean generated resources
clean {
    delete "src/main/generated"
}
```

```properties
# ═══════════════════════════════════════════════════════════════════════════════
# Gradle JVM Configuration - Optimized for Fabric Development
# ═══════════════════════════════════════════════════════════════════════════════

# Allocate 4GB heap, use G1GC for large projects, enable parallel garbage collection
org.gradle.jvmargs=-Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200

# Build performance optimizations
org.gradle.parallel=true
org.gradle.caching=true

# Disable configuration cache due to known issues with Gradle plugins used in Fabric projects
org.gradle.configuration-cache=false

# ═══════════════════════════════════════════════════════════════════════════════
# Mod Metadata - Uniquely Identifies Your Mod
# ═══════════════════════════════════════════════════════════════════════════════

maven_group=${com_net_org_dk}.${your_name}
archives_base_name=${mod_id}
mod_id=${mod_id}
mod_version=${mod_version}
mod_name=${mod_name}
mod_description=${mod_description}
mod_author=${mod_author}
mod_homepage=${mod_homepage}
mod_sources=${mod_sources}
mod_issues=${mod_issues}
mod_license=${mod_license}

# ═══════════════════════════════════════════════════════════════════════════════
# Minecraft & Fabric Versions - Keep Updated via https://fabricmc.net/develop
# ═══════════════════════════════════════════════════════════════════════════════

minecraft_version=1.21.10
loader_version=0.18.4
yarn_mappings=1.21.10+build.3
loom_version=1.14.10
fabric_version=0.138.4+1.21.10
java_version=21

# ═══════════════════════════════════════════════════════════════════════════════
# Library Versions - Standard Dependencies
# ═══════════════════════════════════════════════════════════════════════════════

gson_version=2.11.0.0
slf4j_version=2.0.17
annotations_version=26.0.2

# ═══════════════════════════════════════════════════════════════════════════════
# Testing Framework
# ═══════════════════════════════════════════════════════════════════════════════

junit_version=6.0.1

# ═══════════════════════════════════════════════════════════════════════════════
# Optional Integrations - Recommended Mods for Development
# ═══════════════════════════════════════════════════════════════════════════════

cloth_config_version=19.0.147
modmenu_version=16.0.0-rc.1
```

```gradle
pluginManagement {
	repositories {
		maven {
			name = 'Fabric'
			url = 'https://maven.fabricmc.net/'
		}
		mavenCentral()
		gradlePluginPortal()
	}
}

rootProject.name = "${mod_id}"
```

```java
package ${com_net_org_dk}.${your_name};

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.fabricmc.api.ModInitializer;

/**
 * Main class for the ${mod_name} mod.
 */
public class ${mod_name} implements ModInitializer {
	public static final String MOD_ID = "${mod_id}";
	public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

	private static ${mod_name} instance;
	public static ${mod_name} getInstance() {
		return instance;
	}

		LOGGER.info("${mod_name} initialized successfully!");
	}
}
```

```java
package ${com_net_org_dk}.${your_name}.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.fabricmc.api.ClientModInitializer;

/**
 * Client-side initializer for the ${mod_name} mod.
 */
public class ${mod_name}Client implements ClientModInitializer {
	public static final Logger LOGGER = LoggerFactory.getLogger(${mod_name}.MOD_ID + "-client");

	@Override
	public void onInitializeClient() {
		// Client-side initialization logic can be added here

		LOGGER.info("${mod_name} client initialized successfully!");
	}
}
```

```java
package ${com_net_org_dk}.${your_name}.client.config;

import com.terraformersmc.modmenu.api.ConfigScreenFactory;
import com.terraformersmc.modmenu.api.ModMenuApi;

/**
 * ModMenu integration for the ${mod_name} mod.
 *
 * <p>
 * Requires ModMenu and Cloth Config to be installed.
 */
public class ${mod_name}ModMenu implements ModMenuApi {
        @Override
        public Class<?> getConfigScreenFactory() {
                return ${mod_name}ConfigScreen.class;
        }
}
```

```json
{
  "${mod_id}.mod.name": "${mod_name}",
  "${mod_id}.mod.description": "${mod_description}"
}
```
