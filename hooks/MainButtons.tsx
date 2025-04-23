"use client";

import { useTheme } from "next-themes";

interface itemsType {
    [key: string]: string;
}

export function returnURL(text: string) {
    const { resolvedTheme } = useTheme();
    const items: itemsType = {
        GitHub: "https://github.com/honkita/",
        LinkedIn: "https://www.linkedin.com/in/elitelu",
        AboutMe: "./aboutme",
        Email: "mailto:elitelulww@gmail.com",
        Download: resumeTheme()
    };

    function resumeTheme() {
        if (resolvedTheme == "light") {
            return "./Elite_Lu_Resume.pdf";
        } else {
            return "./Elite_Lu_Resume_Dark.pdf";
        }
    }

    return items[text];
}
