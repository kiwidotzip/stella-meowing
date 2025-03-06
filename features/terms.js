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
const terms = {
    p1: [
        [111, 113, 73, 1, "T", "T"],
        [111, 119, 79, 2, "M", "T"],
        [89, 112, 92, 3, "B", "M"],
        [89, 122, 101, 4, "A", "M"],
    ],

    p2: [
        [68, 109, 121, 1, "T", "T"],
        [59, 120, 122, 2, "M", "M"],
        [47, 109, 121, 3, "B", "S"],
        [39, 108, 143, 4, "A", "A"],
        [40, 124, 122, 5, "S", "B"],
    ],

    p3: [
        [-3, 109, 112, 1, "T", "T"],
        [-3, 119, 93, 2, "M", "M"],
        [19, 123, 93, 3, "B", "B"],
        [-3, 109, 77, 4, "A", "A"],
    ],

    p4: [
        [41, 109, 29, 1, "T", "T"],
        [44, 121, 29, 2, "M", "M"],
        [67, 109, 29, 3, "B", "B"],
        [72, 115, 48, 4, "A", "A"],
    ],
};

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
        //if (!Dungeon.inDungeon || Dungeon.floor !== "F7" || !Dungeon.bossEntry) return;

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

                if (pdistance < 50) {
                    if (pdistance > 4) drawString(text, x + 0.5, y + 1.75, z + 0.5, 0xffffff, false, 2, true);
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
        ChatLib.chat("&b[EA] &d" + name + " &7completed &f" + data.terminal + "&7 terms, &f" + data.device + "&7 devices, and &f" + data.lever + " &7levers!");
    });
}).setCriteria("The Core entrance is opening!");

//Reset on world unload
register("worldUnload", () => {
    completed.clear();
});
