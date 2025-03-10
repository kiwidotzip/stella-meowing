import { renderBoxOutline, renderFilledBox } from "../utils/bloomRenderUtils";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { drawString, calcDistance } from "../utils/utils";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import settings from "../utils/config";

/*  -------------- Terminal Things ---------------

    Numbers the terminals in dungeon
    (for calling terms)

    terminal tracker

    ------------------- To Do -------------------

    - Make bloom's code work

    --------------------------------------------- */

// [X, Y, Z, #, Class, M7]
const terms = JSON.parse(FileLib.read("stella", "data/dungeons/terms.json"));

//Thanks Kiwidotzip!
const termLabels = {
    T: ["&7( &6Tank &7)", [1, 170 / 255, 0]],
    M: ["&7( &bMage &7)", [85 / 255, 1, 1]],
    B: ["&7( &cBers &7)", [1, 85 / 255, 85 / 255]],
    A: ["&7( &2Arch &7)", [0, 170 / 255, 0]],
    S: ["&7( &6S&bt&ca&2c&dk &7)", [1, 1, 1]],
    1: "T",
    2: "M",
    3: "B",
    4: "A",
    5: 5,
};

registerWhen(
    register("renderWorld", () => {
        if (!Dungeon.inDungeon || Dungeon.floor !== "F7" || !Dungeon.bossEntry) return;

        let [r, g, b] = [settings().termColor[0] / 255, settings().termColor[1] / 255, settings().termColor[2] / 255];
        let playerPos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1];
        let t = settings().termNumber + 1;

        if (settings().m7Roles) t = termLabels[settings().termClass + 1];

        Object.entries(terms).forEach(([phase, data]) => {
            data.forEach((term) => {
                let [x, y, z, n, c, m7] = term;
                let text = "";

                if ((settings().m7Roles && m7 !== "S") || (!settings().m7Roles && c !== "S")) {
                    if (t !== n && t !== m7 && t !== 5) return;
                }

                if (!settings().hideNumber || !settings().showTermClass) text += "&l&8[ &f" + n.toString() + " &8]";

                if (settings().showTermClass) {
                    if (!settings().m7Roles) text += "\n" + termLabels[c][0];
                    else text += "\n" + termLabels[m7][0];
                }

                if (settings().classColor) {
                    if (!settings().m7Roles) [r, g, b] = termLabels[c][1];
                    else [r, g, b] = termLabels[m7][1];
                }

                let pdistance = calcDistance(playerPos, [x, y, z]);

                if (pdistance < 2500) {
                    if (pdistance > 16) drawString(text, x + 0.5, y + 1.75, z + 0.5, 0xffffff, false, 2, true);
                    else drawString(text, x + 0.5, y + 1.75, z + 0.5, 0xffffff, false, 0.03, false);

                    if (settings().highlightTerms) {
                        renderBoxOutline(x + 0.501, y - 0.001, z + 0.501, 1.002, 1.002, 1.002, r, g, b, 1, 1, false);
                        renderFilledBox(x + 0.501, y - 0.001, z + 0.501, 1.002, 1.002, 1.002, r, g, b, 50 / 255, false);
                    }
                }
            });
        });
    }),
    () => settings().termNumbers
);

//terminal tracker
const completed = new Map();

//reset
register("chat", () => {
    completed.clear();
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?");

//add compleated stuff
register("chat", (name, type) => {
    if (!settings().termTracker) return;
    if (name.includes(">")) return;

    let data = completed.get(name) || { terminal: 0, device: 0, lever: 0 };
    data[type]++;
    completed.set(name, data);
}).setCriteria(/^(\w{1,16}) (?:activated|completed) a (\w+)! \(\d\/\d\)$/);

//Print to chat
register("chat", () => {
    if (!settings().termTracker) return;
    completed.forEach((data, name) => {
        ChatLib.chat("&b[SA] &d" + name + " &7completed &f" + data.terminal + "&7 terms, &f" + data.device + "&7 devices, and &f" + data.lever + " &7levers!");
    });
}).setCriteria("The Core entrance is opening!");

//Reset on world unload
register("worldUnload", () => {
    completed.clear();
});
