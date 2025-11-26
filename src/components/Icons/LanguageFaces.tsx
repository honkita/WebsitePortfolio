"use client";

// JSONs
import languages from "@/assets/languages.json";

var projectsJSON = JSON.parse(JSON.stringify(languages));

export function returnImage(text: string) {
    return projectsJSON[indexOfLanguage(text)].name;
}

export function returnURL(text: string) {
    return projectsJSON[indexOfLanguage(text)].url;
}

export function returnType(text: string) {
    return projectsJSON[indexOfLanguage(text)].type;
}

function indexOfLanguage(text: string) {
    for (let q = 0; q < projectsJSON.length; q++) {
        if (projectsJSON[q].name == text) return q;
    }
    return -1;
}
