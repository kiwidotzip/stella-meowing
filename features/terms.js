import { drawString, calcDistance } from "../utils/utils";
import { inDungeon, getFloor } from "../utils/dutils";
import settings from "../utils/config";

/*  -------------- Terminal Things ---------------

    Numbers the terminals in dungeon
    (for calling terms)

    Blooms terminal tracker (WIP)

    ------------------- To Do -------------------

    - Make bloom's code work

    --------------------------------------------- */

const terms = JSON.parse(FileLib.read("eclipseAddons", "data/dungeons/termwaypoints.json"));

let party = new Set();

function doPartyStuff(tabList) {
    // Party and Classes
    const lines = Array(5)
        .fill()
        .map((_, i) => tabList[i * 4 + 1]);
    // Matches the name and class of every player in the party
    // [74] UnclaimedBloom6 (Mage XXXIX)
    const matches = lines.reduce((a, b) => {
        // https://regex101.com/r/cUzJoK/7
        const match = b.match(/^.?\[(\d+)\] (?:\[\w+\] )*(\w+) (?:.)*?\((\w+)(?: (\w+))*\)$/);
        if (!match) return a;
        let [_, sbLevel, player, dungeonClass, classLevel] = match;
        return a.concat([[player, dungeonClass, classLevel]]);
    }, []);

    party.clear();
    matches.forEach((a) => {
        let [player, dungeonClass, classLevel] = a;
        if (!["DEAD", "EMPTY"].includes(dungeonClass)) this.classes[player] = dungeonClass;
        party.add(player);
    });
}

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
                        drawString(termLabels[number], x + 0.5, y + 2.5, z + 0.5, 0xffffff, true, 2, true);
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
register("chat", (name, type, start, end) => {
    if (!settings().termTracker) return;
    if (name.includes(">")) return;

    let data = completed.get(name) || {
        terminal: 0,
        device: 0,
        lever: 0,
    };

    data[type]++;
    completed.set(name, data);
}).setCriteria("${name} activated a ${type}! (${start}/${end})");

//Print to chat
register("chat", () => {
    if (!settings().termTracker) return;
    completed.forEach((data, name) => {
        ChatLib.chat("&b[EA] &6" + name + " &7completed &f" + data.terminal + "&7 terms, &f" + data.device + "&7 devices, and &f" + data.lever + " &7levers!");
    });
}).setCriteria("The Core entrance is opening!");

//Reset on world unload
register("worldUnload", () => {
    completed.clear();
});
