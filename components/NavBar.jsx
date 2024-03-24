import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import Link from "next/link";
import PixelSwitch from "../components/PixelSwitch";
export default function NavBar(props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  let src;

  return (
    <ThemeProvider>
      <nav>
        <li>
          <Link href="/">
            <p>Home</p>
          </Link>
        </li>
        <li>
          <Link href="/resume">
            <p>Resume</p>
          </Link>
        </li>
        <PixelSwitch />
      </nav>
    </ThemeProvider>
  );
}
