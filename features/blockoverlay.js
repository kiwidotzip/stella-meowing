import { renderBlockHitbox } from "../utils/bloomRenderUtils";
import { renderBoxOutline } from "../utils/bloomRenderUtils";
import settings from "../utils/config";

let chroma = [];

register("step", (i) => {
  if (!settings().overlayEnabled) return;
  if (!settings().chromaHighlight) return;

  let speed = 11 - settings().chromaOverlaySpeed;
  chroma = Object.values(Renderer.getRainbowColors(i, speed));
}).setFps(30);

register("renderWorld", () => {
  if (!settings().overlayEnabled) return;

  let block = Player.lookingAt();

  if (!block) return;
  if (!block?.type) return;
  if (block?.getID() === 0) return;

  let [x, y, z] = [block.getX(), block.getY(), block.getZ()];
  let [r, g, b, a] = [
    settings().blockHighlightColor[0],
    settings().blockHighlightColor[1],
    settings().blockHighlightColor[2],
    settings().blockHighlightColor[3],
  ];

  let [fr, fg, fb, fa] = [
    settings().blockFillColor[0],
    settings().blockFillColor[1],
    settings().blockFillColor[2],
    settings().blockFillColor[3],
  ];

  let lw = settings().overlayLineWidth;

  if (settings().chromaHighlight) {
    [r, g, b] = chroma;
    [fr, fg, fb] = chroma;
  }

  //stair logic
  if (block?.type?.getRegistryName()?.toString()?.includes("stairs")) {
    if (block?.getMetadata() === 0) {
      renderBoxOutline(
        x + 0.5,
        y - 0.005,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.75,
        y + 0.505,
        z + 0.5,
        1.005,
        0.505,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 1) {
      renderBoxOutline(
        x + 0.5,
        y - 0.005,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.25,
        y + 0.505,
        z + 0.5,
        1.005,
        0.505,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 2) {
      renderBoxOutline(
        x + 0.5,
        y - 0.005,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.5,
        y + 0.505,
        z + 0.75,
        0.505,
        1.005,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 3) {
      renderBoxOutline(
        x + 0.5,
        y - 0.005,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.5,
        y + 0.505,
        z + 0.25,
        0.505,
        1.005,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 4) {
      renderBoxOutline(
        x + 0.5,
        y + 0.505,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.75,
        y - 1.005,
        z + 0.5,
        1.005,
        0.505,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 5) {
      renderBoxOutline(
        x + 0.5,
        y + 0.505,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.25,
        y - 0.005,
        z + 0.5,
        1.005,
        0.505,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 6) {
      renderBoxOutline(
        x + 0.5,
        y + 0.505,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.5,
        y - 0.005,
        z + 0.75,
        0.505,
        1.005,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    } else if (block?.getMetadata() === 7) {
      renderBoxOutline(
        x + 0.5,
        y + 0.105,
        z + 0.5,
        1.005,
        1.005,
        0.51,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );

      renderBoxOutline(
        x + 0.5,
        y - 0.005,
        z + 0.25,
        0.505,
        1.005,
        0.5,
        r / 255,
        g / 255,
        b / 255,
        a / 255,
        lw,
        false
      );
    }
  }

  //default block logic
  else {
    renderBlockHitbox(
      block,
      r / 255,
      g / 255,
      b / 255,
      a / 255,
      false,
      lw,
      false
    );

    if (settings().fillBlockOverlay) {
      renderBlockHitbox(
        block,
        fr / 255,
        fg / 255,
        fb / 255,
        fa / 255,
        false,
        0,
        true
      );
    }
  }
});

register("command", () => {
  ChatLib.chat(Player.lookingAt());
  ChatLib.chat(Player.lookingAt().getMetadata());
}).setName("testing");
