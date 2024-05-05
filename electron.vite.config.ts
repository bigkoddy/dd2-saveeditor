import type { ConfigEnv, UserConfig } from "vite";
import type { ElectronViteConfig } from "electron-vite";
import path from "path";
import { defineConfig, mergeConfig } from "vite";
import { getBuildConfig, external } from "./vite.base.config";
import vue from "@vitejs/plugin-vue";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

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
            format: "cjs",
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
          entry: "src/renderer/renderer.ts",
          fileName: () => "[name].js",
          formats: ["es"],
        },
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, "src/renderer/index.html"),
          },
          output: {
            format: "es",
          },
        },
      },
      plugins: [
        vue({
          isProduction: IS_PRODUCTION,
        }),
      ],
      resolve: {
        preserveSymlinks: true,
      },
    };

    return mergeConfig(getBuildConfig(env), config);
  }),
};

export default VITE_ELECTRON_CONFIG;
