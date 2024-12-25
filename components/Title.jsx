import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React from "react";
import { returnURL } from "./MainButtons";

export default function Title(props) {
    let itemList = props.buttons.map((item, index) => {
        return <PixelButton name={item} url={returnURL(item)} extra={true} />;
    });

    function background() {
        switch (props.colour) {
            case "red":
                return utilStyles.redName;
            case "yellow":
                return utilStyles.yellowName;
            default:
                break;
        }
    }

    return (
        <section
            className={`${utilStyles.namePlate} ${background()} ${
                utilStyles.imageRendering
            }`}
        >
            <h1
                className={`${utilStyles.heading2Xl2} ${utilStyles.fadeInAnimation}`}
            >
                {props.name}
            </h1>
            <section className={styles.containerButtons}>{itemList}</section>
        </section>
    );
}
