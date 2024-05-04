import { builtinModules } from "node:module";
import type { AddressInfo } from "node:net";
import type { ConfigEnv, Plugin, UserConfig } from "vite";
import pkg from "./package.json";

export const builtins = [
  "electron",
  ...builtinModules.map((m) => [m, `node:${m}`]).flat(),
];

export const external = [
  ...builtins,
  ...Object.keys(
    "dependencies" in pkg ? (pkg.dependencies as Record<string, unknown>) : {}
  ),
];

export function getBuildConfig(env: ConfigEnv): UserConfig {
  const { mode, command } = env;

  return {
    mode,
    build: {
      // Prevent multiple builds from interfering with each other.
      emptyOutDir: false,
      // 🚧 Multiple builds may conflict.
      outDir: ".vite/build",
      watch: command === "serve" ? {} : null,
      minify: command === "build",
    },
    clearScreen: false,
  };
}

export function getDefineKeys(names: string[]) {
  const define: { [name: string]: VitePluginRuntimeKeys } = {};

  return names.reduce((acc, name) => {
    const NAME = name.toUpperCase();
    const keys: VitePluginRuntimeKeys = {
      VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
      VITE_NAME: `${NAME}_VITE_NAME`,
    };

    return { ...acc, [name]: keys };
  }, define);
}

export function getBuildDefine(env: ConfigEnv) {
  const { command } = env;
  const names = ["main_app_window"];
  const defineKeys = getDefineKeys(names);
  const define = Object.entries(defineKeys).reduce(
    (acc, [name, keys]) => {
      const { VITE_DEV_SERVER_URL, VITE_NAME } = keys;
      const def = {
        [VITE_DEV_SERVER_URL]:
          command === "serve"
            ? JSON.stringify(process.env[VITE_DEV_SERVER_URL])
            : undefined,
        [VITE_NAME]: JSON.stringify(name),
      };
      return { ...acc, ...def };
    },
    {} as Record<string, any>
  );

  return define;
}
