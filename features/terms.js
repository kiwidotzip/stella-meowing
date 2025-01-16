import { drawString, calcDistance } from "../utils/utils";
import { inDungeon, getFloor } from "../utils/dutils";
import settings from "../utils/config";

/*  -------------- Terminal Things ---------------

    Numbers the terminals in dungeon
    (for calling terms)

    terminal tracker

    ------------------- To Do -------------------

    - Make bloom's code work

    --------------------------------------------- */

const terms = JSON.parse(FileLib.read("eclipseAddons", "data/dungeons/termwaypoints.json"));

register("renderWorld", () => {
    if (!settings().termNumbers) return;
    if (getFloor() !== "F7") return;
    if (!inDungeon()) return;

    //Thanks Kiwidotzip!
    const termLabels = {
        1: "Tank",
        2: "Mage",
        3: "Berserk",
        4: "Archer",
    };

    let playerPos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1];
    let term = settings().termNumber + 1;

    Object.entries(terms).forEach(([number, parts]) => {
        if (number == term || term == 5) {
            parts.forEach((pos) => {
                let [x, y, z] = pos;

                let pdistance = calcDistance(playerPos, pos);
                if (pdistance < 50) {
                    if (termLabels[number]) {
                        if (settings().termClass) drawString(termLabels[number], x + 0.5, y + 2.5, z + 0.5, 0xffffff, true, 2, true);
                    }

                    drawString(number.toString(), x + 0.5, y + 1.5, z + 0.5, 0xffffff, true, 2, true);
                }
            });
        }
    });
});

//terminal tracker
const completed = new Map(); // "player": {terminal: 0, device: 0, lever: 0}

//reset
register("chat", () => {
    completed.clear();
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?");

//add compleated stuff
register("chat", (name, type) => {
    if (!settings().termTracker) return;
    if (name.includes(">")) return;

    let data = completed.get(name) || {
        terminal: 0,
        device: 0,
        lever: 0,
    };

    data[type]++;
    completed.set(name, data);
    //fix
    //SteijnZ completed a device! (5/7) (22.697s | 120.63s)
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
