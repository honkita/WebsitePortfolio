import React, { useEffect, useState } from "react";

export default function ImageCarousel(props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  return (
    <div>
      {props.images.map((image) => (
        <div className="">
          <button
            className={`${utilStyles.logoButtonSmall} ${utilStyles.buttonRendering}`}
            title={devTool.name}
          >
            <img id={devTool.name} src={devTool.url} alt={devTool.name} />
          </button>
          {devTool.name}
        </div>
      ))}
    </div>
  );
}
