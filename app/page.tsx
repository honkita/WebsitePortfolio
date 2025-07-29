import React from "react";
import type { Metadata } from "next";

// Child Components
import HomeTitle from "@components/Title/HomeTitle";

// CSS
import divstyling from "@styles/divstyling.module.css";
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";

export const metadata: Metadata = {
    title: "Elite Lu Portfolio"
};

export default function Home() {
    return (
        <div>
            <HomeTitle name="Elite Lu" colour="red" />
            <div className={styles.contentWrapper}>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
                {/* <section className={utilStyles.headingMd}>
                    <ul>
                        <li>Software developer</li>
                        <li>Fourth year Computer Science McMaster Student</li>
                    </ul>
                </section> */}
            </div>
        </div>
    );
}
