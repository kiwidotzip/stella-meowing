import settings from "../utils/config"

/*  ------------ Terminal Waypoints -------------

    Draws goofy waypoints at secrets

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */


let armor_stand = Java.type("net.minecraft.entity.item.EntityArmorStand")

register("command", () => {
    let stands = World.getAllEntitiesOfType(armor_stand.class)
    stands.forEach(stand => {
        if (!(stand.getName() == "Armor Stand")) {
            ChatLib.chat(`${stand.getName()}&r at &dX: ${stand.getX()} Y: ${stand.getY()} Z: ${stand.getZ()}`)
        }
    })
}).setName("ca_dump_armor_stands")

let terminals = []

register("step", () => {
    if(!settings().termWaypoints) return
    
    terminals = []
    let stands = World.getAllEntitiesOfType(armor_stand.class)
    
    stands.forEach(stand => {
        if (stand.getName().includes("Device") || stand.getName().includes("Terminal") || stand.getName().includes("Not Activated")) {
            terminals.push(stand)
        }
    })
}).setFps(2)

register("renderWorld", () => {
    if(!settings().termWaypoints) return

    terminals.forEach(term => {
        let pos = new Vec3i(term.getX(), term.getY()+1, term.getZ())
        let ppos = new Vec3i(Player.getX(), Player.getY(), Player.getZ())
        let dist = pos.distance(ppos)
        dist = Math.round(dist * 10) / 10
        let str = term.getName() + ` §8(§b${dist}m§8)`
        Tessellator.drawString(str, term.getX(), term.getY()+1, term.getZ())
    })
})