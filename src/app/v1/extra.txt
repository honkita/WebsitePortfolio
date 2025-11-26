import Head from "next/head";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import Projects2 from "../components/Projects2";
import Layout from "./Layout";

export default function extra() {
    const name = "Elite Lu Portfolio";

    let people = [
        {
            name: "James Nikoli",
            url: "https://github.com/devdalus",
            LinkedIn: "https://www.linkedin.com/in/james-nickoli/",
        },
        {
            name: "Krish Krish",
            url: "https://github.com/Krish120003",
            LinkedIn: "https://www.linkedin.com/in/krish-krish/",
        },
        {
            name: "Jason Huang",
            url: "https://github.com/err53",
            LinkedIn: "https://www.linkedin.com/in/jasonhuang03/",
        },
        {
            name: "Ishpreet Nagi",
            url: "https://github.com/IshpreetNagi",
            LinkedIn: "https://www.linkedin.com/in/ishpreet-nagi-b609b1180/",
        },
        {
            name: "Kenneth Vincenzo Salim",
            url: "https://github.com/kennethkvs",
            LinkedIn: "https://www.linkedin.com/in/kennethkvs/",
        },
        {
            name: "Geon Youn",
            url: "https://github.com/geon-youn",
            LinkedIn: "https://www.linkedin.com/in/geon-youn/",
        },
        {
            name: "Owen Gretzinger",
            url: "https://github.com/owengretzinger",
            LinkedIn: "https://www.linkedin.com/in/owengretzinger/",
        },
        {
            name: "Stella Gu",
            url: "https://github.com/Stella-Gu",
            LinkedIn: "https://www.linkedin.com/in/stella-gu-21067a212/",
        },
    ];

    let itemList = people.map((item, index) => {
        return (
            <Projects2
                name={item.name}
                url={item.url}
                LinkedIn={item.LinkedIn}
            />
        );
    });

    return (
        <Layout children>
            <div>
                <Head>
                    <title>{"Special Thanks"}</title>
                    <meta
                        name="description"
                        content="Elite Lu's official portfolio site"
                    />
                    <meta name="og:title" content={name} />
                </Head>
                <section className={styles.container}>
                    <section className={utilStyles.heading2Xl}>
                        Special Thanks
                    </section>
                    <section className={utilStyles.headingMd}>
                        <p>
                            I would like to dedicate this area to all the people
                            that have helped me make this site. I could have not
                            done this project without each of these people.
                        </p>
                    </section>
                    <div className={styles.jobGrid}>{itemList}</div>
                </section>
            </div>
        </Layout>
    );
}
