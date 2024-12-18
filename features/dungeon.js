import { renderCenteredString } from "../utils/utils"
import { getRoomName, getRoomID, inDungeon} from "../utils/dutils"
import settings, { roomName } from "../utils/config"
import PogObject from "../../PogData";

/*  --------------- secret routes ---------------

    A bunch of little dungeon features

    ------------------- To Do -------------------

    - Doccument how gui works

    --------------------------------------------- */

//variables

const rGui = new PogObject("eclipseAddons", {
    X: Renderer.screen.getWidth() / 2,
    Y: Renderer.screen.getHeight() / 2,
    scale: 1
});

var lastRoomId = null
var currRoomName = "Room Not Found"
//functions

const renderRoomNameEditGui = () => {
    renderCenteredString("&6Scroll &rto change the scale", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 3, 1, false)
}

const renderRoomName = () => {
    let width = Renderer.getStringWidth(currRoomName)
    let height = 11
    let c = settings().roomNameColor
    let [r, g, b, a] = c
    Renderer.retainTransforms(true)
    Renderer.translate(rGui.X, rGui.Y)
    Renderer.scale(rGui.scale, rGui.scale)
    if (a !== 0) Renderer.drawRect(Renderer.color(r, g, b, a), -1, -1, width+2, height)
    Renderer.drawString(currRoomName, 0, 0)
    Renderer.retainTransforms(false)
}

//gets current room name
register('step', () => {
    if(settings().showRoomName){
        let roomId = getRoomID()

        if(roomId === null) return

        if (lastRoomId !== roomId) {
            lastRoomId = roomId

            currRoomName = getRoomName()
        }
    }
}).setFps(20)

register("renderOverlay", () => {
    if (roomName.isOpen()) {
        renderRoomNameEditGui()
        renderRoomName()
    }

    if(settings().showRoomName && inDungeon()){
        renderRoomName()
    }

    if(!inDungeon) currRoomName = "Room Not Found"
})

register("dragged", (dx, dy, x, y, btn) => {
    if (roomName.isOpen()) {
        rGui.X = x
        rGui.Y = y
        rGui.save()
    }
})

register("scrolled", (mx, my, dir) => {
    if (!roomName.isOpen()) return
    if (dir == 1) rGui.scale += 0.05
    else rGui.scale -= 0.05
    rGui.save()
})