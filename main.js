import { registerSettings } from "./settings.js";
import { getCharacterData } from "./scripts/data.js";
import { startSlideshow } from "./scripts/slideshow.js";

Hooks.once("init", function () {
    console.log("Stream Character Slideshow | Initializing...");
    try {
        registerSettings();
        console.log("Stream Character Slideshow | Settings Registered Successfully!");
    } catch (error) {
        console.error("Stream Character Slideshow | Failed to Register Settings:", error);
    }
});

Hooks.once("setup", function () {
    if (!game.modules.get("lib-wrapper")?.active) {
        ui.notifications.error("Stream Character Slideshow: 'libWrapper' is required but not enabled! Please install and activate it.");
    }

    if (!game.modules.get("socketlib")?.active) {
        ui.notifications.error("Stream Character Slideshow: 'socketlib' is required but not enabled! Please install and activate it.");
    }

    if (!game.modules.get("colorsettings")?.active) {
        ui.notifications.warn("Stream Character Slideshow: 'colorsettings' is required for color customization.");
    }
});

Hooks.once("ready", function () {
    console.log("Stream Character Slideshow | Ready.");
    if (game.settings.get("streamcharacterslideshow", "enableSlideshow")) {
        startSlideshow();
    }
    
    applyCustomColors();
});

// Apply custom colors dynamically
function applyCustomColors() {
    document.documentElement.style.setProperty('--background-color', game.settings.get("streamcharacterslideshow", "backgroundColor"));
    document.documentElement.style.setProperty('--text-color', game.settings.get("streamcharacterslideshow", "textColor"));
    document.documentElement.style.setProperty('--hp-bar-color', game.settings.get("streamcharacterslideshow", "hpBarColor"));
    document.documentElement.style.setProperty('--hp-bar-outline-color', game.settings.get("streamcharacterslideshow", "hpBarOutlineColor"));
}

// Use libWrapper to safely modify Foundry API functions
Hooks.once("ready", function () {
    if (game.modules.get("lib-wrapper")?.active) {
        libWrapper.register(
            "streamcharacterslideshow",
            "getSceneControlButtons",
            function (wrapped, ...args) {
                let buttons = wrapped(...args);
                buttons.push({
                    name: "streamCharacterSlideshow",
                    title: "Open Character Display",
                    icon: "fas fa-eye",
                    onClick: () => window.open("modules/streamcharacterslideshow/obs.html", "Character Display", "width=800,height=400")
                });
                return buttons;
            },
            "WRAPPER"
        );
    }
});
