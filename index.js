import settings from "./utils/config";
import request from "../requestV2";
import "./features/firstInstall";
import "./features/blockOverlay";
import "./features/terms";
import "./features/secrets";
import "./features/routes";
import "./features/dungeon";

/*  ------------------- Index -------------------

    Core File    
    I tried to doccument how it works as best as I could

    ------------------- To Do -------------------

    - finish routes stuff
    - add profit calculator

    --------------------------------------------- */

//commands

register("command", (...args) => {
    if (args[0] === "help") {
        ChatLib.chat("&8&m-------------------------------------------------");
        ChatLib.chat("&6/stella &7main command! Aliases: &6/sa /sta");
        ChatLib.chat("&6/sa help &7Opens the Eclipse Addons help menu!");
        ChatLib.chat("&6/srdb &7 debug options for routes try &6/srdb help &7for more info!");
        ChatLib.chat("&6/route &7 route recording try &6/route help &7for more info!");
        ChatLib.chat("&8&m-------------------------------------------------");
    } else if (!args || !args.length || !args[0]) {
        return settings().getConfig().openGui();
    } else {
        ChatLib.chat("&cUnknown command. &7Try &6/sa help &7for a list of commands");
    }
})
    .setName("stella")
    .setAliases("sa", "sta");

const VERSION = JSON.parse(FileLib.read("stella", "metadata.json")).version;
const API_URL = "https://api.github.com/repos/Eclipse-5214/stella/releases";

function checkUpdate() {
    request({
        url: API_URL,
        headers: { "User-Agent": "MeowAddons" },
        json: true,
    })
        .then(function (response) {
            if (!response.length) {
                ChatLib.chat("&d[Stella] &bNo releases found!");
                return;
            }

            ChatLib.chat(`&d[Stella] &bChecking for updates...`);
            const latest = response[0];
            const remoteVersion = latest.tag_name.replace(/^v/, "");
            const localVersion = VERSION.replace(/^v/, "");

            if (localVersion > remoteVersion) {
                ChatLib.chat("&d[Stella] &bYou're running a development build that is newer than the latest release!");
            } else if (localVersion < remoteVersion) {
                ChatLib.chat(`&d[Stella] &bUpdate available: &6v${remoteVersion}&b! Current: &6v${localVersion}`);
                ChatLib.chat(new TextComponent(`&d[Stella] &bClick here to go to the Github release page!`).setClick("open_url", `https://github.com/Eclipse-5214/stella/releases/latest`));
            } else {
                ChatLib.chat("&d[Stella] &bYou're running the latest version!");
            }
        })
        .catch(function (error) {
            ChatLib.chat(`&d[Stella] &bUpdate check failed: ${error}`);
        });
}

let UpdateChecked = false;

register("worldLoad", () => {
    if (!UpdateChecked) {
        UpdateChecked = true;
        Client.scheduleTask(1000, () => {
            checkUpdate();
        });
    }
});

register("gameLoad", () => {
    UpdateChecked = false;
});

register("command", () => {
    checkUpdate();
}).setName("meowupdate");
