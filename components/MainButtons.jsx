import { useTheme, ThemeProvider } from "next-themes";

export function returnURL(text) {
  const { resolvedTheme, setTheme } = useTheme();
  var items = {
    GitHub: { url: "https://github.com/honkita/" },
    LinkedIn: {
      url: "https://www.linkedin.com/in/elitelu",
    },
    Resume: { url: "./resume" },
    Email: {
      url: "mailto:elitelulww@gmail.com",
    },
    Download: { url: resumeTheme() },
  };

  function resumeTheme() {
    if (resolvedTheme == "light") {
      return "./Elite_Lu_Resume.pdf";
    } else {
      return "./Elite_Lu_Resume_Dark.pdf";
    }
  }

  return items[text].url;
}
