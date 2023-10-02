var items = {
  HTML: { type: "Markup", url: "./images/Logos/HTML.png" },
  CSS: { type: "Style Sheet", url: "./images/Logos/CSS.png" },
  JavaScript: {
    type: "Object-Oriented",
    url: "./images/Logos/JS.png",
  },
  Elm: { type: "Functional", url: "./images/Logos/Elm.png" },
  Processing: {
    type: "Object-Oriented",
    url: "./images/Logos/Processing.png",
  },
  Java: { type: "Object-Oriented", url: "./images/Logos/Java.png" },
};

export function returnImage(text) {
  return items[text];
}

export function returnURL(text) {
  return items[text].url;
}

export function returnType(text) {
  return items[text].type;
}
