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
      lightTheme: "./images/Buttons/PixelEmail.png",
      darkTheme: "./images/Buttons/PixelEmailDark.png",
      target: "_blank",
    },
    Back: {
      lightTheme: "./images/Buttons/PixelBack.png",
      darkTheme: "./images/Buttons/PixelBackDark.png",
      target: "",
    },
    Linkedin: {
      lightTheme: "./images/Buttons/PixelLinkedin.png",
      darkTheme: "./images/Buttons/PixelLinkedinDark.png",
      target: "_blank",
    },
    Resume: {
      lightTheme: "./images/Buttons/PixelResume.png",
      darkTheme: "./images/Buttons/PixelResumeDark.png",
      target: "",
    },
    GitHub: {
      lightTheme: "./images/Buttons/PixelGitHub.png",
      darkTheme: "./images/Buttons/PixelGitHubDark.png",
      target: "_blank",
    },
    Download: {
      lightTheme: "./images/Buttons/PixelDownload.png",
      darkTheme: "./images/Buttons/PixelDownloadDark.png",
      target: "_blank",
    },
    Call: {
      lightTheme: "./images/Buttons/PixelCall.png",
      darkTheme: "./images/Buttons/PixelCallDark.png",
      target: "_blank",
    },
  };

  let src;

  return (
    <ThemeProvider>
      <Link href={props.url} target={dict[name].target}>
        <button className={utilStyles.logoButton}>
          <img src={dict[name].lightTheme} alt={name} />
          <img
            className={
              resolvedTheme === "light" ? utilStyles.logoButtonDark : null
            }
            src={dict[name].darkTheme}
            alt={name + "Dark"}
          />
        </button>
      </Link>
    </ThemeProvider>
  );
}
