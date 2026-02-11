import React from "react";
import type { Metadata } from "next";

// Child Components
import HomeTitle from "@/components/Title/HomeTitle";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import styles from "@/app/ui/home.module.css";

// Metadata
export const metadata: Metadata = {
    title: "Elite Lu Portfolio"
};

/**
 * Serverside Home Page
 * @returns
 */
const Home = () => {
    return (
        <div className={styles.contentWrapper}>
            <HomeTitle name="Elite Lu" colour="red" />
            <div>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
            </div>
        </div>
    );
}
export default Home;
