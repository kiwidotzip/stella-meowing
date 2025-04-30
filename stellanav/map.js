import { getCheckmarks, WhiteMarker, GreenMarker, mapRGBs, defaultMapImage, renderPlayerHeads } from "./utils/mapUtils";
import { FeatManager } from "../utils/helpers";
import { hud } from "../utils/hud";

import DungeonScanner from "../../tska/skyblock/dungeon/DungeonScanner";
import InternalEvents from "../../tska/event/InternalEvents";
import settings from "../utils/config";
import Dungeon from "../../tska/skyblock/dungeon/Dungeon";

const AbstractClientPlayer = Java.type("net.minecraft.client.entity.AbstractClientPlayer");
const BufferedImage = Java.type("java.awt.image.BufferedImage");
const Color = Java.type("java.awt.Color");

let PlayerComparator = Java.type("net.minecraft.client.gui.GuiPlayerTabOverlay").PlayerComparator;
let c = PlayerComparator.class.getDeclaredConstructor();
c.setAccessible(true);
let sorter = c.newInstance();

/*  ---------------- StellarNav -----------------

    Dungeon Map

    ------------------- To Do -------------------

    - Make the  map

    --------------------------------------------- */

//variables
const checkmarkMap = new Map(); // {dungeonIndex: int, checkmarkImage: Image}
const editCheckmarkMap = new Map(); // {dungeonIndex: int, checkmarkImage: Image}
const defaultMapSize = [138, 138];
let headScale = 1;

let players = {}; // {"UnclaimedBloom6":{"head": Image, "uuid": "", "hasSpirit": true, "rank": "&6[MVP&0++&6] ", "visited": ["Trap", "Blaze"]}}
let puzzles = {}; // {"Water Board":{"pos": [2, 4], "checkmark": 1}, ...} checkmark: 0=failed, 1=incomplete, 2=white check, 3=green check
let unassignedPuzzles = []; // [[0, 5], [2,4], ...] Coordinates of puzzles on map (0-5)
let trapPos = null; // null or [0-128, 0-128]

let mapBuffered = new BufferedImage(23, 23, BufferedImage.TYPE_4BYTE_ABGR);
let mapImage = new Image(mapBuffered);
let mapIsEmpty = true;

let watcherDone = false;

let ll = 128 / 23;
const getRoomPosition = (x, y) => [ll * 1.5 + ll * 4 * x, ll * 1.5 + ll * 4 * y];

// Checkmark status of the puzzle
const puzzleTextColors = {
    0: new Color(161 / 255, 0, 0, 1),
    1: Color.WHITE,
    2: Color.YELLOW,
    3: Color.GREEN,
};

//functions
const setPixels = (x1, y1, width, height, color) => {
    if (!color) return;
    for (let x = x1; x < x1 + width; x++) for (let y = y1; y < y1 + height; y++) mapBuffered.setRGB(x, y, color.getRGB());
};

const clearMap = () => {
    setPixels(0, 0, 23, 23, new Color(0, 0, 0, 0));
};

const updatePlayer = (player) => {
    if (!Player.getPlayer()) return; //How tf is this null sometimes wtf
    let pl = Player.getPlayer()
        .field_71174_a.func_175106_d()
        .sort((a, b) => sorter.compare(a, b)); // Tab player list

    for (let p of pl) {
        if (!p.func_178854_k()) continue;
        let line = p.func_178854_k().func_150260_c();
        // https://regex101.com/r/cUzJoK/3
        line = line.replace(/§./g, ""); //support dungeons guide custom name colors
        let match = line.match(/^\[(\d+)\] (?:\[\w+\] )*(\w+) (?:.)*?\((\w+)(?: (\w+))*\)$/);
        if (!match) continue;
        let [_, sbLevel, name, clazz, level] = match;
        if (name != player) continue;
        return [p, clazz, level, sbLevel]; // [player, class, level, sbLevel]
    }
};

