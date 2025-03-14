export function registerSettings() {
    console.log("✅ Registering Stream Character Slideshow Settings...");

    // Register all settings
    game.settings.register("streamcharacterslideshow", "enableSlideshow", {
        name: "Enable Slideshow",
        hint: "Cycle through active characters on a delay.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("streamcharacterslideshow", "cycleDelay", {
        name: "Slideshow Delay (Seconds)",
        hint: "Time before switching characters.",
        scope: "world",
        config: true,
        type: Number,
        default: 10
    });

    game.settings.register("streamcharacterslideshow", "backgroundColor", {
        name: "Background Color",
        hint: "Choose a background color for the character display.",
        scope: "client",
        config: true,
        type: String,
        default: "#000000"
    });

    game.settings.register("streamcharacterslideshow", "textColor", {
        name: "Text Color",
        hint: "Choose the color for all text elements.",
        scope: "client",
        config: true,
        type: String,
        default: "#FFFFFF"
    });

    game.settings.register("streamcharacterslideshow", "hpBarColor", {
        name: "HP Bar Fill Color",
        hint: "Choose the color of the HP bar.",
        scope: "client",
        config: true,
        type: String,
        default: "#FF0000"
    });

    game.settings.register("streamcharacterslideshow", "hpBarOutlineColor", {
        name: "HP Bar Outline Color",
        hint: "Choose the outline color for the HP bar.",
        scope: "client",
        config: true,
        type: String,
        default: "#FFFFFF"
    });

    // Register the new settings for layout customization
    game.settings.register("streamcharacterslideshow", "charNamePosition", {
        name: "Character Name Position",
        hint: "Choose where the character name appears in the overlay.",
        scope: "client",
        config: true,
        type: String,
        default: "top-center", // Default position
        choices: {
            "top-left": "Top Left",
            "top-center": "Top Center",
            "top-right": "Top Right",
            "bottom-left": "Bottom Left",
            "bottom-center": "Bottom Center",
            "bottom-right": "Bottom Right"
        }
    });
}
