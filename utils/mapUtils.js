const Color = Java.type("java.awt.Color");
const MCTessellator = Java.type("net.minecraft.client.renderer.Tessellator");
const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats");

const assets = "config/ChatTriggers/modules/stella/stellanav";

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

export const roomTypes = {
    63: "Normal",
    30: "Entrance",
    74: "Yellow",
    18: "Blood",
    66: "Puzzle",
    62: "Trap",
};

export function getPlayerName(player) {
    if (!player) return "???";
    return ChatLib.removeFormatting(player.name ?? "???")
        .replace(/[♲Ⓑ]/g, "")
        .replace("§z", "")
        .trim();
}

getClassColor = (dClass) => {
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

export function renderPlayerHeads(netInfo, x, y, yaw, headScale, borderWidth, dClass) {
    Tessellator.pushMatrix();
    Renderer.retainTransforms(true);
    let [w, h] = [headScale * 10, headScale * 10];

    Renderer.translate(x + w / 2, y + h / 2, 50);

    Renderer.rotate(yaw);

    if (borderWidth) {
        let playerColor = getClassColor(dClass);
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
