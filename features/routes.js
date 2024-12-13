import { getRealCoord, getRoomID, getRoomWorldData, getRouteData, getRoomData, inDungeon, getRoomCoord, routes } from "../utils/dutils"
import { drawBoxAtBlock, drawFilledBox, drawLine } from "../utils/renderUtils"
import { calcDistance, drawLineParticles, drawString } from "../utils/utils"
import settings from "../utils/config"

/*  --------------- secret routes ---------------

    the main point of this mod

    ------------------- To Do -------------------

    -rendering multible steps at once (is this even nececary)
    -keybinds

    --------------------------------------------- */


//item filtering
const EntityItem = Java.type("net.minecraft.entity.item.EntityItem")
const secretItems = new Set(["Healing VIII Splash Potion", "Healing Potion 8 Splash Potion", "Decoy", "Inflatable Jerry", "Spirit Leap", "Trap", "Training Weights", "Defuse Kit", "Dungeon Chest Key", "Treasure Talisman", "Revive Stone", "Architect's First Draft"])

//set keybinds
/*
let nStep = new KeyBind("Next Step", settings().nextStep, "Eclipse Addons")
let lStep = new KeyBind("Last Step", settings().lastStep, "Eclipse Addons")
let rStep = new KeyBind("Reset Route", settings().resetStep, "Eclipse Addons")
*/

//general variables
var lastRoomId = null
var currRouteData = null
var currRoomData = null
var step = 0
var indungeon = false;

//recording variables
var route = {}
var recordingData = {locations:[], mines:[], etherwarps:[], tnts:[], interacts:[], secret:{type:null, location:null}}
var playerloc = null;
var roomRID = null
var recording = false;

//functions for rendering

//resets the rooms current route
function reset() {
    //resets route
    step = 0;
    currRouteData = getRouteData()

    //refreshes keybinds
    /*
    nStep.getKeyCode(settings().nextStep)
    lStep.getKeyCode(settings().lastStep)
    rStep.getKeyCode(settings().resetStep)
    */
}

//functions for recording

//adds a recording point
function addPoint(realpos, type){
    let pos = getRoomCoord(realpos, currRoomData)

    if(type === "location"){
        recordingData.locations.push(pos)
    }

    if(type === "etherwarp"){
        for(var i = 0; i < recordingData.etherwarps.length; i ++){
           let [x, y, z] = [recordingData.etherwarps[i][0], recordingData.etherwarps[i][1], recordingData.etherwarps[i][2]]
            if(x === pos[0] && y === pos[1] && z === pos[2]) return
        }
        recordingData.etherwarps.push(pos)
    }

    if(type === "tnt"){
        for(var i = 0; i < recordingData.tnts.length; i ++){
            let [x, y, z] = [recordingData.tnts[i][0], recordingData.tnts[i][1], recordingData.tnts[i][2]]
            let distance = calcDistance(pos, [x, y, z])
            
            if(distance < 5) return
         }
        recordingData.tnts.push([Math.round(pos[0]),Math.round(pos[1]),Math.round(pos[2])])
    }

    if(type === "mine"){
        for(var i = 0; i < recordingData.mines.length; i ++){
            let [x, y, z] = [recordingData.mines[i][0], recordingData.mines[i][1], recordingData.mines[i][2]]
             if(x === pos[0] && y === pos[1] && z === pos[2]) return
         }
        recordingData.mines.push(pos)
    }

    if(type === "interact"){
        for(var i = 0; i < recordingData.interacts.length; i ++){
            let [x, y, z] = [recordingData.interacts[i][0], recordingData.interacts[i][1], recordingData.interacts[i][2]]
             if(x === pos[0] && y === pos[1] && z === pos[2]) return
         }
        recordingData.interacts.push(pos)
    }

    if(type === "secretInteract"){
        recordingData.secret.type = "interact"
        recordingData.secret.location = pos
    }

    if(type === "secretItem"){
        recordingData.secret.type = "item"
        recordingData.secret.location = pos
    }

    if(type === "secretBat"){
        recordingData.secret.type = "bat"
        recordingData.secret.location = pos
    }
}

