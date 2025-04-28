const Color = Java.type("java.awt.Color");

export const greenCheck = new Image("NEUMapGreenCheck.png", "./stellanav/clear/NEUMapGreenCheck.png");
export const whiteCheck = new Image("NEUMapWhiteCheck.png", "./stellanav/clear/NEUMapWhiteCheck.png");
export const failedRoom = new Image("NEUMapFailedRoom.png", "./stellanav/clear/NEUMapFailedRoom.png");
export const questionMark = new Image("NEUMapQuestionMark.png", "./stellanav/clear/NEUMapQuestionMark.png");

export const GreenMarker = new Image("markerSelf.png", "./stellanav/markerSelf.png");
export const WhiteMarker = new Image("markerOther.png", "./stellanav/markerOther.png");

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

/*export const renderMap = (mapData) => {
    Client.getMinecraft().field_71460_t.func_147701_i().func_148250_a(mapData, true);
};
*/

export const roomTypes = {
    63: "Normal",
    30: "Entrance",
    74: "Yellow",
    18: "Blood",
    66: "Puzzle",
    62: "Trap",
};
