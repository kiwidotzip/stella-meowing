import { highlightSlot, renderCenteredString } from "../utils/utils";
import { getRoomData, inDungeon } from "../utils/dutils";
import settings, { roomName } from "../utils/config";
import PogObject from "../../PogData";
import Shader from "../shaders/shader";

/*  --------------- secret routes ---------------

    A bunch of little dungeon features

    ------------------- To Do -------------------

    - Doccument how gui works

    --------------------------------------------- */

//variables
let trashItems = [
    "Healing VIII Splash Potion",
    "Healing Potion 8 Splash Potion",
    "Training Weights",
    "Defuse Kit",
    "Revive Stone",
    "Premium Flesh",
    "Grunt",
    "Rotten",
    "Lord",
    "Master",
    "Soulstealer Bow",
    "Machine Gun Shortbow",
    "Dreadlord Sword",
    "Earth Shard",
    "Bouncy",
    "Heavy",
    "Soldier",
    "Sniper",
    "Commander",
    "Knight",
    "Rune",
    "Diary",
    "Beating Heart",
    "Tripwire Hook",
    "Lever",
    "Conjuring",
    "Skeletor",
];

let shops = ["Booster Cookie", "Ophelia", "Trades"];

const rGui = new PogObject("eclipseAddons", {
    X: Renderer.screen.getWidth() / 2,
    Y: Renderer.screen.getHeight() / 2,
    scale: 1,
});

lastRoomId = null;
currRoomName = "Room Not Found";

//shader loading
const chromaShader = new Shader(
    FileLib.read("eclipseAddons", "shaders/chroma/chromat.frag"),
    FileLib.read("eclipseAddons", "shaders/chroma/chromat.vert")
);

let totalTicks = 0;
register("tick", (t) => (totalTicks = t));

//functions
const renderRoomNameEditGui = () => {
    renderCenteredString(
        "&6Scroll &rto change the scale",
        Renderer.screen.getWidth() / 2,
        Renderer.screen.getHeight() / 3,
        1,
        false
    );
};

const renderRoomName = () => {
    let width = Renderer.getStringWidth(currRoomName);
    let height = 11;
    let c = settings().roomNameColor;
    let [r, g, b, a] = c;
    Renderer.retainTransforms(true);
    Renderer.translate(rGui.X, rGui.Y);
    Renderer.scale(rGui.scale, rGui.scale);
    if (a !== 0)
        Renderer.drawRect(
            Renderer.color(r, g, b, a),
            -1,
            -1,
            width + 2,
            height
        );

    if (settings().chromaRoomName) {
        chromaShader.bind();

        chromaShader.uniform1f(
            "chromaSize",
            (30 * Client.getMinecraft().field_71443_c) / 100
        );
        chromaShader.uniform1f(
            "timeOffset",
            (totalTicks + Tessellator.partialTicks) * (6 / 360)
        );
        chromaShader.uniform1f("saturation", 1);

        Renderer.drawString(currRoomName, 0, 0);

        chromaShader.unbind();
    } else {
        Renderer.drawString(currRoomName, 0, 0);
    }

    Renderer.retainTransforms(false);
};

//gets current room name
register("step", () => {
    if (settings().showRoomName) {
        let roomId = getRoomData();

        if (!roomId) {
            currRoomName = "Room Not Found";
            return;
        }

        if (lastRoomId !== roomId) {
            lastRoomId = roomId;

            currRoomName = getRoomData().name;
        }
    }
}).setFps(20);

//renders guis
register("renderOverlay", () => {
    if (roomName.isOpen()) {
        renderRoomNameEditGui();
        renderRoomName();
    }

    if (settings().showRoomName && inDungeon()) {
        renderRoomName();
    }
});

//update guis
register("dragged", (dx, dy, x, y, btn) => {
    if (roomName.isOpen()) {
        rGui.X = x;
        rGui.Y = y;
        rGui.save();
    }
});

register("scrolled", (mx, my, dir) => {
    if (!roomName.isOpen()) return;
    if (dir == 1) rGui.scale += 0.05;
    else rGui.scale -= 0.05;
    rGui.save();
});

//highlihgt trash
register("guiRender", (mx, mt, gui) => {
    if (!settings().highlightTrash) return;
    let inv = Player.getContainer();
    let [r, g, b, a] = [
        settings().trashColor[0] / 255,
        settings().trashColor[1] / 255,
        settings().trashColor[2] / 255,
        settings().trashColor[3] / 255,
    ];
    if (!shops.some((k) => inv?.getName()?.includes(k))) return;
    for (let i = 0; i < inv.getSize(); i++) {
        if (!inv?.getStackInSlot(i)?.getName()) continue;
        if (
            !trashItems.some((j) =>
                inv?.getStackInSlot(i)?.getName().includes(j)
            )
        )
            continue;
        highlightSlot(gui, i, r, g, b, a, false);
    }
});
