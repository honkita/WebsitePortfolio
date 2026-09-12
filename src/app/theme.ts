import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        primary: {
          value: {
            base: "#050505",
            _dark: "#f5f5f5",
          },
        },

        primaryBright: {
          value: {
            base: "#050505",
            _dark: "#f5f5f5",
          },
        },

        primaryDim: {
          value: {
            base: "#222426",
            _dark: "#9b9b9b",
          },
        },

        secondary: {
          value: {
            base: "#282828",
            _dark: "#dcdcdc",
          },
        },

        background: {
          value: {
            base: "#fafafa",
            _dark: "#282828",
          },
        },

        foreground: {
          value: {
            base: "#d57e04",
            _dark: "#2d45e6",
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
