import EventListener from "../../../tska/event/EventListener";
import Location from "../../../tska/skyblock/Location";
import DungeonScanner from "../../../tska/skyblock/dungeon/DungeonScanner";
import Dungeon from "../../../tska/skyblock/dungeon/Dungeon";

/*  -------------- StellaNav Events -------------

    Events for StellaNav

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//item filtering
const EntityItem = Java.type("net.minecraft.entity.item.EntityItem");
const secretItems = new Set([
    "Healing VIII Splash Potion",
    "Healing Potion 8 Splash Potion",
    "Decoy",
    "Inflatable Jerry",
    "Spirit Leap",
    "Trap",
    "Training Weights",
    "Defuse Kit",
    "Dungeon Chest Key",
    "Treasure Talisman",
    "Revive Stone",
    "Architect's First Draft",
]);

EventListener.createEvent("stella:secretCollect");

//right click secrets
register("playerInteract", (action) => {
    if (!Location.inWorld("catacombs")) return;
    if (Dungeon.inBoss()) return;
    if (action.toString() !== "RIGHT_CLICK_BLOCK") return;

    let room = DungeonScanner.getCurrentRoom();

    if (!room) return;

    let block = Player.lookingAt();

    if (!block) return;
    if (!block?.type) return;
    if (block?.getID() === 0) return;

    let pos = [block?.getX(), block?.getY(), block?.getZ()];
    let id = block?.getType().getID();

    let secretpos = room.getRoomCoord(pos);
    let secret = {};

    //send data
    if (id === 54) {
        // Chest
        secret = {
            type: "Chest",
            pos: secretpos,
            room: room.name,
        };
    }
    if (id === 146) {
        // Trapped chest (mimic?)
        secret = {
            type: "Chest",
            pos: secretpos,
            room: room.name,
        };
    }
    if (id === 144) {
        // Skull (wither ess or redstone key)
        secret = {
            type: "Skull",
            pos: secretpos,
            room: room.name,
        };
    }

    if (secret == {}) return;
    if (!secret.type) return;
    if (!secret.pos) return;
    if (!secret.room) return;
    EventListener.post("stella:secretCollect", secret);
});

//bat secrets
register("packetReceived", (packet) => {
    if (!Location.inWorld("catacombs")) return;
    if (Dungeon.inBoss()) return;

    let room = DungeonScanner.getCurrentRoom();

    if (!room) return;

    let sound = packet.func_149212_c();

    if (sound !== "mob.bat.death" && sound !== "mob.bat.hurt") return;

    let secret = {};

    let [x, y, z] = [packet.func_149207_d(), packet.func_149211_e(), packet.func_149210_f()];
    let pos = [Math.round(x), Math.round(y), Math.round(z)];
    let secretpos = room.getRoomCoord(pos);

    secret = {
        type: "Bat",
        pos: secretpos,
        room: room.name,
    };

    if (secret == {}) return;
    if (!secret.type) return;
    if (!secret.pos) return;
    if (!secret.room) return;
    EventListener.post("stella:secretCollect", secret);
}).setFilteredClass(net.minecraft.network.play.server.S29PacketSoundEffect);

//item secrets
let tempItemIdLocs = new Map();

register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
    if (event.entity instanceof EntityItem) {
        tempItemIdLocs.set(event.entity.func_145782_y(), event.entity);
    }
});

register("worldLoad", () => {
    tempItemIdLocs.clear();
});

register("packetReceived", (packet) => {
    let entityID = packet.func_149354_c();

    if (!this.tempItemIdLocs.has(entityID)) return;

    if (!Location.inWorld("catacombs")) return;
    if (Dungeon.inBoss()) return;

    let room = DungeonScanner.getCurrentRoom();

    if (!room) return;

    let entity = tempItemIdLocs.get(entityID);
    let name = entity.func_92059_d()?.func_82833_r();
    let secret = {};

    let e = new Entity(entity);
    let pos = [e.getX(), e.getY(), e.getZ()];
    let secretpos = room.getRoomCoord([Math.round(pos[0]), Math.round(pos[1]), Math.round(pos[2])]);

    if (!name || !secretItems.has(name.removeFormatting())) return;

    secret = {
        type: "Item",
        pos: secretpos,
        room: room.name,
    };

    if (secret == {}) return;
    if (!secret.type) return;
    if (!secret.pos) return;
    if (!secret.room) return;
    EventListener.post("stella:secretCollect", secret);
}).setFilteredClass(net.minecraft.network.play.server.S0DPacketCollectItem);
