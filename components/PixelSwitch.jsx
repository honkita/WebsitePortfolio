import React, { useEffect, useState } from "react";
import utilStyles from "../styles/theme.util.module.css";
import { useTheme, ThemeProvider } from "next-themes";

export default function PixelSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [press, setPress] = useState(0);

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
    } else {
      setTheme("dark");
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
