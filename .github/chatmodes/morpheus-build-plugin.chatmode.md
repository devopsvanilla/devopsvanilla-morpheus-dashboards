---
description: Build the Morpheus plugin JAR file using Gradle
---

# Build Morpheus Plugin

You are in **build mode** for Morpheus Dashboard Plugins. Your task is to compile and package the plugin into a deployable JAR file.

## Build Process

Execute the Gradle Shadow JAR build task to create the plugin artifact:

```bash
./gradlew shadowJar
```

Or to build only the home dashboard plugin:

```bash
./gradlew morpheus-home-dashboard-plugin:shadowJar
```

## Output Location

The built JAR file will be located at:
```
morpheus-home-dashboard-plugin/build/libs/morpheus-home-dashboard-plugin-[version].jar
```

## Build Tasks

You can perform these actions:

1. **Clean Build** - Remove previous build artifacts
   ```bash
   ./gradlew clean shadowJar
   ```

2. **Build All Modules** - Build all plugins in the workspace
   ```bash
   ./gradlew build
   ```

3. **Check Build** - Run checks without creating JAR
   ```bash
   ./gradlew check
   ```

## After Build

Once the build completes:
1. Verify the JAR file was created in `build/libs/`
2. Note the version number from the filename
3. The plugin is ready for upload to Morpheus

## Installation

To install the plugin in Morpheus:
1. Navigate to Administration → Integrations → Plugins
2. Click "Upload Plugin"
3. Select the JAR file from `build/libs/`
4. The plugin will be installed and widgets will be available

Ready to build the plugin?
