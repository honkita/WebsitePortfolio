import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import Link from "next/link";

export default function PixelButton(props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function checkReverse() {
    if (props.reverse) {
      return false;
    } else {
      return true;
    }
  }

  let src;

  return (
    <ThemeProvider>
      <Link href={props.url}>
        <button className={utilStyles.logoButton}>
          <img src={"./images/Pixel" + props.name + ".png"} />
          <img
            className={
              (theme === "light") == checkReverse()
                ? utilStyles.logoButtonDark
                : null
            }
            src={"./images/Pixel" + props.name + "dark.png"}
          />
        </button>
      </Link>
    </ThemeProvider>
  );
}
