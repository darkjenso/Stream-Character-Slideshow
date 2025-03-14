import { getCharacterData } from "./data.js";

let characters = [];
let currentIndex = 0;

// Fetch user settings from Foundry
function getSetting(key) {
    return game.settings.get("stream-character-slideshow", key);
}

// Start the character slideshow
export function startSlideshow() {
    characters = getCharacterData();
    if (characters.length === 0) return;

    setInterval(() => {
        if (characters.length === 0) return;

        currentIndex = (currentIndex + 1) % characters.length;
        updateDisplay(characters[currentIndex]);
    }, getSetting("cycleDelay") * 1000);

    updateDisplay(characters[0]);
}

// Updates the OBS display with character details
function updateDisplay(character) {
    let displayContainer = document.getElementById("character-display");
    let animationClass = getAnimationClass();

    // Remove previous animation and force reflow
    displayContainer.classList.remove("fade", "slide", "bounce", "zoom");
    void displayContainer.offsetWidth;
    displayContainer.classList.add(animationClass);

    // Update text elements
    document.getElementById("char-name").innerHTML = getLabel("name") + character.name;
    document.getElementById("char-ac").innerHTML = getLabel("ac") + `AC: ${character.AC}`;

    let hpElement = document.getElementById("char-hp");
    let hpBarFill = document.getElementById("hp-bar-fill");

    // HP Display Mode: Numerical, Bar, or Hidden
    if (getSetting("hpDisplayMode") === "numerical") {
        hpElement.style.display = "block";
        hpElement.innerHTML = getLabel("hp") + `${character.currentHP}/${character.maxHP}`;
        hpBarFill.style.width = "0%"; // Hide the bar
    } else if (getSetting("hpDisplayMode") === "bar") {
        hpElement.style.display = "none"; // Hide text HP
        let hpPercent = (character.currentHP / character.maxHP) * 100;
        hpBarFill.style.width = `${hpPercent}%`;
    } else {
        hpElement.style.display = "none";
        hpBarFill.style.width = "0%";
    }

    // Update ability scores
    document.getElementById("char-stats").innerHTML = `
        ${getLabel("str")}${character.abilityScores.STR}, 
        ${getLabel("dex")}${character.abilityScores.DEX}, 
        ${getLabel("con")}${character.abilityScores.CON}, 
        ${getLabel("int")}${character.abilityScores.INT}, 
        ${getLabel("wis")}${character.abilityScores.WIS}, 
        ${getLabel("cha")}${character.abilityScores.CHA}
    `;
}

// Determine the animation style
function getAnimationClass() {
    let animationSetting = getSetting("animationStyle");
    if (animationSetting === "random") {
        let animations = ["fade", "slide", "bounce", "zoom"];
        return animations[Math.floor(Math.random() * animations.length)];
    }
    return animationSetting;
}

// Determine whether to show stat labels
function getLabel(stat) {
    return getSetting(`showLabel-${stat}`) ? `${stat.toUpperCase()}: ` : "";
}
