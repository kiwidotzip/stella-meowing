import { fetch } from "../tska/polyfill/Fetch";
import Location from "../tska/skyblock/Location";
import { LocalStore } from "../tska/storage/LocalStore";
import { hud } from "./utils/hud";
import settings from "./utils/config";

import "./utils/helpers";
import "./features/firstInstall";
import "./features/blockOverlay";
import "./features/terms";
import "./features/dungeon";
import "./features/map";

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
        ChatLib.chat("&6/sa help &7Opens the Stella help menu!");
        ChatLib.chat("&6/sa update &7Checks for updates!");
        ChatLib.chat("&6/sa hud &7Opens the HUD editor!");
        ChatLib.chat("&6/stellaroutes &routes config! (if installed) Aliases: &6/sr /str");
        ChatLib.chat("&6/srdb &7 debug options for routes try &6/srdb help &7for more info!");
        ChatLib.chat("&6/route &7 route recording try &6/route help &7for more info!");
        ChatLib.chat("&8&m-------------------------------------------------");
    } else if (args[0] === "update") {
        checkUpdate();
        updateMessage = `&9&m${ChatLib.getChatBreak("-")}\n`;
    } else if (args[0] === "hud") {
        hud.open();
    } else if (!args || !args.length || !args[0]) {
        return settings().getConfig().openGui();
    } else {
        ChatLib.chat("&cUnknown command. &7Try &6/sa help &7for a list of commands");
    }
})
    .setName("stella")
    .setAliases("sa", "sta");

const ud = new LocalStore(
    "stella",
    {
        version: "0.0.0",
    },
    "./data/stella.json"
);

const LOCAL_VERSION = JSON.parse(FileLib.read("stella", "metadata.json")).version.replace(/^v/, "");
const API_URL = "https://api.github.com/repos/Eclipse-5214/stella/releases";
let updateMessage = `&9&m${ChatLib.getChatBreak("-")}\n`;

function compareVersions(v1, v2) {
    const a = v1.split(".").map(Number),
        b = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if ((a[i] || 0) > (b[i] || 0)) return 1;
        if ((a[i] || 0) < (b[i] || 0)) return -1;
    }
    return 0;
}

function buildUpdateMessage(releases) {
    let message = `&9&m${ChatLib.getChatBreak("-")}\n`;
    message += `&b&lStella Changelog: \n&fChanges since &bv${LOCAL_VERSION}&e:\n`;
    releases
        .filter((release) => compareVersions(release.tag_name.replace(/^v/, ""), LOCAL_VERSION) > 0)
        .forEach((release) => {
            release.body.split("\n").forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine !== "" && !trimmedLine.includes("**Full Changelog**")) {
                    message += `&b${trimmedLine}\n`;
                }
            });
        });
    return message + `&9&m${ChatLib.getChatBreak("-")}`;
}

function checkUpdate(silent = false) {
    fetch(API_URL, {
        headers: { "User-Agent": "Stella" },
        json: true,
    })
        .then((releases) => {
            if (!releases.length && !silent) {
                ChatLib.chat("&d[Stella] &bNo releases found!");
                return;
            }

            const latestRelease = releases[0];
            const remoteVersion = latestRelease.tag_name.replace(/^v/, "");
            updateMessage = buildUpdateMessage(releases);

            if (!silent) ChatLib.chat("&d[Stella] &bChecking for updates...");

            if (compareVersions(LOCAL_VERSION, remoteVersion) > 0 && !silent) {
                ChatLib.chat("&d[Stella] &bYou're running a development build that is newer than the latest release!");
            } else if (compareVersions(LOCAL_VERSION, remoteVersion) < 0 && !silent) {
                ChatLib.chat(`&d[Stella] &bUpdate available: &6v${remoteVersion}&b! Current: &6v${LOCAL_VERSION}`);
                ChatLib.chat(new TextComponent(`&d[Stella] &bClick here to go to the Github release page!`).setClick("open_url", `https://github.com/Eclipse-5214/stella/releases/latest`)).setHoverValue(`&bOpens the release page - Github`);
                ChatLib.chat(new TextComponent(`&d[Stella] &bHover over this message to view changelogs!`).setHoverValue(updateMessage));
            } else if (!silent) {
                ChatLib.chat("&d[Stella] &bYou're running the latest version!");
            }
        })
        .catch((error) => {
            ChatLib.chat(`&d[Stella] &bUpdate check failed: ${error}`);
        });
}

let updateChecked = false;
register("worldLoad", () => {
    if (!updateChecked) {
        if (ud.version < LOCAL_VERSION) {
            checkUpdate(true);
            Client.scheduleTask(40, () => ChatLib.chat(updateMessage));
            ud.version = LOCAL_VERSION;
        }
        updateChecked = true;
        Client.scheduleTask(1000, () => {
            checkUpdate();
            updateMessage = `&9&m${ChatLib.getChatBreak("-")}\n`;
        });
    }
});

Location.onWorldChange((world) => {
    ChatLib.chat(`&d[Stella] &bWorld changed to: &6${world}`);
});

Location.onAreaChange((area) => {
    ChatLib.chat(`&d[Stella] &bArea changed to: &6${area}`);
});
