import { registerSettings } from "./settings.js";
import { startSlideshow, stopSlideshow } from "./scripts/slideshow.js";

Hooks.once("init", function () {
    console.log("Stream Character Slideshow | Initializing...");
    try {
        registerSettings(); // Register settings during initialization
        console.log("Settings Registered!");
    } catch (error) {
        console.error("Failed to Register Settings:", error);
    }
});

Hooks.once("setup", function () {
    if (!game.modules.get("lib-wrapper")?.active) {
        ui.notifications.error("Stream Character Slideshow: 'libWrapper' is required but not enabled!");
    }
    if (!game.modules.get("socketlib")?.active) {
        ui.notifications.error("Stream Character Slideshow: 'socketlib' is required but not enabled!");
    }
    if (!game.modules.get("colorsettings")?.active) {
        ui.notifications.warn("Stream Character Slideshow: 'colorsettings' is required for color customization.");
    }
});

// Layout Editor Application
class OpenLayoutEditorApplication extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Character Layout Editor",
            id: "character-layout-editor",
            template: "modules/streamcharacterslideshow/layout-editor.html",
            width: 600,
            height: 500
        });
    }

    getData() {
        return {
            charNamePosition: game.settings.get("streamcharacterslideshow", "charNamePosition"),
            textColor: game.settings.get("streamcharacterslideshow", "textColor"),
            backgroundColor: game.settings.get("streamcharacterslideshow", "backgroundColor"),
            hpBarColor: game.settings.get("streamcharacterslideshow", "hpBarColor"),
            hpBarOutlineColor: game.settings.get("streamcharacterslideshow", "hpBarOutlineColor")
        };
    }

    async _updateObject(event, formData) {
        for (let [key, value] of Object.entries(formData)) {
            await game.settings.set("streamcharacterslideshow", key, value);
        }
    }
}

// Open Overlay Application
class OpenOverlayApplication extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Character Overlay",
            id: "character-overlay",
            template: "modules/streamcharacterslideshow/obs-control.html",
            width: 400,
            height: 300
        });
    }

    getData() {
        return {
            isRunning: false // You might want to track this state
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find("#open-overlay").click(this._onOpenOverlay.bind(this));
        html.find("#start-slideshow").click(this._onStartSlideshow.bind(this));
        html.find("#stop-slideshow").click(this._onStopSlideshow.bind(this));
    }

    _onOpenOverlay(event) {
        event.preventDefault();
        window.open("modules/streamcharacterslideshow/obs.html", "Character Display", "width=800,height=400");
    }

    _onStartSlideshow(event) {
        event.preventDefault();
        startSlideshow();
    }

    _onStopSlideshow(event) {
        event.preventDefault();
        stopSlideshow();
    }
}

// Register Menu Buttons
Hooks.once("ready", function () {
    // Register Menu for Opening Overlay
    game.settings.registerMenu("streamcharacterslideshow", "openOverlay", {
        name: "Open Character Overlay",
        label: "Open Overlay",
        hint: "Opens the character display for OBS streaming.",
        icon: "fas fa-eye",
        type: OpenOverlayApplication,
        restricted: false
    });

    // Register Menu for Layout Editor
    game.settings.registerMenu("streamcharacterslideshow", "openLayoutEditor", {
        name: "Customize Character Display",
        label: "Open Layout Editor",
        hint: "Customize the layout of character stats.",
        icon: "fas fa-cogs",
        type: OpenLayoutEditorApplication,
        restricted: false
    });

    console.log("Stream Character Slideshow | Waiting for user input.");
});

// Add Scene Control Button for easier access
Hooks.on("getSceneControlButtons", (controls) => {
    const tokenControls = controls.find(control => control.name === "token");
    if (tokenControls) {
        tokenControls.tools.push({
            name: "streamCharacterSlideshow",
            title: "Open Character Display",
            icon: "fas fa-eye",
            onClick: () => new OpenOverlayApplication().render(true),
            button: true
        });
    }
});
