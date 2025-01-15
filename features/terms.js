import { drawString, calcDistance, getTabList } from "../utils/utils";
import { inDungeon, getFloor } from "../utils/dutils";
import { onChatPacket } from "../utils/events";
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

register("tick", (ticks) => {
    if (ticks % 10) return;
    if (!inDungeon()) return this.reset();

    let tabList = getTabList(false);
    if (!tabList || tabList.length < 60) return;

    doPartyStuff(tabList);
});

const completed = new Map(); // "player": {terminal: 0, device: 0, lever: 0}

// Set everything to 0 when P3 starts
onChatPacket(() => {
    completed.clear();
    party.forEach((player) => {
        completed.set(player, { terminal: 0, device: 0, lever: 0 });
    });
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?");

// Listen for completed terms/devices/levers
onChatPacket((player, type) => {
    if (!settings().termTracker || !completed.has(player)) return;
    const data = completed.get(player);
    data[type]++;
}).setCriteria(/^(\w{1,16}) (?:activated|completed) a (\w+)! \(\d\/\d\)$/);

// Print the completed stuff to chat
register("chat", () => {
    if (!settings().termTracker) return;
    //completed.forEach((data, player) => {
    //let formatted = player;
    //ChatLib.chat(`${formatted} &8| &6${data.terminal} &aTerminals &8| &6${data.device} &aDevices &8| &6${data.lever} &aLevers`);
    ChatLib.chat("allz");
    //});
}).setCriteria("The Core entrance is opening!");

register("worldUnload", () => {
    completed.clear();
});

registerChat();
