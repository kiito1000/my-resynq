import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import esLintPlugin from "vite-plugin-eslint";
import mdPlugin, { Mode } from "vite-plugin-markdown";
import path from "path";

const createConfig = ({ mode }: UserConfig) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode ?? "development", process.cwd()),
  };

  return defineConfig({
    root: __dirname,
    publicDir: path.resolve(__dirname, "public"),
    plugins: [
      react({ jsxRuntime: "automatic" }),
      esLintPlugin(),
      mdPlugin({ mode: [Mode.REACT] }),
    ],
    build: {
      sourcemap: false,
      outDir: "./dist",
      rollupOptions: {
        output: {
          manualChunks: {
            firebaseApp: ["firebase/app"],
            firebaseAppCheck: ["firebase/app-check"],
            firebaseDB: ["firebase/database"],
            firebaseAuth: ["firebase/auth"],
            react: ["react", "react-dom", "react-router-dom"],
            redux: ["react-redux", "redux-saga", "typed-redux-saga"],
          },
        },
      },
    },
    resolve: {
      alias: {
        "@utils": path.resolve(__dirname, "src/utils"),
        "@redux": path.resolve(__dirname, "src/redux"),
        "@router": path.resolve(__dirname, "src/router"),
        "@strings": path.resolve(__dirname, "src/assets/strings"),
        "@images": path.resolve(__dirname, "src/assets/images"),
        "@styles": path.resolve(__dirname, "src/assets/styles"),
        "@routes": path.resolve(__dirname, "src/assets/routes"),
        "@markdown": path.resolve(__dirname, "src/assets/markdown"),
        "@envs": path.resolve(__dirname, "src/envs"),
        "@components": path.resolve(__dirname, "src/components"),
        "@": path.resolve(__dirname, "src"),
      },
    },
  });
};

export default createConfig;
