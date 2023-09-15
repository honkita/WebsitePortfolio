import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import Link from "next/link";

export default function PixelButton(props) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const name = props.name;

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  var dict = {
    Email: {
      lightTheme: "./images/PixelEmail.png",
      darkTheme: "./images/PixelEmailDark.png",
    },
    Back: {
      lightTheme: "./images/PixelBack.png",
      darkTheme: "./images/PixelBackDark.png",
    },
    Linkedin: {
      lightTheme: "./images/PixelLinkedin.png",
      darkTheme: "./images/PixelLinkedinDark.png",
    },
    Resume: {
      lightTheme: "./images/PixelResume.png",
      darkTheme: "./images/PixelResumeDark.png",
    },
    GitHub: {
      lightTheme: "./images/PixelGitHub.png",
      darkTheme: "./images/PixelGitHubDark.png",
    },
  };

  let src;

  return (
    <ThemeProvider>
      <Link href={props.url} target="_blank">
        <button className={utilStyles.logoButton}>
          <img src={dict[name].lightTheme} />
          <img
            className={
              resolvedTheme === "light" ? utilStyles.logoButtonDark : null
            }
            src={dict[name].darkTheme}
          />
        </button>
      </Link>
    </ThemeProvider>
  );
}
