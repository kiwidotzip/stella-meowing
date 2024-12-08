import DefaultConfig from "../../Amaterasu/core/DefaultConfig"
import Settings from "../../Amaterasu/core/Settings"

const config = new DefaultConfig("eclipseAddons", "data/settings.json")
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

const setting = new Settings("eclipseAddons", config, "data/ColorScheme.json")

.setCommand("sr")

export default () => setting.settings