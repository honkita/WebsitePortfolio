"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

// CSS
import PixelButtonCSS from "./PixelButton.module.css";

// JSONs
import PixelButtons from "@assets/PixelButtons.json";

/**
 * Props Interface
 */
interface PixelButtonProps {
   name: string;
   url: string;
   extra: boolean;
}

export default function PixelButton(props: PixelButtonProps) {
   const [mounted, setMounted] = useState(false);
   const { resolvedTheme } = useTheme();
   const name = props.name;
   var PixelButtonsJSON = JSON.parse(JSON.stringify(PixelButtons));

   // useEffect only runs on the client, so now we can safely show the UI
   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   function getValue() {
      if (PixelButtonsJSON[props.name] != null)
         return PixelButtonsJSON[props.name];
      return null;
   }

   let src;

   return (
      <Link href={props.url} target={getValue().target}>
         <button
            className={`${PixelButtonCSS.buttonRendering} ${
               props.extra != true
                  ? PixelButtonCSS.button
                  : PixelButtonCSS.titleButtons
            }`}
            title={name}
            aria-label={"Go to " + name}
            type="button"
            tabIndex={-1}
         >
            <img
               id="Icon"
               key={name}
               fetchPriority={"high"}
               src={
                  resolvedTheme === "light"
                     ? getValue().lightTheme
                     : getValue().darkTheme
               }
               title={name}
               aria-hidden={true}
               tabIndex={-1}
            />
         </button>
      </Link>
   );
}
