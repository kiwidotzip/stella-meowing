import settings from "../../utils/config";

const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats");
const MCTessellator = Java.type("net.minecraft.client.renderer.Tessellator");
const Color = Java.type("java.awt.Color");

/*  -------------- StellaNav Utils --------------

    Utilities for StellaNav

    ------------------- To Do -------------------

    - Make the  map

    --------------------------------------------- */

//asset url
export const assets = "config/ChatTriggers/modules/stella/stellanav/assets";

//map scaling
export const oscale = (floor) => {
    if (!floor) return 1;
    // The max dungeon size is 6x6
    // Lower floors contain smaller dungeons
    // Entrance is only a 4x4 dungeon, so we need to scale the rooms by the inverse of 4/6
    // To make them fill the entire map area, which is 6/4.
    // The same goes for the other non 6x6 dungeons
    if (floor == 0) return 6 / 4;
    if (floor > 0 && floor < 4) return 6 / 5;
    return 1;
};

//images
export const defaultMapImage = Image.fromFile(assets + "/DefaultMap.png");

export const greenCheck = Image.fromFile(assets + "/clear/BloomMapGreenCheck.png");
export const whiteCheck = Image.fromFile(assets + "/clear/BloomMapWhiteCheck.png");
export const failedRoom = Image.fromFile(assets + "/clear/BloomMapFailedRoom.png");
export const questionMark = Image.fromFile(assets + "/clear/BloomMapQuestionMark.png");

export const GreenMarker = Image.fromFile(assets + "/markerSelf.png");
export const WhiteMarker = Image.fromFile(assets + "/markerOther.png");

export const getCheckmarks = () => {
    return {
        30: greenCheck,
        34: whiteCheck,
        18: failedRoom,
        119: questionMark,
    };
};

export const getTextColor = (check) => {
    if (!check) return "&7";
    if (check == 1) return "&f";
    else if (check == 2) return "&a";
    else if (check == 3) return "&c";
    else return "&7";
};

//map colors
export const mapRGBs = {
    18: new Color(1, 0, 0, 1), // Blood
    85: new Color(65 / 255, 65 / 255, 65 / 255, 1), // Unexplored
    30: new Color(20 / 255, 133 / 255, 0 / 255, 1), // Entrance
    63: new Color(107 / 255, 58 / 255, 17 / 255, 1), // Regular
    82: new Color(224 / 255, 0 / 255, 255 / 255, 1), // Fairy
    62: new Color(216 / 255, 127 / 255, 51 / 255, 1), // Trap
    74: new Color(254 / 255, 223 / 255, 0 / 255, 1), // Yellow
    66: new Color(117 / 255, 0 / 255, 133 / 255, 1), // Puzzle
    119: new Color(0, 0, 0, 1), // Wither door
};

//room types
export const roomTypes = {
    63: "Normal",
    30: "Entrance",
    74: "Yellow",
    18: "Blood",
    66: "Puzzle",
    62: "Trap",
};

//functions
export function getPlayerName(player) {
    if (!player) return "???";
    return ChatLib.removeFormatting(player.name ?? "???")
        .replace(/[♲Ⓑ]/g, "")
        .replace("§z", "")
        .trim();
}

//class colors
const getClassColor = (dClass) => {
    let color = [];
    switch (dClass) {
        case "Healer":
            color = [240, 70, 240, 255];
            break;
        case "Mage":
            color = [70, 210, 210, 255];
            break;
        case "Berserk":
            color = [255, 0, 0, 255];
            break;
        case "Archer":
            color = [30, 170, 50, 255];
            break;
        case "Tank":
            color = [150, 150, 150, 255];
            break;
    }
    return color;
};

export const typeToName = (type) => {
    let name = null;
    switch (type) {
        case 0:
            name = "NORMAL";
            break;
        case 1:
            name = "PUZZLE";
            break;
        case 2:
            name = "TRAP";
            break;
        case 3:
            name = "MINIBOSS";
            break;
        case 4:
            name = "BLOOD";
            break;
        case 5:
            name = "FAIRY";
            break;
        case 6:
            name = "RARE";
            break;
        case 7:
            name = "ENTRANCE";
            break;
    }
    return name;
};