//feature
const StellaNav = FeatManager.createFeature("mapEnabled", "catacombs");

//gui
const MapGui = hud.createHud("StellaNav", 10, 10, 150, 150);

//edit hud
MapGui.onDraw((x, y) => {
    let [w, h] = defaultMapSize;
    h += settings().mapInfoUnder ? 10 : 0;

    Renderer.translate(x, y);
    Renderer.scale(MapGui.getScale());
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), 0, 0, w, h);
    Renderer.finishDraw();

    Renderer.drawImage(defaultMapImage, 5 + x, 5 + y, 128 * MapGui.getScale(), 128 * MapGui.getScale());

    let checks = getCheckmarks();
    // Add fake checkmarks
    editCheckmarkMap.set(0, checks[34]);
    editCheckmarkMap.set(12, checks[30]);
    editCheckmarkMap.set(13, checks[18]);
    editCheckmarkMap.set(16, checks[18]);

    renderCheckmarks(editCheckmarkMap);

    // Add fake players
    let fun = AbstractClientPlayer.class.getDeclaredMethod("func_175155_b"); // getPlayerInfo
    fun.setAccessible(true);
    let info = fun.invoke(Player.getPlayer());
    if (info) renderPlayerHeads(info, 65 + x, 35 + y, 320, headScale, 3, "Mage");

    if (settings().mapInfoUnder) renderUnderMapInfo();
});

StellaNav.register("renderOverlay", () => {
    if (hud.isOpen()) return;
    renderMap();
    renderCheckmarks(checkmarkMap);
    renderPlayers();
    if (settings().mapInfoUnder) renderUnderMapInfo();
});

//get players
StellaNav.register("tick", () => {
    let tempPlayers = DungeonScanner.players;
    if (!tempPlayers) return;

    tempPlayers.forEach((p) => {
        let player = p?.name;
        if (!player) return;

        //create a player object
        if (!Object.keys(players).includes(player)) {
            players[player] = {
                info: [],
                class: null,
                uuid: null,
                hasSpirit: false,
                visited: [],
                iconX: null,
                iconY: null,
                yaw: null,
                visited: p?.visitedRooms,
                deaths: p?.deaths,
                inRender: false,
            };
        }

        //update player info
        players[player].info = updatePlayer(player);
        players[player].class = Dungeon.partyMembers[player]?.className;
        players[player].visited = p?.visitedRooms;
        players[player].deaths = p?.deaths;

        //update player position from map
        if (!players[player].inRender) {
            if (Dungeon.mapData && Dungeon.mapCorners) {
                for (let p of Object.keys(players)) {
                    let player = players[p];
                    if (!players[p].inRender) {
                        let icon = Object.keys(Dungeon.icons).find((key) => Dungeon.icons[key].player == p);
                        if (!icon) continue;
                        icon = Dungeon.icons[icon];
                        player.iconX = MathLib.map(icon.x - Dungeon.mapCorners[0] * 2, 0, 256, 0, 138);
                        player.iconY = MathLib.map(icon.y - Dungeon.mapCorners[1] * 2, 0, 256, 0, 138);
                        player.yaw = icon.rotation;
                    }
                }
            }
        }
    });
});

StellaNav.register(
    "stepFps",
    () => {
        for (let p of Object.keys(players)) {
            let player = World.getPlayerByName(p);
            if (!player) {
                players[p].inRender = false;
                continue;
            }
            if (player.getPing() == -1) {
                delete players[p];
                continue;
            }
            if (!isBetween(player.getX(), -200, -10) || !isBetween(player.getZ(), -200, -10)) continue;
            players[p].inRender = true;
            players[p].iconX = MathLib.map(player.getX(), -200, -10, 0, 128);
            players[p].iconY = MathLib.map(player.getZ(), -200, -10, 0, 128);
            players[p].yaw = player.getYaw() + 180;
        }
    },
    60
);

