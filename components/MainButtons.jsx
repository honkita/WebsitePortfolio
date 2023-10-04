var items = {
  GitHub: { url: "./images/Logos/HTML.png" },
  LinkedIn: {
    url: "https://www.linkedin.com/in/elitelu",
  },
  Resume: { url: "./images/Logos/Elm.png" },
  Email: {
    url: "mailto:elitelulww@gmail.com",
  },
  Download: { url: "./Elite_Lu_Resume.pdf" },
};

export function returnItem(text) {
  return items[text];
}

export function returnURL(text) {
  return items[text].url;
}
