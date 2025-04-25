import { LocalStore } from "../../tska/storage/LocalStore";
import { HudManager } from "../../tska/gui/HudManager";

/*  --------------- Hud Utilities ---------------

    General HUD utilities

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

const HudData = new LocalStore("stella", {}, "./data/stella-hud.json");
export const hud = new HudManager(HudData);

// saving the huds
register("gameUnload", () => {
    hud.save();
    HudData.save();
});
