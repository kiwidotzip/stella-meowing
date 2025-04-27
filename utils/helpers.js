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
