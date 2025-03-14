export function registerSettings() {
    console.log("Stream Character Slideshow | Registering Settings...");

    // Check if colorsettings is installed
    if (!game.modules.get("colorsettings")?.active) {
        ui.notifications.warn("Stream Character Slideshow: 'colorsettings' is required for color customization.");
    }

    /*** 🔄 General Module Settings ***/
    game.settings.register("stream-character-slideshow", "enableSlideshow", {
        name: "Enable Slideshow",
        hint: "Cycle through active characters on a delay.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("stream-character-slideshow", "cycleDelay", {
        name: "Slideshow Delay (Seconds)",
        hint: "Time before switching characters.",
        scope: "world",
        config: true,
        type: Number,
        default: 10
    });

    game.settings.register("stream-character-slideshow", "displayMode", {
        name: "Display Mode",
        hint: "Choose between Browser Source or Green Screen pop-up.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "browser": "OBS Browser Source",
            "green-screen": "Green Screen Window"
        },
        default: "browser"
    });

    /*** 🎨 Color Customization (Using Color Picker) ***/
    game.settings.register("stream-character-slideshow", "backgroundColor", {
        name: "Background Color",
        hint: "Choose a background color for the character display.",
        scope: "client",
        config: true,
        type: String,
        default: "#000000",
        onChange: value => document.documentElement.style.setProperty('--background-color', value)
    });

    game.settings.register("stream-character-slideshow", "textColor", {
        name: "Text Color",
        hint: "Choose the color for all text elements.",
        scope: "client",
        config: true,
        type: String,
        default: "#FFFFFF",
        onChange: value => document.documentElement.style.setProperty('--text-color', value)
    });

    game.settings.register("stream-character-slideshow", "hpBarColor", {
        name: "HP Bar Fill Color",
        hint: "Choose the color of the HP bar.",
        scope: "client",
        config: true,
        type: String,
        default: "#FF0000",
        onChange: value => document.documentElement.style.setProperty('--hp-bar-color', value)
    });

    game.settings.register("stream-character-slideshow", "hpBarOutlineColor", {
        name: "HP Bar Outline Color",
        hint: "Choose the outline color for the HP bar.",
        scope: "client",
        config: true,
        type: String,
        default: "#FFFFFF",
        onChange: value => document.documentElement.style.setProperty('--hp-bar-outline-color', value)
    });

    /*** 🏗️ Layout Customization ***/
    game.settings.register("stream-character-slideshow", "enableLayoutEditor", {
        name: "Enable Layout Editor",
        hint: "Open the drag-and-drop layout editor to customize element positions.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    /*** 🔄 Animation Settings ***/
    game.settings.register("stream-character-slideshow", "animationStyle", {
        name: "Transition Animation",
        hint: "Choose the transition animation style between characters.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "fade": "Fade",
            "slide": "Slide-in",
            "bounce": "Bounce",
            "zoom": "Zoom",
            "random": "Random Animation"
        },
        default: "fade"
    });

    /*** ⚙️ HP Display Mode Settings ***/
    game.settings.register("stream-character-slideshow", "hpDisplayMode", {
        name: "HP Display Mode",
        hint: "Choose how HP is displayed.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "numerical": "Numerical (45/62)",
            "bar": "Visual HP Bar",
            "hidden": "Do Not Display"
        },
        default: "numerical"
    });

    /*** 🎭 Toggle Labels (DEX, HP, AC, etc.) ***/
    const labels = ["name", "hp", "ac", "str", "dex", "con", "int", "wis", "cha"];
    labels.forEach(label => {
        game.settings.register("stream-character-slideshow", `showLabel-${label}`, {
            name: `Show ${label.toUpperCase()} Label`,
            hint: `Toggle the label for ${label.toUpperCase()}.`,
            scope: "client",
            config: true,
            type: Boolean,
            default: true
        });
    });
}
