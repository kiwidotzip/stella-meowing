import DefaultConfig from "../../Amaterasu/core/DefaultConfig"
import Settings from "../../Amaterasu/core/Settings"

/*  ------------------- Config ------------------

    Core Config

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//setup

const schemes = ["data/ColorScheme.json", "data/scheme-vigil.json", "data/scheme-nwjn.json"]

//markdown stuff
const version = JSON.parse(FileLib.read("eclipseAddons", "metadata.json")).version

const CREDITS = FileLib.read("eclipseAddons", "assets/credits.md")
const CHANGELOG = `# §bEclipse Addonss v${version}\n ${FileLib.read("eclipseAddons", "assets/changelog.md")}`

//config

const config = new DefaultConfig("Eclipse Addons", "data/settings.json")

//general
.addTextParagraph({
    category: "General",
    configName: "Info",
    title: `&6&l&nEclipse Addons`,
    description: "&bMade by NEXD_",
    centered: true,
    subcategory: ""
})

//Secret routes

//general options
.addSwitch({
    configName: "modEnabled",
    title: "Render Roughts",
    description: "Main toggle",
    category: "Routes",
    subcatagory: "General",
    value: true
})

.addSwitch({
    configName: "boxSecrets",
    title: "Box Secrets",
    description: "wether or not to box secrets",
    category: "Routes",
    subcatagory: "General",
    value: true
})

.addSwitch({
    configName: "showText",
    title: "ShowText",
    description: "wether or not to show text",
    category: "Routes",
    subcatagory: "General",
    value: true
})

//keybinds

.addKeybind({
    category: "Routes",
    subcategory: "Keybinds",
    configName: "nextStep",
    title: "Next Step",
    description: "Goes to the next step",
    value: 221
})

.addKeybind({
    category: "Routes",
    subcategory: "Keybinds",
    configName: "lastStep",
    title: "Last Step",
    description: "Goes back to the last step",
    value: 219
})

.addKeybind({
    category: "Routes",
    subcategory: "Keybinds",
    configName: "resetStep",
    title: "Reset",
    description: "Resets the route",
    value: 220
})


//line stuff
.addDropDown({
    configName: "lineType",
    title: "Line Type",
    description: "Type of secret line",
    category: "Routes",
    subcategory: "Line",
    options: ["Fire Particles", "Lines",],
    value: 0
})

.addSlider({
    configName: "lineWidth",
    title: "Line width",
    description: "Line width (not for particles)",
    category: "Routes",
    subcategory: "Line",
    options: [1, 5],
    value: 2
})

.addColorPicker({
    configName: "lineColor",
    title: "Line Color",
    description: "The color to use for the line.",
    category: "Routes",
    subcategory: "Line",
    value: [255, 0, 0, 255]
})

//boxcolors
.addColorPicker({
    configName: "warpColor",
    title: "Etherwarp Color",
    description: "The color to use for the etherwarps.",
    category: "Routes",
    subcategory: "Colors",
    value: [0, 0, 255, 255]
})

.addColorPicker({
    configName: "mineColor",
    title: "Stonk Color",
    description: "The color to use for the ghost blocks.",
    category: "Routes",
    subcategory: "Colors",
    value: [255, 0, 255, 255]
})

.addColorPicker({
    configName: "tntColor",
    title: "Superboom Color",
    description: "The color to use for the Superbooms.",
    category: "Routes",
    subcategory: "Colors",
    value: [255, 0, 0, 255]
})

.addColorPicker({
    configName: "clickColor",
    title: "Lever Color",
    description: "The color to use for levers and other interactions.",
    category: "Routes",
    subcategory: "Colors",
    value: [255, 255, 0, 255]
})

.addColorPicker({
    configName: "secretColor",
    title: "Secret Color",
    description: "The color to use for Secrets.",
    category: "Routes",
    subcategory: "Colors",
    value: [0, 255, 0, 255]
})

//Secret waypoints

//general
.addSwitch({
    configName: "secretWaypoints",
    title: "Secret Waypoints",
    description: "Displays secret waypoints",
    category: "Secret Waypoints",
    subcatagory: "General"
})

.addSwitch({
    configName: "boxWSecrets",
    title: "Box Secrets",
    description: "wether or not to box secrets",
    category: "Secret Waypoints",
    subcatagory: "General",
    value: true
})

.addSwitch({
    configName: "showWText",
    title: "ShowText",
    description: "wether or not to show text",
    category: "Secret Waypoints",
    subcatagory: "General",
    value: true
})

//colors

.addColorPicker({
    configName: "chestColor",
    title: "Chest Color",
    description: "The color to use for chests.",
    category: "Secret Waypoints",
    subcategory: "Colors",
    value: [0, 255, 0, 255]
})

.addColorPicker({
    configName: "witherColor",
    title: "Wither Essence Color",
    description: "The color to use for the wither essence.",
    category: "Secret Waypoints",
    subcategory: "Colors",
    value: [255, 0, 255, 255]
})

.addColorPicker({
    configName: "itemColor",
    title: "Item Color",
    description: "The color to use for items.",
    category: "Secret Waypoints",
    subcategory: "Colors",
    value: [0, 0, 255, 255]
})

.addColorPicker({
    configName: "batColor",
    title: "Bat Color",
    description: "The color to use for bats.",
    category: "Secret Waypoints",
    subcategory: "Colors",
    value: [0, 255, 0, 255]
})

.addColorPicker({
    configName: "redstoneColor",
    title: "Redstone Key Color",
    description: "The color to use for the redstone keys.",
    category: "Secret Waypoints",
    subcategory: "Colors",
    value: [255, 0, 0, 255]
})

//theming

.addSelection({
    category: "GUI",
    configName: "scheme",
    title: "Change My Scheme!",
    description: "Select which scheme you want from these presets (needs apply after)",
    options: ["Default", "Vigil", "nwjn"]
})

.addButton({
    category: "GUI",
    configName: "apply",
    title: "Apply Changes",
    description: "Need to click this for window to reload with selected changes",
    onClick(config) {
        // Change the scheme path depending on the value of the [Selector] config
        const currentScheme = schemes[config.settings.scheme]
        const scheme = JSON.parse(FileLib.read("eclipseAddons", currentScheme))
        // Setting the alpha
        scheme.Amaterasu.background.color = config.settings.bgColor

        // Now we save the [currentScheme] with the [alpha] set in the [Slider]
        FileLib.write("eclipseAddons", currentScheme, JSON.stringify(scheme, null, 4))

        // Now we set the new position, size and colorScheme for our [ConfigGui]
        config
            .setPos(config.settings.x, config.settings.y)
            .setSize(config.settings.width, config.settings.height)
            .setScheme(currentScheme)
            .apply()
    }
})

.addColorPicker({
    category: "GUI",
    configName: "bgColor",
    title: "Change Background Color",
    description: "Changes the color and alpha of the background",
    value: [0, 0, 0, 80]
})

.addSlider({
    category: "GUI",
    configName: "x",
    title: "Change X",
    description: "Changes the starting X coordinate of the GUI (in percent)",
    options: [0, 75],
    value: 20
})

.addSlider({
    category: "GUI",
    configName: "y",
    title: "Change Y",
    description: "Changes the starting Y coordinate of the GUI (in percent)",
    options: [0, 75],
    value: 20
})

.addSlider({
    category: "GUI",
    configName: "width",
    title: "Change Width",
    description: "Changes the width of the GUI (in percent)",
    options: [25, 100],
    value: 60
})

.addSlider({
    category: "GUI",
    configName: "height",
    title: "Change Height",
    description: "Changes the height of the GUI (in percent)",
    options: [25, 100],
    value: 60
})

const setting = new Settings("Eclipse Addons", config, "data/ColorScheme.json")

.addMarkdown("Credits", CREDITS)
.addMarkdown("Changelog", CHANGELOG)


export default () => setting.settings