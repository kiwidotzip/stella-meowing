import { highlightSlot, renderCenteredString } from "../utils/utils"
import { getRoomName, getRoomID, inDungeon} from "../utils/dutils"
import settings, { roomName } from "../utils/config"
import PogObject from "../../PogData";

/*  --------------- secret routes ---------------

    A bunch of little dungeon features

    ------------------- To Do -------------------

    - Doccument how gui works

    --------------------------------------------- */

//variables
let trashItems = [
    "Healing VIII Splash Potion",
    "Healing Potion 8 Splash Potion", 
    "Training Weights",
    "Defuse Kit", 
    "Revive Stone",
    "Premium Flesh",
    "Grunt",
    "Rotten",
    "Lord",
    "Master",
    "Machine Gun Shortbow",
    "Dreadlord Sword",
    "Earth Shard",
    "Bouncy",
    "Heavy",
    "Soldier",
    "Sniper",
    "Commander",
    "Knight",
    "Rune"
]

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

//renders guis
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

//update guis
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

//highlihgt trash
register("guiRender", (mx, mt, gui) => {    
    if(settings().highlightTrash){
        let inv = Player.getContainer()
        let [r, g, b, a] = [settings().trashColor[0] / 255, settings().trashColor[1] / 255, settings().trashColor[2] / 255, settings().trashColor[3] / 255]
        let shops = ["Booster Cookie", "Ophelia", "Trades"]        
        if(shops.some(k => inv?.getName()?.includes(k))){
            let test = "Training Weights x1"
            for(var i = 0; i < inv.getSize(); i ++){
                let item = inv?.getStackInSlot(i)?.getName()
                if(item != null){
                    if(trashItems.some(j => item.includes(j))){
                        highlightSlot(gui, i, r, g, b, a, false)
                    }
                }
            }
        }
    }
})