//stops the recording
function stopRecording(){
    recordingData = {locations:[], mines:[], etherwarps:[], tnts:[], interacts:[], secret:{type:null, location:null}}
    recording = false
    playerloc = null
    route = {}
    step = 0
    ChatLib.chat('&aStopped Recording!')
}

//pushes current step to route
function pushToRoute(){
    if(!route[roomRID]) route[roomRID] = [recordingData]
    else route[roomRID].push(recordingData)
    recordingData = {locations:[], mines:[], etherwarps:[], tnts:[], interacts:[], secret:{type:null, location:null}}
    step ++;
}

//saves the route to the routes file (eventually to a seperate routes file with the players name on it)
function saveRoute(force){
    let routeData = Object.keys(routes)
    if(!force){
        for(var i = 0; i < routeData.length; i++){
            if(routeData[i] === roomRID){
                ChatLib.chat("&cError: Route already exists!")
                let yes = new TextComponent("&eOverride? &l&aYes").setClick("run_command", "/route route_save_force")
                yes.chat()
                let no = new TextComponent("&eOverride? &l&cNo").setClick("run_command", "/route stop")
                no.chat()
                return
            }
        }
    }
    routes[roomRID] = route[roomRID]
    FileLib.write("eclipseAddons", "data/routes.json", JSON.stringify(routes,undefined,4))
    if(force) ChatLib.chat('&aOverwritten!')
    else ChatLib.chat('&aSaved!')
    stopRecording()
    reset()
}

//more functions

//gets room data
register('step', () => {
    let roomId = getRoomID()

    if(roomId === null) return


    if (lastRoomId !== roomId) {
        lastRoomId = roomId

        currRoomData = getRoomWorldData();
        currRouteData = getRouteData();
        roomRID = getRoomData().rid
        if(recording){
            ChatLib.chat('&cError: Left current room!')
            stopRecording()
        }
        //if(currRouteData === null){ ChatLib.chat("No route data");}
        //if(currRoomData === null){ ChatLib.chat("No room data");}
        step = 0;

    }

}).setFps(5)

