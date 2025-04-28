import { FeatManager } from "../utils/helpers";
import { hud } from "../utils/hud";
import DungeonScanner from "../../tska/skyblock/dungeon/DungeonScanner";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { getCheckmarks } from "../utils/mapUtils";
import { mapRGBs } from "../utils/mapUtils";

const BufferedImage = Java.type("java.awt.image.BufferedImage");
const Color = Java.type("java.awt.Color");

/*  ---------------- StellarNav -----------------

    Dungeon Map

    ------------------- To Do -------------------

    - Make the  map

    --------------------------------------------- */

//variables
const cachedPlayerHeads = new Map(); // ["UnclaimedBloom6": HEAD_IMAGE]

let mapBuffered = new BufferedImage(23, 23, BufferedImage.TYPE_4BYTE_ABGR);
let mapImage = new Image(mapBuffered);
let mapIsEmpty = true;

//functions
const setPixels = (x1, y1, width, height, color) => {
    if (!color) return;
    for (let x = x1; x < x1 + width; x++) for (let y = y1; y < y1 + height; y++) mapBuffered.setRGB(x, y, color.getRGB());
};

const clearMap = () => {
    setPixels(0, 0, 23, 23, new Color(0, 0, 0, 0));
};

//feature
const StellaNav = FeatManager.createFeature("mapEnabled", "catacombs");

//gui
const MapGui = hud.createHud("StellaNav", 10, 10, 150, 150);

MapGui.onDraw((x, y) => {
    Renderer.translate(x, y);
    Renderer.scale(MapGui.getScale());
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), 0, 0, 150, 150);
    Renderer.finishDraw();
});

StellaNav.register("renderOverlay", () => {
    if (hud.isOpen()) return;

    Renderer.translate(MapGui.getX(), MapGui.getY());
    Renderer.scale(MapGui.getScale());
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), 0, 0, 150, 150);
    Renderer.drawImage(mapImage, 0, 0, 128, 128);
    //Renderer.drawRect(Renderer.color(0, 0, 0), x3, y3, x4, y4);
    Renderer.finishDraw();
});

//get dungeon stuff
StellaNav.register(
    "stepFps",
    () => {
        //if (!Dungeon.inDungeon || !Config.enabled) return;
        if (!Dungeon.mapData) return;

        const colors = Dungeon.mapData./* colors */ field_76198_e;
        if (!colors) return;

        clearMap();
        const checkmarkImages = getCheckmarks();
        const tempCheckmarkMap = new Map();
        // Find important points on the map and build a new one
        let xx = -1;
        for (let x = Dungeon.mapCorner[0] + Dungeon.mapRoomSize / 2; x < 118; x += Dungeon.mapGapSize / 2) {
            let yy = -1;
            xx++;
            for (let y = Dungeon.mapCorner[1] + Dungeon.mapRoomSize / 2 + 1; y < 118; y += Dungeon.mapGapSize / 2) {
                yy++;
                let i = x + y * 128;
                if (colors[i] == 0) continue;
                let center = colors[i - 1]; // Pixel where the checkmarks spawn
                let roomColor = colors[i + 5 + 128 * 4]; // Pixel in the borrom right-ish corner of the room which tells the room color.
                // Main room
                if (!(xx % 2) && !(yy % 2)) {
                    let rmx = xx / 2;
                    let rmy = yy / 2;
                    let roomIndex = rmx * 6 + rmy;
                    setPixels(xx * 2, yy * 2, 3, 3, mapRGBs[roomColor]);
                    // Checkmarks and stuff
                    if (roomColor == 18 && Dungeon.watcherCleared && Config.whiteCheckBlood) {
                        tempCheckmarkMap.set(roomIndex, checkmarkImages[34]); // White checkmark
                    }
                    if (center in checkmarkImages && roomColor !== center) {
                        tempCheckmarkMap.set(roomIndex, checkmarkImages[center]);
                        if (roomColor == 66) {
                            let p = Object.keys(puzzles).find((key) => puzzles[key].pos[0] == rmx && puzzles[key].pos[1] == rmy);
                            if (p) puzzles[p].check = puzzleStatusColors[center];
                        }
                    }
                    // Puzzles
                    if (roomColor == 66 && !Object.keys(puzzles).some((a) => puzzles[a].pos[0] == rmx && puzzles[a].pos[1] == rmy) && !unassignedPuzzles.some((a) => a[0] == rmx && a[1] == rmy)) {
                        unassignedPuzzles.push([rmx, rmy]);
                    }
                    // Trap
                    if (roomColor == 62) trapPos = [rmx, rmy];
                    continue;
                }
                // Center of 2x2
                if (xx % 2 && yy % 2) {
                    setPixels(xx * 2 + 1, yy * 2 + 1, 1, 1, mapRGBs[center]);
                    continue;
                }

                // Place where no doors or rooms can spawn
                if ((!(xx % 2) && !(yy % 2)) || (xx % 2 && yy % 2)) continue;

                let horiz = [colors[i - 128 - 4], colors[i - 128 + 4]];
                let vert = [colors[i - 128 * 5], colors[i + 128 * 3]];
                // Door
                if (horiz.every((a) => !a) || vert.every((a) => !a)) {
                    if (center == 119) setPixels(xx * 2 + 1, yy * 2 + 1, 1, 1, Config.witherDoorColor);
                    else if (center == 63) setPixels(xx * 2 + 1, yy * 2 + 1, 1, 1, new Color(92 / 255, 52 / 255, 14 / 255, 1));
                    else setPixels(xx * 2 + 1, yy * 2 + 1, 1, 1, mapRGBs[center]);
                    continue;
                }
                // Join for a larger room
                if (horiz.every((a) => !!a) && vert.every((a) => !!a)) {
                    setPixels(xx * 2, yy * 2, 3, 3, mapRGBs[center]);
                    continue;
                }
            }
        }
        mapImage = new Image(mapBuffered);
        mapIsEmpty = false;

        // Update the checkmark map now. Clearing it at the start of the function makes the checkmarks flicker.
        checkmarkMap.forEach((img, ind) => {
            if (!tempCheckmarkMap.has(ind)) checkmarkMap.delete(ind);
        });
        tempCheckmarkMap.forEach((img, ind) => {
            checkmarkMap.set(ind, img);
        });
    },
    5
);

register("command", (...args) => {
    if (args[0] === "next");
    else if (args[0] === "debug") {
        roomMap.forEach((room) => {
            ChatLib.chat(`&7Room: &b${room.name}`);
        });
    } else {
        ChatLib.chat("&cUnknown command. &7Try &6/stellanav help &7for a list of commands");
    }
}).setName("stellanav");
