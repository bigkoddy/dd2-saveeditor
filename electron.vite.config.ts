import type { ConfigEnv, UserConfig } from "vite";
import type { ElectronViteConfig } from "electron-vite";
import { defineConfig, mergeConfig } from "vite";
import { getBuildConfig, external } from "./vite.base.config";
import path from "path";

const VITE_ELECTRON_CONFIG: ElectronViteConfig = {
  main: defineConfig((env: ConfigEnv) => {
    const config: UserConfig = {
      build: {
        lib: {
          entry: "src/main/main.ts",
          fileName: () => "[name].js",
          formats: ["es"],
        },
        rollupOptions: {
          external,
        },
      },
      plugins: [],
      resolve: {
        // Load the Node.js entry.
        mainFields: ["module", "jsnext:main", "jsnext"],
      },
    };

    return mergeConfig(getBuildConfig(env), config);
  }),
  preload: defineConfig((env: ConfigEnv) => {
    const config: UserConfig = {
      build: {
        rollupOptions: {
          external,
          output: {
            format: "es",
            // It should not be split chunks.
            inlineDynamicImports: true,
            entryFileNames: "[name].js",
            chunkFileNames: "[name].js",
            assetFileNames: "[name].[ext]",
          },
        },
      },
      plugins: [],
    };

    return mergeConfig(getBuildConfig(env), config);
  }),
  renderer: defineConfig((env: ConfigEnv) => {
    const { mode } = env;

    const config: UserConfig = {
      mode,
      base: "./",
      build: {
        outDir: ".vite/renderer",
        lib: {
          entry: "src/renderer.ts",
          fileName: () => "[name].js",
          formats: ["es"],
        },
        rollupOptions: {
          external,
          input: {
            index: path.resolve(__dirname, "src/renderer/index.html"),
          },
          output: {
            format: "es",
          },
        },
      },
      plugins: [],
      resolve: {
        preserveSymlinks: true,
      },
    };
    console.log(mergeConfig(getBuildConfig(env), config));
    return mergeConfig(getBuildConfig(env), config);
  }),
};

export default VITE_ELECTRON_CONFIG;
