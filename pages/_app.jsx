/**
 * Import your global css before MyApp
 */
import "../styles/variables.css";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";

/**
 * Defualt _app.jsx file
 */
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