//draws boxes
register("renderWorld", () => {
    if(inDungeon()) {
        indungeon = true
    } else {
        //reseting variables
        indungeon = false
        currRouteData = null
        currRoomData = null
        step = 0
    }
    
    if(!indungeon) return

    //route rendering
    if(settings().modEnabled && !recording){ 
        if(currRouteData !== null){
            if(step < currRouteData.length){
                for(var i = 0; i  < currRouteData[step].locations.length; i++){
                let [ x, y, z ] = getRealCoord(currRouteData[step].locations[i], currRoomData)

                    if(i === 0 && step === 0){
                        drawString("Start",x + 0.5, y + 1.5, z + 0.5, 0xffffff, true, 0.03, false)
                    }

                    if(i + 1 < currRouteData[step].locations.length ){
                        let [ x2, y2, z2 ] = getRealCoord(currRouteData[step].locations[i + 1], currRoomData)
                        let [r, g, b] = [settings().lineColor[0] / 255, settings().lineColor[1] / 255, settings().lineColor[2] / 255]

                        if(settings().lineType === 1) drawLine(x + 0.5, y + 0.5, z + 0.5, x2 + 0.5, y2 + 0.5, z2 + 0.5, r, g, b, settings().lineWidth);
                    }     
                }

                for(var i = 0; i  < currRouteData[step].mines.length; i++){
                    let [ x, y, z ] = getRealCoord(currRouteData[step].mines[i], currRoomData)
                    let [r, g, b] = [settings().mineColor[0] / 255, settings().mineColor[1] / 255, settings().mineColor[2] / 255]

                    drawBoxAtBlock(x, y, z, r, g, b, 1, 1)   

                    if(i === 0){
                        if(settings().showText) drawString("Break",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)
                    }
                }
                
                for(var i = 0; i  < currRouteData[step].etherwarps.length; i++){
                    let [ x, y, z ] = getRealCoord(currRouteData[step].etherwarps[i], currRoomData)
                    let [r, g, b] = [settings().warpColor[0] / 255, settings().warpColor[1] / 255, settings().warpColor[2] / 255]

                    drawFilledBox(x + 0.5, y, z + 0.5, 1, 1, r, g, b, 30 / 255, false)
                    drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
                    if(settings().showText) drawString("Warp",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)      
                }

                for(var i = 0; i  < currRouteData[step].tnts.length; i++){
                    let [ x, y, z ] = getRealCoord(currRouteData[step].tnts[i], currRoomData)
                    let [r, g, b] = [settings().tntColor[0] / 255, settings().tntColor[1] / 255, settings().tntColor[2] / 255]

                    drawFilledBox(x + 0.5, y, z + 0.5, 1, 1, r, g, b, 30 / 255, false)
                    drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
                    if(settings().showText) drawString("BOOM",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)   
                }
                
                for(var i = 0; i  < currRouteData[step].interacts.length; i++){
                    let [ x, y, z ] = getRealCoord(currRouteData[step].interacts[i], currRoomData)
                    let [r, g, b] = [settings().clickColor[0] / 255, settings().clickColor[1] / 255, settings().clickColor[2] / 255]

                    drawFilledBox(x + 0.5, y, z + 0.5, 1, 1, r, g, b, 30 / 255, false)
                    drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
                    if(settings().showText) drawString("Click",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)
                }
                
                if(currRouteData[step].secret !== null){
                    let [ x, y, z ] = getRealCoord(currRouteData[step].secret.location, currRoomData)
                    let [r, g, b] = [settings().secretColor[0] / 255, settings().secretColor[1] / 255, settings().secretColor[2] / 255]

                    if(settings().showText) drawString(currRouteData[step].secret.type, x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)
                    if(settings().boxSecrets) drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
                }

            }
        
        }
    }

    //rendering for routes being recorded
    if(recording){
        if(recordingData.locations !== null){  
            for(var i = 0; i  < recordingData.locations.length; i++){
                let [ x, y, z ] = getRealCoord(recordingData.locations[i], currRoomData)
    
                if(i === 0 && step === 0){
                    drawString("Start",x + 0.5, y + 1.5, z + 0.5, 0xffffff, true, 0.03, false)
                }
    
                if(i + 1 < recordingData.locations.length ){
                    let [ x2, y2, z2 ] = getRealCoord(recordingData.locations[i + 1], currRoomData)
                    let [r, g, b] = [settings().lineColor[0] / 255, settings().lineColor[1] / 255, settings().lineColor[2] / 255]
    
                    if(settings().lineType === 1) drawLine(x + 0.5, y + 0.5, z + 0.5, x2 + 0.5, y2 + 0.5, z2 + 0.5, r, g, b, settings().lineWidth);
                }     
            }
        }
    
        if(recordingData.etherwarps !== null){    
            for(var i = 0; i  < recordingData.etherwarps.length; i++){
                let [ x, y, z ] = getRealCoord(recordingData.etherwarps[i], currRoomData)
                let [r, g, b] = [settings().warpColor[0] / 255, settings().warpColor[1] / 255, settings().warpColor[2] / 255]
    
                drawFilledBox(x + 0.5, y, z + 0.5, 1, 1, r, g, b, 30 / 255, false)
                drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
                if(settings().showText) drawString("Warp",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)      
            }
        }
    
        if(recordingData.tnts !== null){ 
            for(var i = 0; i  < recordingData.tnts.length; i++){
                let [ x, y, z ] = getRealCoord(recordingData.tnts[i], currRoomData)
                let [r, g, b] = [settings().tntColor[0] / 255, settings().tntColor[1] / 255, settings().tntColor[2] / 255]
    
                drawFilledBox(x + 0.5, y, z + 0.5, 1, 1, r, g, b, 30 / 255, false)
                drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
                if(settings().showText) drawString("BOOM",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)  
            } 
        }

        if(recordingData.interacts !== null){ 
            for(var i = 0; i  < recordingData.interacts.length; i++){
                let [ x, y, z ] = getRealCoord(recordingData.interacts[i], currRoomData)
                let [r, g, b] = [settings().clickColor[0] / 255, settings().clickColor[1] / 255, settings().clickColor[2] / 255]

                drawBoxAtBlock(x, y, z, r, g, b, 1, 1)   
                if(settings().showText) drawString("Click",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)
            }
        }
    
        if(recordingData.mines !== null){ 
            for(var i = 0; i  < recordingData.mines.length; i++){
                let [ x, y, z ] = getRealCoord(recordingData.mines[i], currRoomData)
                let [r, g, b] = [settings().mineColor[0] / 255, settings().mineColor[1] / 255, settings().mineColor[2] / 255]
    
                drawBoxAtBlock(x, y, z, r, g, b, 1, 1)   
    
                if(i === 0){
                    if(settings().showText) drawString("Break",x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)
                }
            }
        }
        
        if(Object.keys(route).length !== 0){
            let [ x, y, z ] = getRealCoord(route[roomRID][step -1].secret.location, currRoomData)
            let [r, g, b] = [settings().secretColor[0] / 255, settings().secretColor[1] / 255, settings().secretColor[2] / 255]
    
            if(settings().showText) drawString(route[roomRID][step -1].secret.type, x + 0.5, y + 0.6, z + 0.5, 0xffffff, true, 0.03, false)
            if(settings().boxSecrets) drawBoxAtBlock(x, y, z, r, g, b, 1, 1)
        }
    }
})

