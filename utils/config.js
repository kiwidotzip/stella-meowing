import Settings from "../../Amaterasu/core/Settings";
import DefaultConfig from "../../Amaterasu/core/DefaultConfig";

/*  ------------------- Config ------------------

    Core Config

    ------------------- To Do -------------------

    - Make themeing work

    --------------------------------------------- */

//setup

//markdown stuff
const version = JSON.parse(FileLib.read("eclipseAddons", "metadata.json")).version;

const CREDITS = FileLib.read("eclipseAddons", "assets/credits.md");
const CHANGELOG = `# §bEclipse Addonss v${version}\n ${FileLib.read("eclipseAddons", "assets/changelog.md")}`;

const schemes = ["data/ColorScheme.json", "data/scheme-vigil.json", "data/scheme-nwjn.json"];

//guis
export const roomName = new Gui();

//config
const defaultConf = new DefaultConfig("eclipseAddons", "data/settings.json")

    //general
    .addTextParagraph({
        category: "General",
        configName: "Info",
        title: `&6&l&nEclipse Addons`,
        description: "&bMade by NEXD_",
        centered: true,
        subcategory: "",
    })

    .addButton({
        category: "General",
        subcategory: "",
        configName: "MyDiscord",
        title: "Discord Server",
        description: "Join if you want to report a bug or want to make a suggestion", // The description for this [Button] to display in the [Theme]
        tags: ["discord"],
        onClick(setting) {
            ChatLib.command("ct copy coming soon", true);
            ChatLib.chat("&6Copied Discord Link!");
        },
    })

    .addButton({
        category: "General",
        subcategory: "",
        configName: "MyGithub",
        title: "Github",
        description: "The source code for all this :D",
        tags: ["discord"],
        onClick(setting) {
            ChatLib.command("ct copy https://github.com/Eclipse-5214/eclipseAddons", true);
            ChatLib.chat("&6Copied Discord Link!");
        },
    })

    //dungoens

    //dugeon trash
    .addSwitch({
        category: "Dungeons",
        configName: "highlightTrash",
        title: "Highligt Dugneon trash",
        description: "Highlights dungeon trash in your inventory",
        subcategory: "General",
    })

    .addColorPicker({
        configName: "trashColor",
        title: "Highlight Color",
        description: "The color to highlight trash",
        category: "Dungeons",
        subcategory: "General",
        value: [0, 255, 255, 255],

        shouldShow(data) {
            return data.highlightTrash;
        },
    })

    //room name
    .addSwitch({
        category: "Dungeons",
        configName: "showRoomName",
        title: "Show Room Name",
        description: "Shows the current rooms name",
        subcategory: "Room Name",
    })

    .addSwitch({
        category: "Dungeons",
        configName: "chromaRoomName",
        title: "Chroma room name",
        description: "Makes the name chroma",
        subcategory: "Room Name",

        shouldShow(data) {
            return data.showRoomName;
        },
    })

    .addButton({
        category: "Dungeons",
        configName: "editRoomName",
        title: "Room Name Location",
        description: "Move the room name, change the scale, etc.",
        subcategory: "Room Name",
        placeHolder: "Edit",

        onClick() {
            roomName.open();
        },

        shouldShow(data) {
            return data.showRoomName;
        },
    })

    .addColorPicker({
        configName: "roomNameColor",
        title: "Background Color",
        description: "The Background Color of the room name",
        category: "Dungeons",
        subcategory: "Room Name",
        value: [0, 0, 0, 0],

        shouldShow(data) {
            return data.showRoomName;
        },
    })

    //terminal numbers
    .addSwitch({
        category: "Dungeons",
        configName: "termNumbers",
        title: "Terminal Numbers",
        description: "Number the terminals in dungeons (for calling terms)",
        subcategory: "Terminals",
    })

    .addDropDown({
        configName: "termNumber",
        title: "Number",
        description: "What terminal number you want to call",
        category: "Dungeons",
        subcategory: "Terminals",
        options: ["1", "2", "3", "4", "All"],
        value: 4,

        shouldShow(data) {
            return data.termNumbers;
        },
    })

    .addSwitch({
        category: "Dungeons",
        configName: "termClass",
        title: "Show Class",
        description: "Displays related class",
        subcategory: "Terminals",

        shouldShow(data) {
            return data.termNumbers;
        },
    })

    //terminal tracker
    .addSwitch({
        category: "Dungeons",
        configName: "termTracker",
        title: "Terminal Tracker",
        description: "Tracks terminals, devices, and levers",
        subcategory: "Terminals",
    })

    //Secret routes

    //general options
    .addSwitch({
        configName: "modEnabled",
        title: "Render Routes",
        description: "Main toggle",
        category: "Routes",
        subcatagory: "General",
        value: true,
    })

    .addSwitch({
        configName: "boxSecrets",
        title: "Box Secrets",
        description: "Wether or not to box secrets",
        category: "Routes",
        subcatagory: "General",
        value: true,
    })

    .addSwitch({
        configName: "showText",
        title: "ShowText",
        description: "wether or not to show text",
        category: "Routes",
        subcatagory: "General",
        value: true,
    })

    //keybinds

    .addKeybind({
        category: "Routes",
        subcategory: "Keybinds",
        configName: "nextStep",
        title: "Next Step",
        description: "Goes to the next step",
        value: 27,
    })

    .addKeybind({
        category: "Routes",
        subcategory: "Keybinds",
        configName: "lastStep",
        title: "Last Step",
        description: "Goes back to the last step",
        value: 26,
    })

    .addKeybind({
        category: "Routes",
        subcategory: "Keybinds",
        configName: "resetStep",
        title: "Reset",
        description: "Resets the route",
        value: 43,
    })

    //line stuff
    .addDropDown({
        configName: "lineType",
        title: "Line Type",
        description: "Type of secret line",
        category: "Routes",
        subcategory: "Line",
        options: ["Fire Particles", "Lines"],
        value: 0,
    })

    .addSlider({
        configName: "lineWidth",
        title: "Line width",
        description: "Line width (not for particles)",
        category: "Routes",
        subcategory: "Line",
        options: [1, 5],
        value: 2,
    })

    .addColorPicker({
        configName: "lineColor",
        title: "Line Color",
        description: "The color to use for the line.",
        category: "Routes",
        subcategory: "Line",
        value: [255, 0, 0, 255],
    })

    //boxcolors
    .addColorPicker({
        configName: "warpColor",
        title: "Etherwarp Color",
        description: "The color to use for the etherwarps.",
        category: "Routes",
        subcategory: "Colors",
        value: [0, 0, 255, 255],
    })

    .addColorPicker({
        configName: "mineColor",
        title: "Stonk Color",
        description: "The color to use for the ghost blocks.",
        category: "Routes",
        subcategory: "Colors",
        value: [255, 0, 255, 255],
    })

    .addColorPicker({
        configName: "tntColor",
        title: "Superboom Color",
        description: "The color to use for the Superbooms.",
        category: "Routes",
        subcategory: "Colors",
        value: [255, 0, 0, 255],
    })

    .addColorPicker({
        configName: "clickColor",
        title: "Lever Color",
        description: "The color to use for levers and other interactions.",
        category: "Routes",
        subcategory: "Colors",
        value: [255, 255, 0, 255],
    })

    .addColorPicker({
        configName: "secretColor",
        title: "Secret Color",
        description: "The color to use for Secrets.",
        category: "Routes",
        subcategory: "Colors",
        value: [0, 255, 0, 255],
    })

    //Secret waypoints

    //general
    .addSwitch({
        configName: "secretWaypoints",
        title: "Secret Waypoints",
        description: "Displays secret waypoints",
        category: "Waypoints",
        subcatagory: "General",
    })

    .addSwitch({
        configName: "boxWSecrets",
        title: "Box Secrets",
        description: "wether or not to box secrets",
        category: "Waypoints",
        subcatagory: "General",
        value: true,
    })

    .addSwitch({
        configName: "showWText",
        title: "ShowText",
        description: "wether or not to show text",
        category: "Waypoints",
        subcatagory: "General",
        value: true,
    })

    //colors

    .addColorPicker({
        configName: "chestColor",
        title: "Chest Color",
        description: "The color to use for chests.",
        category: "Waypoints",
        subcategory: "Colors",
        value: [0, 255, 0, 255],
    })

    .addColorPicker({
        configName: "witherColor",
        title: "Wither Essence Color",
        description: "The color to use for the wither essence.",
        category: "Waypoints",
        subcategory: "Colors",
        value: [255, 0, 255, 255],
    })

    .addColorPicker({
        configName: "itemColor",
        title: "Item Color",
        description: "The color to use for items.",
        category: "Waypoints",
        subcategory: "Colors",
        value: [0, 0, 255, 255],
    })

    .addColorPicker({
        configName: "batColor",
        title: "Bat Color",
        description: "The color to use for bats.",
        category: "Waypoints",
        subcategory: "Colors",
        value: [0, 255, 0, 255],
    })

    .addColorPicker({
        configName: "redstoneColor",
        title: "Redstone Key Color",
        description: "The color to use for the redstone keys.",
        category: "Waypoints",
        subcategory: "Colors",
        value: [255, 0, 0, 255],
    })

    //block overlay
    .addSwitch({
        category: "Msc.",
        configName: "overlayEnabled",
        title: "Render Block Overlay",
        description: "Highlights the block you are looking at",
        subcategory: "Block Overlay",
    })

    .addColorPicker({
        configName: "blockHighlightColor",
        title: "Block Highlight Color",
        description: "The color to highlight blocks",
        category: "Msc.",
        subcategory: "Block Overlay",
        value: [0, 255, 255, 255],

        shouldShow(data) {
            return data.overlayEnabled;
        },
    })

    .addSwitch({
        configName: "fillBlockOverlay",
        title: "Fill blocks",
        description: "Fills the blocks with the color",
        category: "Msc.",
        subcatagory: "Block Overlay",

        shouldShow(data) {
            return data.overlayEnabled;
        },
    })

    .addColorPicker({
        configName: "blockFillColor",
        title: "Block Fill Color",
        description: "The color to fill blocks",
        category: "Msc.",
        subcategory: "Block Overlay",
        value: [0, 255, 255, 30],

        shouldShow(data) {
            return data.overlayEnabled && data.fillBlockOverlay;
        },
    })

    .addSwitch({
        configName: "chromaHighlight",
        title: "Chroma overlay",
        description: "Makes the outline chroma",
        category: "Msc.",
        subcatagory: "Block Overlay",

        shouldShow(data) {
            return data.overlayEnabled;
        },
    })

    .addSwitch({
        configName: "oldChroma",
        title: "Old chroma overlay",
        description: "Makes the outline chroma but worse",
        category: "Msc.",
        subcatagory: "Block Overlay",

        shouldShow(data) {
            return data.overlayEnabled && data.chromaHighlight;
        },
    })

    .addSlider({
        configName: "chromaOverlaySpeed",
        title: "Chroma Speed",
        description: "The speed of the chroma effect",
        category: "Msc.",
        subcategory: "Block Overlay",
        options: [1, 10],
        value: 1,

        shouldShow(data) {
            return data.overlayEnabled && data.chromaHighlight;
        },
    })

    .addSlider({
        configName: "overlayLineWidth",
        title: "line width",
        description: "Line width for the outline",
        category: "Msc.",
        subcategory: "Block Overlay",
        options: [1, 5],
        value: 3,

        shouldShow(data) {
            return data.overlayEnabled;
        },
    })

    //themeing
    .addSelection({
        category: "Theme",
        configName: "scheme",
        title: "Themes",
        description: "Select which theme you want from these presets (needs apply after)",
        options: ["Default", "Vigil", "nwjn"],
    })

    .addButton({
        category: "Theme",
        configName: "apply",
        title: "Apply Changes",
        description: "Need to click this for window to reload with selected changes",
        placeHolder: "Apply",
        onClick(config) {
            const currentScheme = schemes[config.settings.scheme];
            const scheme = JSON.parse(FileLib.read("eclipseAddons", currentScheme));
            scheme.Amaterasu.background.color = config.settings.bgColor;

            FileLib.write("eclipseAddons", currentScheme, JSON.stringify(scheme, null, 4));

            config.setPos(config.settings.x, config.settings.y).setSize(config.settings.width, config.settings.height).setScheme(currentScheme).apply();
        },
    })

    .addColorPicker({
        category: "Theme",
        configName: "bgColor",
        title: "Change Background Color",
        description: "Changes the color and alpha of the background",
        value: [0, 0, 0, 80],
    })

    .addSlider({
        category: "Theme",
        configName: "x",
        title: "Change X",
        description: "Changes the starting X coordinate of the Config (in percent)",
        options: [0, 75],
        value: 20,
    })

    .addSlider({
        category: "Theme",
        configName: "y",
        title: "Change Y",
        description: "Changes the starting Y coordinate of the Config (in percent)",
        options: [0, 75],
        value: 20,
    })

    .addSlider({
        category: "Theme",
        configName: "width",
        title: "Change Width",
        description: "Changes the width of the Config (in percent)",
        options: [25, 100],
        value: 60,
    })

    .addSlider({
        category: "Theme",
        configName: "height",
        title: "Change Height",
        description: "Changes the height of the Config (in percent)",
        options: [25, 100],
        value: 60,
    });

const config = new Settings("eclipseAddons", defaultConf, "data/ColorScheme.json").addMarkdown("Changelog", CHANGELOG).addMarkdown("Credits", CREDITS);

const currentScheme = schemes[config.settings.scheme];
const scheme = JSON.parse(FileLib.read("eclipseAddons", currentScheme));
scheme.Amaterasu.background.color = config.settings.bgColor;

FileLib.write("eclipseAddons", currentScheme, JSON.stringify(scheme, null, 4));

config.setPos(config.settings.x, config.settings.y).setSize(config.settings.width, config.settings.height).setScheme(currentScheme).apply();

export default () => config.settings;
