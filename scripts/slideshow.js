import { getCharacterData } from "./data.js";

let characters = [];
let currentIndex = 0;
let slideshowInterval = null;

// ✅ Check if the setting exists before trying to access
function getSetting(key) {
    if (!game.settings.settings.has(`streamcharacterslideshow.${key}`)) {
        console.error(`🚨 ERROR: Setting '${key}' is missing!`);
        return null;
    }
    return game.settings.get("streamcharacterslideshow", key);
}

// ✅ Start Slideshow manually
export function startSlideshow() {
    console.log("Starting Character Slideshow...");

    characters = getCharacterData();
    if (characters.length === 0) {
        console.warn("No characters available for slideshow.");
        return;
    }

    let cycleDelay = getSetting("cycleDelay");
    if (cycleDelay === null) {
        console.error("cycleDelay setting is missing! Aborting slideshow.");
        return;
    }

    // Show the first character immediately
    updateDisplay(characters[0]);

    // Set interval to switch characters
    slideshowInterval = setInterval(() => {
        if (characters.length === 0) return;
        currentIndex = (currentIndex + 1) % characters.length;
        updateDisplay(characters[currentIndex]);
    }, cycleDelay * 1000);
}

// ✅ Stop Slideshow manually
export function stopSlideshow() {
    console.log("Stopping Character Slideshow...");
    clearInterval(slideshowInterval);
}

// ✅ Prevent crashes if the overlay container is not found
function updateDisplay(character) {
    let displayContainer = document.getElementById("character-display");
    if (!displayContainer) {
        console.error("Display container not found! Ensure the overlay is open.");
        return;
    }

    let animationClass = getAnimationClass();
    displayContainer.classList.remove("fade", "slide", "bounce", "zoom");
    void displayContainer.offsetWidth; // force reflow
    displayContainer.classList.add(animationClass);

    // Update the character stats
    document.getElementById("char-name").innerHTML = getLabel("name") + character.name;
    document.getElementById("char-ac").innerHTML = getLabel("ac") + `AC: ${character.AC}`;

    // Handle HP display
    let hpElement = document.getElementById("char-hp");
    let hpBarFill = document.getElementById("hp-bar-fill");

    if (getSetting("hpDisplayMode") === "numerical") {
        hpElement.style.display = "block";
        hpElement.innerHTML = getLabel("hp") + `${character.currentHP}/${character.maxHP}`;
        hpBarFill.style.width = "0%";
    } else if (getSetting("hpDisplayMode") === "bar") {
        hpElement.style.display = "none";
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

// ✅ Animation class based on user settings
function getAnimationClass() {
    let animationSetting = getSetting("animationStyle");
    if (animationSetting === "random") {
        let animations = ["fade", "slide", "bounce", "zoom"];
        return animations[Math.floor(Math.random() * animations.length)];
    }
    return animationSetting;
}

// ✅ Determine whether to show stat labels
function getLabel(stat) {
    return getSetting(`showLabel-${stat}`) ? `${stat.toUpperCase()}: ` : "";
}
