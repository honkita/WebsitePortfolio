import React, { useEffect, useState } from "react";
import utilStyles from "../styles/theme.util.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import Link from "next/link";

export default function PixelSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [press, setPress] = useState(0);
  var url = "";
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    if (resolvedTheme == "dark") {
      setTheme("light");
      setPress(press + 1);
    } else {
      setTheme("dark");
      setPress(press + 1);
    }
    if (press == 50) {
      window.open("./Special_Thanks.pdf");
      setPress(0);
    }
  };

  return (
    <ThemeProvider>
      <button
        className={
          utilStyles.toggle +
          " " +
          (resolvedTheme === "dark" ? utilStyles.toggledark : null)
        }
        onClick={toggleTheme}
      />
    </ThemeProvider>
  );
}