let mapLine1 = "&7Secrets: &b?    &7Crypts: &c0    &7Mimic: &c✘";
let mapLine2 = "&7Min Secrets: &b?    &7Deaths: &a0    &7Score: &c0";

//update from map
InternalEvents.on("mapdata", (mapData) => {
    const colors = mapData.field_76198_e;

    if (!colors || colors[0] == 119) return;
    if (!Dungeon.mapCorners) return;

    clearMap();

    const checkmarkImages = getCheckmarks();
    const tempCheckmarkMap = new Map();

    // Find important points on the map and build a new one
    let xx = -1;
    for (let x = Dungeon.mapCorners[0] + Dungeon.mapRoomSize / 2; x < 118; x += Dungeon.mapGapSize / 2) {
        let yy = -1;
        xx++;
        for (let y = Dungeon.mapCorners[1] + Dungeon.mapRoomSize / 2 + 1; y < 118; y += Dungeon.mapGapSize / 2) {
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
                if (roomColor == 18 && watcherDone && center != 30) {
                    tempCheckmarkMap.set(roomIndex, checkmarkImages[34]); // White checkmark for blood room
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
                if (center == 119) setPixels(xx * 2 + 1, yy * 2 + 1, 1, 1, new Color(settings().mapWitherDoorColor[0] / 255, settings().mapWitherDoorColor[1] / 255, settings().mapWitherDoorColor[2] / 255), 1);
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
});

StellaNav.register("tick", () => {
    let dSecrets = "&7Secrets: " + (!Dungeon.secretsFound ? "&b?" : `&b${Dungeon.secretsFound}&8-&e${Dungeon.scoreData.secretsRemaining}&8-&c${Dungeon.scoreData.totalSecrets}`);
    let dCrypts = "&7Crypts: " + (Dungeon.crypts >= 5 ? `&a${Dungeon.crypts}` : Dungeon.crypts > 0 ? `&e${Dungeon.crypts}` : `&c0`);
    let dMimic = [6, 7].includes(Dungeon.floorNumber) ? "&7Mimic: " + (Dungeon.mimicDead ? "&a✔" : "&c✘") : "";

    let minSecrets = "&7Min Secrets: " + (!Dungeon.secretsFound ? "&b?" : Dungeon.scoreData.minSecrets > Dungeon.secretsFound ? `&e${Dungeon.scoreData.minSecrets}` : `&a${Dungeon.scoreData.minSecrets}`);
    let dDeaths = "&7Deaths: " + (Dungeon.scoreData.deathPenalty < 0 ? `&c${Dungeon.scoreData.deathPenalty}` : "&a0");
    let dScore = "&7Score: " + (Dungeon.scoreData.score >= 300 ? `&a${Dungeon.scoreData.score}` : Dungeon.scoreData.score >= 270 ? `&e${Dungeon.scoreData.score}` : `&c${Dungeon.scoreData.score}`) + (Dungeon._hasPaul ? " &b★" : "");

    mapLine1 = `${dSecrets}    ${dCrypts}    ${dMimic}`.trim();
    mapLine2 = `${minSecrets}    ${dDeaths}    ${dScore}`.trim();
});

//map rendering
const renderMap = () => {
    let map = mapIsEmpty ? defaultMapImage : mapImage;
    let [x, y] = [MapGui.getX(), MapGui.getY()];
    let [w, h] = defaultMapSize;
    h += settings().mapInfoUnder ? 10 : 0;

    Renderer.retainTransforms(true);
    Renderer.translate(x, y);
    Renderer.scale(MapGui.getScale());
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), 0, 0, w, h);
    Renderer.translate(5, 5);
    Renderer.drawImage(map, 0, 0, 128, 128);
    Renderer.retainTransforms(false);
    Renderer.finishDraw();
};

//player heads
const renderPlayers = () => {
    if (!players) return;

    let keys = Object.keys(players);
    // Move the player to the end of the array so they get rendered above everyone else
    if (keys.includes(Player.getName())) {
        const ind = keys.indexOf(Player.getName());
        keys = keys.concat(keys.splice(ind, 1));
    }
    for (let p of keys) {
        //if (players[p].class == "DEAD" && p !== Player.getName()) continue;
        let size = [7, 10];
        let head = p == Player.getName() ? GreenMarker : WhiteMarker;
        let borderWidth = 0;

        if (settings().mapHeadOutline) borderWidth = 3;

        let x = players[p].iconX || 0;
        let y = players[p].iconY || 0;
        if (!x && !y) continue;

        let yaw = players[p].yaw || 0;

        Renderer.retainTransforms(true);
        Renderer.translate(MapGui.getX(), MapGui.getY());
        Renderer.scale(MapGui.getScale());
        Renderer.translate(x + 5, y + 5);

        let dontRenderOwn = !settings().mapShowOwn && p == Player.getName();

        // Render the player name
        if (settings().mapShowPlayerNames && ["Spirit Leap", "Infinileap"].includes(Player.getHeldItem()?.getName()?.removeFormatting()) && !dontRenderOwn) {
            let name = p;
            let width = Renderer.getStringWidth(name);
            let scale = headScale / 1.75;
            Renderer.translate(0, 8);
            Renderer.scale(scale);
            Renderer.drawStringWithShadow(name, -width / 2, 0);
            Renderer.scale(1.75 / headScale, 1.75 / headScale);
            Renderer.translate(0, -8);
        }

        Renderer.rotate(yaw);
        Renderer.translate(-size[0] / 2, -size[1] / 2);
        if (!settings().mapPlayerHeads) Renderer.drawImage(head, 0, 0, size[0], size[1]);
        Renderer.retainTransforms(false);
        Renderer.finishDraw();

        // Render the player head
        if (settings().mapPlayerHeads) renderPlayerHeads(players[p].info[0], x + MapGui.getX(), y + MapGui.getY(), yaw, headScale, borderWidth, players[p].info[1]);
    }
};

//checkmarks
const renderCheckmarks = (map) => {
    for (let entry of map.entries()) {
        let [roomIndex, checkmarkImage] = entry;
        let rx = Math.floor(roomIndex / 6);
        let ry = roomIndex % 6;
        let scale = 0.9;
        let [x, y] = getRoomPosition(rx, ry);
        if (Object.keys(puzzles).some((a) => puzzles[a].pos[0] == rx && puzzles[a].pos[1] == ry)) continue;
        let [w, h] = [12 * scale, 12 * scale];
        Renderer.retainTransforms(true);
        Renderer.translate(MapGui.getX(), MapGui.getY());
        Renderer.scale(MapGui.getScale());
        Renderer.translate(x + 128 / 23 - 1, y + 128 / 23 - 1);
        Renderer.drawImage(checkmarkImage, -w / 2, -h / 2, w, h);
        Renderer.retainTransforms(false);
        Renderer.finishDraw();
    }
};

//map info
const renderUnderMapInfo = () => {
    Renderer.retainTransforms(true);
    Renderer.translate(MapGui.getX(), MapGui.getY());
    Renderer.scale(MapGui.getScale());
    Renderer.translate(138 / 2, 135);
    Renderer.scale(0.6, 0.6);
    let w1 = Renderer.getStringWidth(mapLine1);
    let w2 = Renderer.getStringWidth(mapLine2);
    Renderer.drawStringWithShadow(mapLine1, -w1 / 2, 0);
    Renderer.drawStringWithShadow(mapLine2, -w2 / 2, 10);
    Renderer.retainTransforms(false);
};

register("chat", () => {
    watcherDone = true;
}).setCriteria(/\[BOSS\] The Watcher: That will be enough for now\./);

//Reset on world unload
register("worldUnload", () => {
    clearMap();
    playerHeads = {};
    checkmarkMap.clear();
    puzzles = {};
    players = {};
    mapIsEmpty = true;
    trapPos = null;
    rooms = [];
    watcherDone = false;
});
