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
Event.createEvent("sa:blockHighlight", (cb) => {
    register(net.minecraftforge.client.event.DrawBlockHighlightEvent, (e) => cb(e));
});
Event.createEvent("sa:guiRender", (cb) => {
    register("guiRender", cb);
});
Event.createEvent("sa:renderWorld", (cb) => {
    register("renderWorld", cb);
});
