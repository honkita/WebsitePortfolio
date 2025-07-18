export function returnURL(text: string, resolvedTheme: string) {
    const resumeTheme = () =>
        resolvedTheme === "light"
            ? "./Elite_Lu_Resume.pdf"
            : "./Elite_Lu_Resume_Dark.pdf";

    const items: { [key: string]: string } = {
        GitHub: "https://github.com/honkita/",
        LinkedIn: "https://www.linkedin.com/in/elitelu",
        AboutMe: "./aboutme",
        Email: "mailto:elitelulww@gmail.com",
        Download: resumeTheme()
    };

    return items[text];
}
