"use client";

import React, { useState, useEffect } from "react";

// Child Components
import PaginatedIcons from "@components/PaginatedIcons/PaginatedIcons";
import Title from "@components/Title/Title";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import divstyling from "@styles/divstyling.module.css";

// JSONs
import devTools from "@assets/devTools.json";
import frameworks from "@assets/frameworks.json";
import languages from "@assets/languages.json";

export default function AboutMeClient() {
    const [activeTab, setActiveTab] = useState<
        "languages" | "frameworks" | "devTools"
    >("languages");

    const languagesJSON = JSON.parse(JSON.stringify(languages));
    const frameworksJSON = JSON.parse(JSON.stringify(frameworks));
    const devToolsJSON = JSON.parse(JSON.stringify(devTools));

    const getActiveIcons = () => {
        switch (activeTab) {
            case "languages":
                return languagesJSON;
            case "frameworks":
                return frameworksJSON;
            case "devTools":
                return devToolsJSON;
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Title
                name="About Me"
                colour="yellow"
                buttons={["LinkedIn", "GitHub", "Email", "ResumeDownload"]}
            />

            <div className={styles.contentWrapper}>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>

                <div className={styles.centeredContent}>
                    <section
                        className={`${utilStyles.headingXl} ${styles.paddingTopBottom}`}
                    >
                        Technologies
                    </section>

                    <div className={styles.twoPane}>
                        {/* Left Panel */}
                        <div className={styles.leftPane}>
                            <div className={styles.tabButtons}>
                                <button
                                    className={
                                        activeTab === "languages"
                                            ? styles.activeTab
                                            : ""
                                    }
                                    onClick={() => setActiveTab("languages")}
                                    style={{ fontFamily: "inherit" }}
                                >
                                    Languages
                                </button>
                                <button
                                    className={
                                        activeTab === "frameworks"
                                            ? styles.activeTab
                                            : ""
                                    }
                                    onClick={() => setActiveTab("frameworks")}
                                    style={{ fontFamily: "inherit" }}
                                >
                                    Frameworks
                                </button>
                                <button
                                    className={
                                        activeTab === "devTools"
                                            ? styles.activeTab
                                            : ""
                                    }
                                    onClick={() => setActiveTab("devTools")}
                                    style={{ fontFamily: "inherit" }}
                                >
                                    Dev Tools
                                </button>
                            </div>

                            <PaginatedIcons icons={getActiveIcons()} />
                        </div>

                        {/* Right Panel */}
                        <div className={styles.rightPane}>
                            <p style={{ opacity: 0.6 }}>
                                [ Placeholder for details ]
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
