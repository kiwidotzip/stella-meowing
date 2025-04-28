const Color = Java.type("java.awt.Color");

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
