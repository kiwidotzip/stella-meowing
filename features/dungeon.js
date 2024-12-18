import { renderCenteredString } from "../utils/utils"
//import { getRoomName, getRoomID } from "../utils/dutils"
import settings, { roomName } from "../utils/config"

/*  --------------- secret routes ---------------

    A bunch of little dungeon features

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//variables

var lastRoomId = null
var roomNameData = {
    currRoomName: "Nothing :O",
    scale,
    x: 0,
    y: 0
}

//functions

const renderRoomNameEditGui = () => {
    renderCenteredString("Scroll to change the scale", Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 3, 1, false)
}


const renderRoomName = () => {
    let width = Renderer.getStringWidth(roomNameData.currRoomName)
    let height = 11
    let c = settings().roomNameColor
    let [r, g, b, a] = c
    Renderer.retainTransforms(true)
    Renderer.translate(roomNameData.x, roomNameData.y)
    Renderer.scale(roomNameData.scale, roomNameData.scale)
    if (a !== 0) Renderer.drawRect(Renderer.color(r, g, b, a), 0, 0, width, height)
    Renderer.drawStringWithShadow(roomNameData.currRoomName, 2, 11)
    Renderer.retainTransforms(false)
}

//gets current room data
/*
register('step', () => {
    if(settings().showRoomName){
        let roomId = getRoomID()

        if(roomId === null) return

        if (lastRoomId !== roomId) {
            lastRoomId = roomId

            roomNameData.currRoomName = getRoomName()
        }
    }
}).setFps(5)
*/


register("renderOverlay", () => {
    if (roomName.isOpen()) {renderRoomNameEditGui()}
    renderRoomName()
})

/*
register("dragged", (dx, dy, x, y, btn) => {
    if (roomName.isOpen()) {
        roomNameData.x = x
        roomNameData.y = y
    }
})

register("scrolled", (mx, my, dir) => {
    if (!roomName.isOpen()) return
    if (dir == 1) roomNameData.scale += 0.05
    else roomNameData.scale -= 0.05
})
*/