import { FeatManager } from "../utils/helpers";
import { hud } from "../utils/hud";

/*  ---------------- StellarNav -----------------

    Dungeon Map

    ------------------- To Do -------------------

    - Make the  map

    --------------------------------------------- */

//feature
const StellaNav = FeatManager.createFeature("mapEnabled", "catacombs");

//gui
const MapGui = hud.createResizableHud("StellaNav", 10, 10, 100, 100);

resizableHud.onDraw((x, y, width, height) => {
    Renderer.translate(x, y);
    Renderer.scale(MapGui.getScale());
    Renderer.drawRect(Renderer.color(0, 150, 0), 0, 0, 100, 100);
    Renderer.finishDraw();
});

StellaNav.register("renderOverlay", () => {
    if (hud.isOpen()) return;

    Renderer.translate(MapGui.getX(), MapGui.getY());
    Renderer.scale(MapGui.getScale());
    Renderer.drawRect(Renderer.color(255, 255, 255), 0, 0, 100, 100);
    Renderer.drawRect(Renderer.color(0, 0, 0), x3, y3, x4, y4);
    Renderer.finishDraw();
});