//draws particle lines
register('step', () => {
    //normal line
    if(settings().modEnabled && settings().lineType === 0 && indungeon && !recording){ 
        if(currRouteData !== null){
            if(step < currRouteData.length){
                for(var i = 0; i  < currRouteData[step].locations.length; i++){
                let [ x, y, z ] = getRealCoord(currRouteData[step].locations[i], currRoomData)
                    if(i + 1 < currRouteData[step].locations.length ){
                        let [ x2, y2, z2 ] = getRealCoord(currRouteData[step].locations[i + 1], currRoomData)
                        drawLineParticles([x + 1, y + 0.5, z + 1], [x2 + 1, y2 + 0.5, z2 + 1])
                    }     
                }
            }
        }
    }

    //recording line
    if(recording){
        if(recordingData.locations !== null){  
            for(var i = 0; i  < recordingData.locations.length; i++){
                let [ x, y, z ] = getRealCoord(recordingData.locations[i], currRoomData)
    
                if(i + 1 < recordingData.locations.length ){
                    let [ x2, y2, z2 ] = getRealCoord(recordingData.locations[i + 1], currRoomData)
    
                    if(settings().lineType === 0) drawLineParticles([x + 1, y + 0.5, z + 1], [x2 + 1, y2 + 0.5, z2 + 1])
                }  
            }   
        }
    }
}).setFps(5)

//checks if a player is opening current secret
register("playerInteract", (action) => {

    //normal interacts
    if(currRouteData !== null && !recording){
        if(step < currRouteData.length){
            if (action.toString() !== "RIGHT_CLICK_BLOCK") return
            if (currRouteData[step].secret.type !== "interact") return

            let secretPos = getRealCoord(currRouteData[step].secret.location, currRoomData)

            let pos = [Player.lookingAt().getX(), Player.lookingAt().getY(), Player.lookingAt().getZ()]
            let id = Player.lookingAt().getType().getID()

            if(pos[0] === secretPos[0] && pos[1] === secretPos[1] && pos[2] === secretPos[2]){
                if (id === 54) { // Chest
                    step ++;
                }
                if (id === 146) { // Trapped chest (mimic?)
                    step ++;
                }
                if (id === 144) { // Skull (wither ess or redstone key)
                    step ++;
                }
            }
        }
    }

    //recording interacts
    if(recording){
        if(recording){
            if (action.toString() !== "RIGHT_CLICK_BLOCK") return
    
            let pos = [Player.lookingAt().getX(), Player.lookingAt().getY(), Player.lookingAt().getZ()]
            let id = Player.lookingAt().getType().getID()
    
            if (id === 54) { // Chest
                addPoint(pos, "secretInteract")
                pushToRoute()
            }

            if (id === 146) { // Trapped chest (mimic?)
                addPoint(pos, "secretInteract")
                pushToRoute()
            }

            if (id === 144) { // Skull (wither ess or redstone key)
                addPoint(pos, "secretInteract")
                pushToRoute()
            }
            
            if (id === 69){ // Lever
                addPoint(pos, "interact")
            }
                
        }
    }
})

