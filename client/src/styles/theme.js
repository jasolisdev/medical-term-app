import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark", // Default to dark mode
  useSystemColorMode: false, // Prevent overriding by the system theme
};

// Extend the Chakra theme
const theme = extendTheme({
  config,
  colors: {
    // Add any custom colors you want
  },
  fonts: {
    heading: "M PLUS 1p, sans-serif",
    body: "M PLUS 1p, sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "gray.50",
        color: props.colorMode === "dark" ? "whiteAlpha.900" : "gray.800",
      },
    }),
  },
});

export default theme;
