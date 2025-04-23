"use client";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import utilStyles from "@styles/theme.util.module.css";
import TitleCSS from "./Title.module.css";

// Hooks
import { returnURL } from "@hooks/MainButtons";

/**
 *
 * @param {object} props
 * @param {string} props.name Main title
 * @param {string} props.colour Colour of background for page
 * @param {[string]} props.buttons Buttons used for the page
 * @returns
 */
export default function Title(props) {
    let itemList = props.buttons.map((item, index) => {
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

    // ${utilStyles.fadeInAnimation}

    return (
        <section
            className={`${TitleCSS.namePlate} ${background()} ${
                utilStyles.imageRendering
            }`}
        >
            <h1 className={`${TitleCSS.title} `}>{props.name}</h1>
            <section className={TitleCSS.containerButtons}>{itemList}</section>
        </section>
    );
}
