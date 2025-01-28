import { getRoomData, getRealCoord } from "../../roomsAPI/utils/utils";
import { registerWhen } from "../../BloomCore/utils/Utils";
import { drawBoxAtBlock } from "../utils/renderUtils";
import { drawString } from "../utils/utils";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import settings from "../utils/config";

/*  ------------- Secret Waypoints --------------

    Draws goofy waypoints at secrets

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//variables
let lastRoomId = null;
let secretsData = null;

//gets current room data
registerWhen(
    register("step", () => {
        if (settings().secretWaypoints) {
            let roomId = getRoomData();

            if (!roomId) return;

            if (lastRoomId !== roomId) {
                lastRoomId = roomId;

                secretsData = getRoomData();
            }
        }
    }).setFps(5),
    () => settings().secretWaypoints
);

//desplays waypoints
registerWhen(
    register("renderWorld", () => {
        if (!Dungeon.inDungeon) return;
        if (Dungeon.bossEntry) return;
        if (!secretsData) return;
        if (!secretsData.secret_coords) return;

        Object.entries(secretsData.secret_coords).forEach(([type, secrets]) => {
            secrets.forEach((pos) => {
                const secretPos = getRealCoord(pos);

                if (!secretPos) return;
                let [x, y, z] = secretPos;

                if (settings().showWText) drawString(type, x + 0.5, y + 1.5, z + 0.5, 0xffffff, true, 0.03, false);

                if (settings().boxWSecrets) {
                    if (type == "chest") {
                        let [r, g, b] = [settings().chestColor[0] / 255, settings().chestColor[1] / 255, settings().chestColor[2] / 255];
                        drawBoxAtBlock(x + 0.0625, y, z + 0.0625, r, g, b, 0.875, 0.875);
                    }
                    if (type == "item") {
                        let [r, g, b] = [settings().itemColor[0] / 255, settings().itemColor[1] / 255, settings().itemColor[2] / 255];
                        drawBoxAtBlock(x + 0.25, y, z + 0.25, r, g, b, 0.5, 0.5);
                    }
                    if (type == "wither") {
                        let [r, g, b] = [settings().witherColor[0] / 255, settings().witherColor[1] / 255, settings().witherColor[2] / 255];
                        drawBoxAtBlock(x + 0.25, y, z + 0.25, r, g, b, 0.5, 0.5);
                    }
                    if (type == "bat") {
                        let [r, g, b] = [settings().batColor[0] / 255, settings().batColor[1] / 255, settings().batColor[2] / 255];
                        drawBoxAtBlock(x + 0.25, y + 0.25, z + 0.25, r, g, b, 0.5, 0.5);
                    }
                    if (type == "redstone_key") {
                        let [r, g, b] = [settings().redstoneColor[0] / 255, settings().redstoneColor[1] / 255, settings().redstoneColor[2] / 255];
                        drawBoxAtBlock(x + 0.25, y, z + 0.25, r, g, b, 0.5, 0.5);
                    }
                }
            });
        });
    }),
    () => settings().secretWaypoints
);
