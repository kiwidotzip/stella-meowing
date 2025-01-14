import { drawString, calcDistance, getScoreboard } from "../utils/utils";
import { drawBoxAtBlock } from "../utils/renderUtils";
import { inDungeon, getFloor } from "../utils/dutils";

/*  -------------- Terminal Numbers -------------

    Numbers the terminals in dungeon
    (for calling terms)

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

const terms = JSON.parse(FileLib.read("eclipseAddons", "data/dungeons/termwaypoints.json"));

register("renderWorld", () => {
    if (getFloor() !== "F7") return;
    if (!inDungeon()) return;

    let playerPos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1];

    Object.entries(terms).forEach(([number, parts]) => {
        parts.forEach((pos) => {
            let [x, y, z] = pos;

            let pdistance = calcDistance(playerPos, pos);
            if (pdistance < 50) {
                drawString(number.toString(), x + 0.5, y + 1.5, z + 0.5, 0xffffff, true, 2, true);
                drawBoxAtBlock(x, y, z, 1, 0, 1, 1, 1);
            }
        });
    });
});
