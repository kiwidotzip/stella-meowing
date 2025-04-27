import { FeatureManager } from "../../tska/event/FeatureManager";
import { Event } from "../../tska/event/Event";
import settings from "./config";

/*  ------------- Helper Utilities --------------

    Various helper functions for the mod

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

export const FeatManager = new FeatureManager(settings().getConfig());

//events
Event.createEvent("stella:blockOverlay", (cb) => {
    register(net.minecraftforge.client.event.DrawBlockHighlightEvent, cb);
});
Event.createEvent("stella:guiRender", (cb) => {
    register("guiRender", cb);
});
Event.createEvent("stella:renderWorld", (cb) => {
    register("renderWorld", cb);
});
