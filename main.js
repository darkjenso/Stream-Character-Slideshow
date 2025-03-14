import { registerSettings } from "./settings.js";
import { getCharacterData } from "./scripts/data.js";
import { startSlideshow } from "./scripts/slideshow.js";

Hooks.once("init", async function () {
    console.log("Stream Character Slideshow | Initializing...");
    registerSettings();
});

Hooks.once("setup", function () {
    // Check for required dependencies
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
    if (game.settings.get("stream-character-slideshow", "enableSlideshow")) {
        startSlideshow();
    }
    
    // Apply custom colors from settings
    applyCustomColors();
});

// Apply color settings dynamically
function applyCustomColors() {
    document.documentElement.style.setProperty('--background-color', game.settings.get("stream-character-slideshow", "backgroundColor"));
    document.documentElement.style.setProperty('--text-color', game.settings.get("stream-character-slideshow", "textColor"));
    document.documentElement.style.setProperty('--hp-bar-color', game.settings.get("stream-character-slideshow", "hpBarColor"));
    document.documentElement.style.setProperty('--hp-bar-outline-color', game.settings.get("stream-character-slideshow", "hpBarOutlineColor"));
}

// Use libWrapper to safely modify Foundry API functions
Hooks.once("ready", function () {
    if (game.modules.get("lib-wrapper")?.active) {
        libWrapper.register(
            "stream-character-slideshow",
            "getSceneControlButtons",
            function (wrapped, ...args) {
                let buttons = wrapped(...args);
                buttons.push({
                    name: "streamCharacterSlideshow",
                    title: "Open Character Display",
                    icon: "fas fa-eye",
                    onClick: () => window.open("modules/stream-character-slideshow/obs.html", "Character Display", "width=800,height=400")
                });
                return buttons;
            },
            "WRAPPER"
        );
    }
});

// Socketlib Integration: Sync settings across clients
Hooks.once("ready", function () {
    if (game.modules.get("socketlib")?.active) {
        let socket = socketlib.registerModule("stream-character-slideshow");

        function updateSlideshowSettings(data) {
            game.settings.set("stream-character-slideshow", data.setting, data.value);
            applyCustomColors(); // Update colors if modified
        }

        socket.register("updateSlideshowSettings", updateSlideshowSettings);
    }
});
