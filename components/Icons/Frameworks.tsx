"use client";

import React, { useEffect, useState } from "react";

// CSS
import IconsCSS from "./Icons.module.css";

// JSONs
import frameworks from "@assets/frameworks.json";

/**
 *
 * @returns
 */
export default function Frameworks() {
   const [mounted, setMounted] = useState(false);
   var frameworksJSON = JSON.parse(JSON.stringify(frameworks));

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   return (
      <div className={IconsCSS.grid}>
         {frameworksJSON.map(
            (frameworks: { name: string; url: string }, index: number) => (
               <div className={IconsCSS.under} key={index}>
                  <button
                     className={`${IconsCSS.logoButton} ${IconsCSS.buttonRendering}`}
                     title={frameworks.name}
                     tabIndex={-1}
                  >
                     <img
                        id={frameworks.name}
                        src={frameworks.url}
                        alt={frameworks.name + " image"}
                     />
                  </button>
                  <div className={`${IconsCSS.hide} ${IconsCSS.logoText}`}>
                     {frameworks.name}
                  </div>
               </div>
            )
         )}
      </div>
   );
}
