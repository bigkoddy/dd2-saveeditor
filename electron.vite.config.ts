import type { ConfigEnv, UserConfig } from "vite";
import type { ElectronViteConfig } from "electron-vite";
import { defineConfig, mergeConfig } from "vite";
import { getBuildConfig, getBuildDefine, external } from "./vite.base.config";

const VITE_ELECTRON_CONFIG: ElectronViteConfig = {
  main: defineConfig((env: ConfigEnv) => {
    const define = getBuildDefine(env);
    const config: UserConfig = {
      build: {
        lib: {
          entry: "src/main.ts",
          fileName: () => "[name].js",
          formats: ["es"],
        },
        rollupOptions: {
          external,
        },
      },
      plugins: [],
      define,
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
          input: "src/preload.ts",
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

    return {
      mode,
      base: "./",
      build: {
        outDir: ".vite/renderer/main_app_window",
        rollupOptions: {
          external,
          input: "src/renderer.ts",
          output: {
            format: "es",
          },
        },
      },
      plugins: [],
      resolve: {
        preserveSymlinks: true,
      },
      clearScreen: false,
    } as UserConfig;
  }),
};

export default VITE_ELECTRON_CONFIG;
