import { drawString, calcDistance } from "../utils/utils";
import { inDungeon, getFloor } from "../utils/dutils";
//import Party from "../../BloomCore/Party"
//import Dungeon from "../../BloomCore/dungeons/Dungeon"
//import { onChatPacket } from "../../BloomCore/utils/Events"
import settings from "../utils/config";

/*  -------------- Terminal Things ---------------

    Numbers the terminals in dungeon
    (for calling terms)

    Blooms terminal tracker (WIP)

    ------------------- To Do -------------------

    - Make bloom's code work

    --------------------------------------------- */

const terms = JSON.parse(FileLib.read("eclipseAddons", "data/dungeons/termwaypoints.json"));

register("renderWorld", () => {
    if (!settings().termNumbers) return;
    if (getFloor() !== "F7") return;
    if (!inDungeon()) return;

    let playerPos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1];
    let term = settings().termNumber + 1;

    Object.entries(terms).forEach(([number, parts]) => {
        if (number === term || term === 5) {
            parts.forEach((pos) => {
                let [x, y, z] = pos;

                let pdistance = calcDistance(playerPos, pos);
                if (pdistance < 50) {
                    drawString(number.toString(), x + 0.5, y + 1.5, z + 0.5, 0xffffff, true, 2, true);
                }
            });
        }
    });
});

/*
const completed = new Map(); // "player": {terminal: 0, device: 0, lever: 0}

// Set everything to 0 when P3 starts
onChatPacket(() => {
    completed.clear();
    Dungeon.party.forEach((player) => {
        completed.set(player, { terminal: 0, device: 0, lever: 0 });
    });
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?");

// Listen for completed terms/devices/levers
onChatPacket((player, type) => {
    if (!Config.terminalTracker || !completed.has(player)) return;
    const data = completed.get(player);
    data[type]++;
}).setCriteria(/^(\w{1,16}) (?:activated|completed) a (\w+)! \(\d\/\d\)$/);

// Print the completed stuff to chat
register("chat", () => {
    if (!Config.terminalTracker) return;
    completed.forEach((data, player) => {
        let formatted = player;
        if (Object.keys(Party.members).includes(player)) formatted = Party.members[player];
        ChatLib.chat(`${formatted} &8| &6${data.terminal} &aTerminals &8| &6${data.device} &aDevices &8| &6${data.lever} &aLevers`);
    });
}).setCriteria("The Core entrance is opening!");

register("worldUnload", () => {
    completed.clear();
});
*/