//adds points for varias actions
register("soundPlay",  (pos, name) => {
    if(!recording) return

    let nameSplitted = name.split(".")

    if (name === "mob.enderdragon.hit") { //etherwarp
        let loc = [pos.x - 0.5, pos.y - 1, pos.z - 0.5]
        addPoint(loc, "etherwarp")
    }

    if (name === "random.explode") { //tnt
        let boom = ["boom TNT", "Explosive Bow"]
        if(!boom.some(i => Player?.getHeldItem()?.getName()?.includes(i))) return
        let loc = [pos.x - 0.5, pos.y - 0.5, pos.z - 0.5]
        addPoint(loc, "tnt")
    }
    
    if (nameSplitted[0] === "dig") { //mining block
        let loc = [pos.x - 0.5, pos.y - 0.5, pos.z - 0.5]
        addPoint(loc, "mine")
    }
    
    if (name === "mob.bat.death") {
        let loc = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)]
        addPoint(loc, "secretBat")
        pushToRoute()
    }

});


//item detection (still need to tweak sense)

//borrowed from bettermap
let tempItemIdLocs = new Map()

register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
    if (event.entity instanceof EntityItem) {
        tempItemIdLocs.set(event.entity.func_145782_y(), event.entity)
    }
})

register("worldLoad", () => {
    tempItemIdLocs.clear()
})

//Thanks DocilElm for all your help with this

register("packetReceived", (packet) => {
    let entityID = packet.func_149354_c()

    if(!this.tempItemIdLocs.has(entityID)) return

    let entity = tempItemIdLocs.get(entityID)
    let name = entity.func_92059_d()?.func_82833_r()

    let e = new Entity(entity)
    let pos = [e.getX(), e.getY(), e.getZ()]

    if (!name || !secretItems.has(name.removeFormatting())){
        ChatLib.chat("Not a secret")
        return
    }

    //normal item detection
    if(currRouteData !== null && !recording){
        if(step < currRouteData.length){
            if (currRouteData[step].secret.type !== "item") return

            let secretPos = getRealCoord(currRouteData[step].secret.location, currRoomData)
            let distance = calcDistance(pos, secretPos)

            ChatLib.chat(distance)

            if(distance < 5){ step ++}  
        }
    }

    //recording item detection
    if(recording){
        ChatLib.chat("item picked up")
        let posRound = [Math.round(pos[0]), Math.round(pos[1]), Math.round(pos[2])]
        let playerPos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1]
        let pdistance = calcDistance(playerPos, posRound)

        ChatLib.chat(JSON.stringify(posRound,undefined,2))
        if(Object.keys(route).length !== 0){
            ChatLib.chat("distance check")
            let secretPos = getRealCoord(route[roomRID][step -1].secret.location, currRoomData)
            ChatLib.chat(JSON.stringify(secretPos,undefined,2))
            let distance = calcDistance(posRound, secretPos)
            ChatLib.chat(distance)

            if(distance > 5){
                if(pdistance > 5) addPoint(playerPos, "secretItem")
                else addPoint(pos, "secretItem") 
                
                pushToRoute()
                ChatLib.chat("item added!")
            } 
        } 

        else{
            if(pdistance > 5) addPoint(playerPos, "secretItem")
            else addPoint(pos, "secretItem")

            pushToRoute()
            ChatLib.chat("item added!")
        }
    }
}).setFilteredClass(net.minecraft.network.play.server.S0DPacketCollectItem)

//bat detection (easyest part imo)
register("renderWorld", () => {
    if(currRouteData !== null){ 
        if(step < currRouteData.length){
            if(currRouteData[step].secret.type !== "bat") return

            let pos = [Player.getX(), Player.getY(), Player.getZ()]
            let secretPos = getRealCoord(currRouteData[step].secret.location, currRoomData)
            let distance = calcDistance(pos, secretPos)

            if( distance < 4){step ++}
        }
    }
})

