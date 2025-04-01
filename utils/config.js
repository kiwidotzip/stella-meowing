import Settings from "../../Amaterasu/core/Settings";
import DefaultConfig from "../../Amaterasu/core/DefaultConfig";

/*  ------------------- Config ------------------

    Core Config

    ------------------- To Do -------------------

    - Make theming work

    --------------------------------------------- */

//setup

//markdown stuff
const version = JSON.parse(FileLib.read("stella", "metadata.json")).version;

const CREDITS = FileLib.read("stella", "assets/credits.md");
const CHANGELOG = `# §dStella v${version}\n ${FileLib.read("stella", "assets/changelog.md")}`;

const schemes = ["data/ColorScheme.json", "data/scheme-vigil.json", "data/scheme-nwjn.json"];

//guis
export const roomName = new Gui();

//config
const defaultConf = new DefaultConfig("stella", "data/settings.json")

    //general
    .addTextParagraph({
        category: "General",
        configName: "Info",
        title: `&6&l&dStella`,
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
        tags: ["github"],
        onClick(setting) {
            ChatLib.command("ct copy https://github.com/Eclipse-5214/stella", true);
            ChatLib.chat("&6Copied Discord Link!");
        },
    })

    .addButton({
        category: "General",
        subcategory: "",
        configName: "OpenSR",
        title: "Routes",
        description: "Open Stella Routes config (if installed)",
        //tags: ["discord"],
        onClick(setting) {
            ChatLib.command("stellaroutes", true);
        },
    })

    .addButton({
        category: "General",
        subcategory: "",
        configName: "InstallsrSR",
        title: "Install Stella Routes",
        description: "Installs the Stella Routes addon (if not installed)",
        //tags: ["discord"],
        onClick(setting) {
            ChatLib.command("ct import stellaRoutes", true);
        },
    })

    //dungoens

    //dugeon trash
    .addSwitch({
        category: "Dungeons",
        configName: "highlightTrash",
        title: "Highlight Dungeon trash",
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
        configName: "highlightTerms",
        title: "Highlight Terms",
        description: "Highlihgts the terminals",
        subcategory: "Terminals",

        shouldShow(data) {
            return data.termNumbers;
        },
    })

    .addColorPicker({
        configName: "termColor",
        title: "Highlight Color",
        description: "The color to highlight the terminals",
        category: "Dungeons",
        subcategory: "Terminals",
        value: [0, 255, 255, 255],

        shouldShow(data) {
            return data.termNumbers && data.highlightTerms;
        },
    })

    .addSwitch({
        category: "Dungeons",
        configName: "showTermClass",
        title: "Show Class",
        description: "Displays related class",
        subcategory: "Terminals",

        shouldShow(data) {
            return data.termNumbers;
        },
    })

    .addSwitch({
        category: "Dungeons",
        configName: "classColor",
        title: "Highlight class Color",
        description: "Highlights the terminals the color of the class",
        subcategory: "Terminals",

        shouldShow(data) {
            return data.termNumbers && data.highlightTerms && data.showTermClass;
        },
    })

    .addSwitch({
        category: "Dungeons",
        configName: "hideNumber",
        title: "Hide number",
        description: "Hides the terminal number",
        subcategory: "Terminals",

        shouldShow(data) {
            return data.termNumbers && data.showTermClass;
        },
    })

    .addSwitch({
        category: "Dungeons",
        configName: "m7Roles",
        title: "M7 roles",
        description: "Displays m7 roles instead",
        subcategory: "Terminals",

        shouldShow(data) {
            return data.termNumbers && data.showTermClass;
        },
    })

    .addDropDown({
        configName: "termClass",
        title: "M7 Class",
        description: "What class you are playing",
        category: "Dungeons",
        subcategory: "Terminals",
        options: ["Tank", "Mage", "Bers", "Arch", "All"],
        value: 4,

        shouldShow(data) {
            return data.termNumbers && data.showTermClass && data.m7Roles;
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
            const scheme = JSON.parse(FileLib.read("stella", currentScheme));
            scheme.Amaterasu.background.color = config.settings.bgColor;

            FileLib.write("stella", currentScheme, JSON.stringify(scheme, null, 4));

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

const config = new Settings("stella", defaultConf, "data/ColorScheme.json").addMarkdown("Changelog", CHANGELOG).addMarkdown("Credits", CREDITS);

const currentScheme = schemes[config.settings.scheme];
const scheme = JSON.parse(FileLib.read("stella", currentScheme));
scheme.Amaterasu.background.color = config.settings.bgColor;

FileLib.write("stella", currentScheme, JSON.stringify(scheme, null, 4));

config.setPos(config.settings.x, config.settings.y).setSize(config.settings.width, config.settings.height).setScheme(currentScheme).apply();

export default () => config.settings;