export const typeToColor = (type) => {
    let color = null;
    switch (type) {
        case 0:
            color = "7";
            break;
        case 1:
            color = "d";
            break;
        case 2:
            color = "6";
            break;
        case 3:
            color = "e";
            break;
        case 4:
            color = "c";
            break;
        case 5:
            color = "d";
            break;
        case 6:
            color = "b";
            break;
        case 7:
            color = "a";
            break;
    }
    return color;
};

export function renderPlayerHeads(netInfo, x, y, yaw, headScale, borderWidth, dClass, scale = 1) {
    if (!netInfo) return;
    Tessellator.pushMatrix();
    Renderer.retainTransforms(true);
    let [w, h] = [headScale * 10 * scale, headScale * 10 * scale];

    Renderer.translate(-w / 2, -h / 2);
    Renderer.translate(x + w, y + h, 50);

    Renderer.rotate(yaw);

    if (borderWidth) {
        let playerColor = [settings().mapHeadColor[0], settings().mapHeadColor[1], settings().mapHeadColor[2], settings().mapHeadColor[3]];
        if (settings().mapClassColors) playerColor = getClassColor(dClass);

        Renderer.drawRect(
            Renderer.color(playerColor[0] ?? 0, playerColor[1] ?? 0, playerColor[2] ?? 0, playerColor[3] ?? 255),
            -w / 2 - (borderWidth * w) / 30,
            -h / 2 - (borderWidth * w) / 30,
            w + (borderWidth * 2 * w) / 30,
            h + (borderWidth * 2 * w) / 30
        );
    }

    Tessellator.enableBlend();
    //                   .getTextureManager().bindTexture                     .getLocationSkin
    Client.getMinecraft().func_110434_K().func_110577_a(netInfo.func_178837_g());
    Tessellator.enableTexture2D();

    //                             .getInstance()
    let tessellator = MCTessellator.func_178181_a();
    //                             .getWorldRenderer()
    let worldRenderer = tessellator.func_178180_c();
    //           .begin                                .POSITION_TEX
    worldRenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g);

    //           .pos                              .tex                           .endVertex
    worldRenderer
        .func_181662_b(-w / 2, h / 2, 0.0)
        .func_181673_a(8 / 64, 16 / 64)
        .func_181675_d();
    worldRenderer
        .func_181662_b(w / 2, h / 2, 0.0)
        .func_181673_a(16 / 64, 16 / 64)
        .func_181675_d();
    worldRenderer
        .func_181662_b(w / 2, -h / 2, 0.0)
        .func_181673_a(16 / 64, 8 / 64)
        .func_181675_d();
    worldRenderer
        .func_181662_b(-w / 2, -h / 2, 0.0)
        .func_181673_a(8 / 64, 8 / 64)
        .func_181675_d();
    //         .draw
    tessellator.func_78381_a();

    //           .begin                                .POSITION_TEX
    worldRenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g);

    worldRenderer
        .func_181662_b(-w / 2, h / 2, 0.0)
        .func_181673_a(40 / 64, 16 / 64)
        .func_181675_d();
    worldRenderer
        .func_181662_b(w / 2, h / 2, 0.0)
        .func_181673_a(48 / 64, 16 / 64)
        .func_181675_d();
    worldRenderer
        .func_181662_b(w / 2, -h / 2, 0.0)
        .func_181673_a(48 / 64, 8 / 64)
        .func_181675_d();
    worldRenderer
        .func_181662_b(-w / 2, -h / 2, 0.0)
        .func_181673_a(40 / 64, 8 / 64)
        .func_181675_d();
    //         .draw
    tessellator.func_78381_a();

    Renderer.retainTransforms(false);
    Tessellator.popMatrix();
}
