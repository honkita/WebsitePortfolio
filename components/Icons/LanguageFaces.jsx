import languages from "../public/Assets/languages.json";

var projectsJSON = JSON.parse(JSON.stringify(languages));

export function returnImage(text) {
    return projectsJSON[indexOfLanguage(text)].name;
}

export function returnURL(text) {
    return projectsJSON[indexOfLanguage(text)].url;
}

export function returnType(text) {
    return projectsJSON[indexOfLanguage(text)].type;
}

function indexOfLanguage(text) {
    for (let q = 0; q < projectsJSON.length; q++) {
        if (projectsJSON[q].name == text) return q;
    }
    return -1;
}