//draws line points for route recording
register('step', () => {
    if(!recording) return
    let loc = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1]

    let distance = null;

    if(playerloc !== null) distance = calcDistance(loc, playerloc)
    
    if(distance > 2 || playerloc === null){
        playerloc = loc
        addPoint(loc, "location")
    }


}).setFps(2)

//keybind uses

//if (nStep.isPressed()){ step ++; ChatLib.chat('&aShowing next step!') }
//if (lStep.isPressed()){ step --; ChatLib.chat('&aShowing last step!') }
//if (rStep.isPressed()){ reset(); }

//debug commands
register("command", (...args) => {
    if (args[0] === 'next') step ++;
    else if (args[0] === 'back') step --;
    else if (args[0] === 'reset') reset();
    else if (args[0] === "room"){
        ChatLib.chat(JSON.stringify(getRoomData(), undefined, 2));
        if(!getRoomData()) return
        ChatLib.chat(JSON.stringify(getRoomWorldData(), undefined, 2));
    }
    else if (args[0] === "route"){
        ChatLib.chat(JSON.stringify(getRouteData(), undefined, 2));
    }
    else if (args[0] === 'help') {
        ChatLib.chat('&8&m-------------------------------------------------');
        ChatLib.chat('&6/srdb help &7Opens the SRM Debug help menu!')
        ChatLib.chat('&6/srdb room &7Displays current room information!')
        ChatLib.chat('&6/srdb route &7Displays current secret route information!')
        ChatLib.chat('&6/srdb next &7Goes to the next route step!')
        ChatLib.chat('&6/srdb back &7Goes to the last route step!')
        ChatLib.chat('&6/srdb reset &7resets back to the first step!')
        ChatLib.chat('&8&m-------------------------------------------------');
    } 
    else {
        ChatLib.chat('&cUnknown command. &7Try &6/srdb help &7for a list of commands')
    }
}).setName("srdb");

//route recording commands
register("command", (...args) => {
    if (args[0] === 'record'){
        if(!inDungeon()) {ChatLib.chat('&cError: Not in dungeon!'); return}
        if(recording) ChatLib.chat('&cError: Already recording!')
        if(!recording) {recording = true; ChatLib.chat('&aRecording!')}
        
    }

    else if (args[0] === 'stop'){
        if(!inDungeon()) {ChatLib.chat('&cError: Not in dungeon!'); return}
        if(!recording) ChatLib.chat('&cError: Not recording!')
        if(recording) stopRecording()
    }

    else if (args[0] === 'save'){
        if(!inDungeon()) {ChatLib.chat('&cError: Not in dungeon!'); return}
        if(!recording) ChatLib.chat('&cError: Not recording!')
        if(recording){
            saveRoute(false)
        }
    }

    else if (args[0] === 'bat'){
        if(!inDungeon()) {ChatLib.chat('&cError: Not in dungeon!'); return}
        if(!recording) ChatLib.chat('&cError: Not recording!')
        if(recording){
            let pos = [Math.round(Player.getX() + 0.25) - 1, Math.round(Player.getY()), Math.round(Player.getZ() + 0.25) - 1]
            addPoint(pos, "secretBat")
            pushToRoute()
        }
    }
    else if (args[0] === 'route_save_force'){
        if(!inDungeon()) {ChatLib.chat('&cError: Not in dungeon!'); return}
        if(!recording) ChatLib.chat('&cError: Not recording!')
        if(recording){
            saveRoute(true)
        }
    }

    else if (args[0] === 'help') {
        ChatLib.chat('&8&m-------------------------------------------------');
        ChatLib.chat('&6/srdb help &7Opens the SRM Debug help menu!')
        ChatLib.chat('&6/srdb room &7Displays current room information!')
        ChatLib.chat('&6/srdb route &7Displays current secret route information!')
        ChatLib.chat('&6/srdb next &7Goes to the next route step!')
        ChatLib.chat('&6/srdb back &7Goes to the last route step!')
        ChatLib.chat('&6/srdb reset &7resets back to the first step!')
        ChatLib.chat('&8&m-------------------------------------------------');
    } 
    else {
        ChatLib.chat('&cUnknown command. &7Try &6/route help &7for a list of commands')
    }
}).setName("route");