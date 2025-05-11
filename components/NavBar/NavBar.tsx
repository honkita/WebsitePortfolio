"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

// Child Components
import PixelSwitch from "@components/PixelSwitch/PixelSwitch";

// CSS
import NavBarCSS from "./NavBar.module.css";

export default function NavBar() {
   const [mounted, setMounted] = useState(false);
   const { resolvedTheme } = useTheme();

   // useEffect only runs on the client, so now we can safely show the UI
   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   const path = "./images/NavBar/";

   const pages = [
      { name: "Home", link: "/", file: "Home" },
      { name: "About Me", link: "/aboutme", file: "AboutMe" }
   ];

   function getButton(name: string, light: boolean) {
      if (light) return path + "Pixel_" + name + ".svg";
      return path + "Pixel_" + name + "_Dark.svg";
   }

   return (
      <nav className={NavBarCSS.navBar}>
         <ul className={NavBarCSS.noBullets}>
            {pages.map((page, index) => (
               <Link href={page.link} key={index}>
                  <button
                     className={`${NavBarCSS.buttonRendering} ${NavBarCSS.button}`}
                     title={page.name}
                     aria-label={"Go to " + page.name}
                     type="button"
                     tabIndex={-1}
                  >
                     <img
                        id="Icon"
                        key={page.name}
                        src={
                           resolvedTheme === "light"
                              ? getButton(page.file, true)
                              : getButton(page.file, false)
                        }
                        title={page.name}
                        aria-hidden={true}
                        tabIndex={-1}
                        fetchPriority={"high"}
                     />
                  </button>
               </Link>
            ))}
         </ul>
         <PixelSwitch />
      </nav>
   );
}
