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

const terms = {
    1: {
        p1: { Tank: [111, 113, 73] },
        p2: { Tank: [68, 109, 121] },
        p3: { Tank: [-3, 109, 112] },
        p4: { Tank: [41, 109, 29] },
    },

    2: {
        p1: { Tank: [111, 119, 79] },
        p2: { Mage: [59, 120, 122] },
        p3: { Mage: [19, 123, 93] },
        p4: { Mage: [44, 121, 29] },
    },

    3: {
        p1: { Mage: [89, 112, 92] },
        p2: { Bers: [47, 109, 121] },
        p3: { Bers: [-3, 119, 93] },
        p4: { Bers: [67, 109, 29] },
    },

    4: {
        p1: { Mage: [89, 122, 101] },
        p2: { Arch: [39, 108, 143] },
        p3: { Arch: [-3, 109, 77] },
        p4: { Arch: [72, 115, 48] },
    },
};

//Thanks Kiwidotzip!
const termLabels = {
    1: "&7( &6Tank &7)",
    2: "&7( &bMage &7)",
    3: "&7( &cBers &7)",
    4: "&7( &2Arch &7)",
};

const m7Labels = {
    Tank: "&7( &6Tank &7)",
    Mage: "&7( &bMage &7)",
    Bers: "&7( &cBers &7)",
    Arch: "&7( &2Arch &7)",
};

registerWhen(
    register("renderWorld", () => {
        if (Dungeon.floor !== "F7") return;
        if (!Dungeon.inDungeon) return;
        if (!Dungeon.bossEntry) return;

        let [r, g, b] = [settings().termColor[0] / 255, settings().termColor[1] / 255, settings().termColor[2] / 255];

        let playerPos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1];
        let term = settings().termNumber + 1;

        let termClass = settings().termClass;

        if (settings().m7Roles) term = 5;

        Object.entries(terms).forEach(([number, parts]) => {
            if (settings().m7Roles) {
                if (termClass == 0) termClass = "Tank";
                if (termClass == 1) termClass = "Mage";
                if (termClass == 2) termClass = "Bers";
                if (termClass == 3) termClass = "Arch";
            }

            if (number == term || term == 5) {
                Object.entries(parts).forEach(([sec, data]) => {
                    Object.entries(data).forEach(([mClass, pos]) => {
                        if (settings().m7Roles) {
                            if (mClass.toString() != termClass && termClass != 4) return;
                        }

                        let [x, y, z] = pos;

                        let text = "";

                        if (!settings().hideNumber) {
                            text = "&l&8[ &f" + number.toString() + " &8]";
                            if (m7Labels[mClass.toString()] && settings().m7Roles) text += "\n" + m7Labels[mClass.toString()];
                            else if (termLabels[number] && settings().showTermClass) text += "\n" + termLabels[number];
                        } else {
                            if (m7Labels[mClass.toString()] && settings().m7Roles) text = m7Labels[mClass.toString()];
                            else if (termLabels[number] && settings().showTermClass) text = termLabels[number];
                        }

                        if (settings().classColor) {
                            if (!settings().m7Roles) {
                                if (number == 1) [r, g, b] = [255 / 255, 170 / 255, 0];
                                if (number == 2) [r, g, b] = [85 / 255, 255 / 255, 255 / 255];
                                if (number == 3) [r, g, b] = [255 / 255, 85 / 255, 85 / 255];
                                if (number == 4) [r, g, b] = [0 / 255, 170 / 255, 0 / 255];
                            } else {
                                if (mClass.toString() == "Tank") [r, g, b] = [255 / 255, 170 / 255, 0];
                                if (mClass.toString() == "Mage") [r, g, b] = [85 / 255, 255 / 255, 255 / 255];
                                if (mClass.toString() == "Bers") [r, g, b] = [255 / 255, 85 / 255, 85 / 255];
                                if (mClass.toString() == "Arch") [r, g, b] = [0 / 255, 170 / 255, 0 / 255];
                            }
                        }

                        let pdistance = calcDistance(playerPos, pos);

                        if (pdistance < 50) {
                            if (pdistance > 3) drawString(text, x + 0.5, y + 1.75, z + 0.5, 0xffffff, false, 2, true);
                            else drawString(text, x + 0.5, y + 1.75, z + 0.5, 0xffffff, false, 0.03, false);

                            if (settings().highlightTerms) {
                                renderBoxOutline(x + 0.501, y - 0.001, z + 0.501, 1.002, 1.002, 1.002, r, g, b, 1, 1, false);
                                renderFilledBox(x + 0.501, y - 0.001, z + 0.501, 1.002, 1.002, 1.002, r, g, b, 50 / 255, false);
                            }
                        }
                    });
                });
            }
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
