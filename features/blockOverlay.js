import { renderBlockHitbox, renderBoxOutline, renderFilledBox } from "../utils/bloomRenderUtils";
import { registerWhen } from "../utils/utils";
import Shader from "../../ShaderLib/index";
import settings from "../utils/config";

const DrawBlockHighlightEvent = net.minecraftforge.client.event.DrawBlockHighlightEvent;

/*  --------------- Block Overlay ---------------

    Silly rainbow blocks

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//old chroma
let chroma = [];

registerWhen(
    register("step", (i) => {
        const speed = 11 - settings().chromaOverlaySpeed;
        chroma = Object.values(Renderer.getRainbowColors(i, speed));
    }).setFps(30),
    () => settings().oldChroma
);

//new chroma
const chromaShader = new Shader(FileLib.read("eclipseAddons", "shaders/chroma/chroma3D.frag"), FileLib.read("eclipseAddons", "shaders/chroma/chroma3D.vert"));

let totalTicks = 0;
register("tick", (t) => (totalTicks = t));

//overlay
registerWhen(
    register(DrawBlockHighlightEvent, (event) => {
        const partialTicks = event.partialTicks;
        const fill = settings().fillBlockOverlay;
        const lw = settings().overlayLineWidth;
        const block = Player.lookingAt();

        if (!block) return;
        if (!block?.type) return;
        if (block?.getID() === 0) return;

        let [x, y, z] = [block.getX(), block.getY(), block.getZ()];
        let [r, g, b, a] = [settings().blockHighlightColor[0], settings().blockHighlightColor[1], settings().blockHighlightColor[2], settings().blockHighlightColor[3]];
        let [fr, fg, fb, fa] = [settings().blockFillColor[0], settings().blockFillColor[1], settings().blockFillColor[2], settings().blockFillColor[3]];

        let viewPos = { x: Player.getX(), y: Player.getY(), z: Player.getZ() };

        let meta = block?.getMetadata();

        if (settings().chromaHighlight) {
            if (settings().oldChroma) {
                [r, g, b] = chroma;
                [fr, fg, fb] = chroma;
            } else {
                [r, g, b] = [255, 255, 255];
                [fr, fg, fb] = [255, 255, 255];

                chromaShader.bind();

                chromaShader.uniform3f("playerWorldPosition", viewPos.x, viewPos.y, viewPos.z);
                chromaShader.uniform1f("chromaSize", (30 * Client.getMinecraft().field_71443_c) / 1000);
                chromaShader.uniform1f("timeOffset", (totalTicks + partialTicks) * (6 / 360) * settings().chromaOverlaySpeed);
                chromaShader.uniform1f("saturation", 1);
                chromaShader.uniform1f("alpha", a / 255);
                chromaShader.uniform1f("brightness", 1);
            }
        }

        //stair logic
        if (block?.type?.getRegistryName()?.toString()?.includes("stairs")) {
            if (meta === 0) {
                renderBoxOutline(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.75, y + 0.505, z + 0.5, 1.005, 0.505, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 1) {
                renderBoxOutline(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.25, y + 0.505, z + 0.5, 1.005, 0.505, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 2) {
                renderBoxOutline(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.5, y + 0.505, z + 0.75, 0.505, 1.005, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 3) {
                renderBoxOutline(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.5, y + 0.505, z + 0.25, 0.505, 1.005, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 4) {
                renderBoxOutline(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.75, y - 0.005, z + 0.5, 1.005, 0.505, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 5) {
                renderBoxOutline(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.25, y - 0.005, z + 0.5, 1.005, 0.505, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 6) {
                renderBoxOutline(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.5, y - 0.005, z + 0.75, 0.505, 1.005, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            } else if (meta === 7) {
                renderBoxOutline(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                renderBoxOutline(x + 0.5, y - 0.005, z + 0.25, 0.505, 1.005, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
            }

            if (fill) {
                if (settings().chromaHighlight && !settings().oldChroma) chromaShader.uniform1f("alpha", fa / 255);

                if (meta === 0) {
                    renderFilledBox(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.75, y + 0.505, z + 0.5, 1.005, 0.505, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                } else if (meta === 1) {
                    renderFilledBox(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.25, y + 0.505, z + 0.5, 1.005, 0.505, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                } else if (meta === 2) {
                    renderFilledBox(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.5, y + 0.505, z + 0.75, 0.505, 1.005, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                } else if (meta === 3) {
                    renderFilledBox(x + 0.5, y - 0.005, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.5, y + 0.505, z + 0.25, 0.505, 1.005, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                } else if (meta === 4) {
                    renderBoxOutline(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, r / 255, g / 255, b / 255, a / 255, lw, false);

                    renderBoxOutline(x + 0.75, y - 0.005, z + 0.5, 1.005, 0.505, 0.5, r / 255, g / 255, b / 255, a / 255, lw, false);
                } else if (meta === 5) {
                    renderFilledBox(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.25, y - 0.005, z + 0.5, 1.005, 0.505, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                } else if (meta === 6) {
                    renderFilledBox(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.5, y - 0.005, z + 0.75, 0.505, 1.005, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                } else if (meta === 7) {
                    renderFilledBox(x + 0.5, y + 0.495, z + 0.5, 1.005, 1.005, 0.51, fr / 255, fg / 255, fb / 255, fa / 255, false);

                    renderFilledBox(x + 0.5, y - 0.005, z + 0.25, 0.505, 1.005, 0.5, fr / 255, fg / 255, fb / 255, fa / 255, false);
                }
            }
        }

        //default block logic
        else {
            if (settings().chromaHighlight && !settings().oldChroma) chromaShader.uniform1f("alpha", a / 255);

            renderBlockHitbox(block, r / 255, g / 255, b / 255, a / 255, false, lw, false);

            if (fill) {
                if (settings().chromaHighlight && !settings().oldChroma) chromaShader.uniform1f("alpha", fa / 255);

                renderBlockHitbox(block, fr / 255, fg / 255, fb / 255, fa / 255, false, 0, true);
            }
        }

        if (settings().chromaHighlight && !settings().oldChroma) chromaShader.unbind();

        //delete vanilla outline
        cancel(event);
    }),
    () => settings().overlayEnabled
);
