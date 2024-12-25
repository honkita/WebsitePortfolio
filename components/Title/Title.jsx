import PixelButton from "../PixelButton/PixelButton";
import utilStyles from "../../styles/theme.util.module.css";
import { returnURL } from "../MainButtons";
import TitleCSS from "./Title.module.css";

/**
 *
 * @param {object} props
 * @param {string} props.name Main title
 * @param {string} props.colour Colour of background for page
 * @param {[string]} props.buttons Buttons used for the page
 * @returns
 */
export default function Title(props) {
    let itemList = props.buttons.map((item, _) => {
        return <PixelButton name={item} url={returnURL(item)} extra={true} />;
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
                utilStyles.imageRendering
            }`}
        >
            <h1
                className={`${utilStyles.heading2Xl2} ${utilStyles.fadeInAnimation}`}
            >
                {props.name}
            </h1>
            <section className={TitleCSS.containerButtons}>{itemList}</section>
        </section>
    );
}
