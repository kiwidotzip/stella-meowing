import { registerWhen, highlightSlot, renderCenteredString } from "../../BloomCore/utils/Utils";
import { getRoomData } from "../../roomsAPI/utils/utils";
import settings from "../utils/config";
import { hud } from "../utils/hud";
import Dungeon from "../../BloomCore/dungeons/Dungeon";
import Shader from "../../shaderlib/index";

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
    "Silent Death",
];

let shops = ["Booster Cookie", "Ophelia", "Trades"];

currRoomName = "Room Not Found";
const rHud = hud.createTextHud("roomHud", 120, 10, currRoomName);

//shader loading
const chromaShader = new Shader(FileLib.read("stella", "shaders/chroma/chromat.frag"), FileLib.read("stella", "shaders/chroma/chromat.vert"));

let totalTicks = 0;
register("tick", (t) => (totalTicks = t));

//functions
const renderRoomNameEditGui = () => {
    renderCenteredString("&6Scroll &rto change the scale", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 3, 1, false);
};

rHud.onDraw((x, y, str) => {
    Renderer.translate(x, y);
    Renderer.scale(rHud.getScale());
    Renderer.drawStringWithShadow(str, 0, 0);
    Renderer.finishDraw();
});

const renderRoomName = () => {
    let width = Renderer.getStringWidth(currRoomName);
    let height = 11;
    let c = settings().roomNameColor;
    let [r, g, b, a] = c;

    Renderer.translate(rHud.getX(), rHud.getY());
    Renderer.scale(rHud.getScale());

    if (a !== 0) Renderer.drawRect(Renderer.color(r, g, b, a), -1, -1, width + 2, height);

    if (settings().chromaRoomName) {
        chromaShader.bind();

        chromaShader.uniform1f("chromaSize", (30 * Client.getMinecraft().field_71443_c) / 100);
        chromaShader.uniform1f("timeOffset", (totalTicks + Tessellator.partialTicks) * (6 / 360));
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
    if (!Dungeon.inDungeon) return;
    if (settings().showRoomName) currRoomName = getRoomData().name;
}).setFps(20);

//renders guis
register("renderOverlay", () => {
    if (hud.isOpen() || !settings().showRoomName || !Dungeon.inDungeon || Dungeon.bossEntry) return;
    renderRoomName();
});

//highlihgt trash
registerWhen(
    register("guiRender", (mx, mt, gui) => {
        let inv = Player.getContainer();
        let [r, g, b, a] = [settings().trashColor[0] / 255, settings().trashColor[1] / 255, settings().trashColor[2] / 255, settings().trashColor[3] / 255];
        if (!shops.some((k) => inv?.getName()?.includes(k))) return;
        for (let i = 0; i < inv.getSize(); i++) {
            if (!inv?.getStackInSlot(i)?.getName()) continue;
            if (!trashItems.some((j) => inv?.getStackInSlot(i)?.getName().includes(j))) continue;
            highlightSlot(gui, i, r, g, b, a, false);
        }
    }),
    () => settings().highlightTrash
);
