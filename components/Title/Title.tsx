"use client";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import divstyling from "@styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

// Hooks
import { returnURL } from "@hooks/MainButtons";

/**
 * Props Interface
 */
interface TitleProps {
   colour: string;
   buttons: [string];
   name: string;
}

export default function Title(props: TitleProps) {
   let itemList = props.buttons.map((item, index: number) => {
      return (
         <PixelButton
            key={index}
            name={item}
            url={returnURL(item)}
            extra={true}
         />
      );
   });

   function background() {
      switch (props.colour) {
         case "red":
            return TitleCSS.redName;
         case "yellow":
            return TitleCSS.yellowName;
         default:
            break;
      }
   }

   return (
      <section
         className={`${TitleCSS.namePlate} ${background()} ${
            divstyling.imageRendering
         }`}
      >
         <div
            className={`${TitleCSS.titleCenter}
            }`}
         >
            <h1 className={`${TitleCSS.title} `}>{props.name}</h1>
            <section className={TitleCSS.containerButtons}>{itemList}</section>
         </div>
      </section>
   );
}
