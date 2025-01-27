import { getScoreboard } from "./utils";

/*  ------------ Dungeon Utilities --------------

    Dungeon related utilites

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//load routes
export let routes = JSON.parse(FileLib.read("eclipseAddons", "data/dungeons/routes/routes.json"));

//checks if your in dungeons based on the scorebord
export const inDungeon = () => {
    let names = ChatLib.removeFormatting(Object.values(TabList.getNames()));
    let cataMatch = names.match("Dungeon: Catacombs");

    if (cataMatch) return true;

    return false;
};

export const getFloor = () => {
    let text = getScoreboard();
    let cataMatch = null;

    for (i = 0; i < text.length; i++) {
        cataMatch = text[i].match(/ombs \((\w+)\)$/);
        if (cataMatch) break;
    }

    if (!cataMatch) return "nothing";

    return cataMatch[1];
};

//pulls route data for current room from the routes.json file
export const getRouteData = () => {
    let id = getRoomData().rid;
    if (!id) return;

    let routeData = Object.keys(routes);
    for (var i = 0; i < routeData.length; i++) {
        if (routeData[i] === id) return Object.values(routes)[i];
    }

    return null;
};
