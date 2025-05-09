import { LocalStore } from "../../tska/storage/LocalStore";
import { FeatManager } from "../utils/helpers";
import { prefix, outlineSlot } from "../utils/utils";

const data = new LocalStore(
    "stella",
    {
        binds: {},
    },
    "./data/stella-binds.json"
);

const slotBinnding = FeatManager.createFeature("slotBinding");

const bindingKeybind = new KeyBind("Bind Slots", Keyboard.KEY_NONE, "Stella");

let previousSlot = null;

const getPlayerController = () => Client.getMinecraft().field_71442_b;

const handleShiftClick = (slotClicked) => {
    let slot = slotClicked;
    const container = Player.getContainer();
    if (slot > 35) {
        slot = Object.keys(data.binds).find((key) => data.binds[key] === slotClicked);
        ChatLib.chat(`${prefix} &bGoofy ${slot}`);
    }
    const hotbarSlot = data.binds[slot] % 36;

    if (hotbarSlot == null || hotbarSlot >= 9) return;

    getPlayerController().func_78753_a(container.getWindowId(), slot, hotbarSlot, 2, Player.getPlayer());
};

slotBinnding.register("guiMouseClick", (_, __, mbtn, gui, event) => {
    if (mbtn !== 0 || !(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) return;

    const slot = gui.getSlotUnderMouse()?.field_75222_d;
    ChatLib.chat(`${prefix} &bSlot: &6${slot}`);

    // 0 - 4 crafting slots
    if (!slot || slot < 5) return;

    if (previousSlot && (slot < 36 || slot > 44)) {
        ChatLib.chat(`${prefix} &cPlease click a valid hotbar slot!`);
        previousSlot = null;

        return;
    }

    if (Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)) {
        if (slot in data.binds || Object.values(data.binds).includes(slot)) {
            ChatLib.chat(`${prefix} &cThis slot is bound to something!`);
            cancel(event);
            handleShiftClick(slot);
            return;
        }
    }

    if (!Keyboard.isKeyDown(bindingKeybind.getKeyCode())) return;

    if (!previousSlot) previousSlot = slot;

    if (!(slot in data.binds) && !previousSlot) {
        data.binds[slot] = null;
        data.save();
    }

    cancel(event);

    if (slot === previousSlot) return;

    data.binds[previousSlot] = slot;

    data.save();

    ChatLib.chat(`${prefix} &bSaved binding&r: &6${previousSlot} &5-> &6${slot}`);

    previousSlot = null;
});

slotBinnding.register("guiRender", (mx, mt, gui) => {
    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) return;
    let [r, g, b, a] = [0, 0, 255, 255];
    for (let slot of Object.keys(data.binds)) {
        outlineSlot(gui, slot, r, g, b, a, 1, false);
        outlineSlot(gui, data.binds[slot], r, g, b, a, 1, false);
    }

    if (previousSlot) {
        let inv = Player.getContainer();
        for (let i = 0; i < inv.getSize(); i++) {
            if (i > 35 || i == previousSlot) continue;
            highlightSlot(gui, i, 1, 0, 0, 1, false);
        }
    }
});

register("command", (slotNumber) => {
    const slot = parseInt(slotNumber);
    if (!(slot in data.binds)) return ChatLib.chat(`${prefix} &cPlease set a valid slot! &7slots&r: &b${Object.keys(data.binds).join(", &b")}`);

    delete data.binds[slot];
    data.save();

    ChatLib.chat(`${prefix} &bBinding with slot &5${slot} &bdeleted`);
}).setName("deletebinding");
