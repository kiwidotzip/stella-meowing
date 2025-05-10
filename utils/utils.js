/*  ------------- General Utilities -------------

    General skyblok utilities

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//prefixes
export const prefix = "&d[Stella]";
export const shortPrefix = "&d[SA]";

//check if something is between two numbers
export const isBetween = (number, min, max) => (number - min) * (number - max) <= 0;

//calculates the distance between 2 points using the 3d distance formula
export const calcDistance = (p1, p2) => {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let dist = a * a + b * b + c * c;

    if (dist < 0) {
        dist *= -1;
    }
    return dist;
};

export const formatTime = (time) => {
    let date = new Date(time);
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let seconds = String(date.getSeconds()).padStart(2, "0");
    let milliseconds = String(date.getMilliseconds()).padStart(2, "0");
    let formattedTime = `${minutes}m ${seconds}.${milliseconds}s`;

    return formattedTime;
};

export const GuiContainer = Java.type("net.minecraft.client.gui.inventory.GuiContainer");
const guiContainerLeftField = GuiContainer.class.getDeclaredField("field_147003_i");
const guiContainerTopField = GuiContainer.class.getDeclaredField("field_147009_r");
guiContainerLeftField.setAccessible(true);
guiContainerTopField.setAccessible(true);

//most of this stuff is stolen from bloomcore
/**
 *
 * @param {Number} slotNumber
 * @param {GuiContainer} mcGuiContainer
 * @returns {[Number, Number]}
 */
export const getSlotRenderPosition = (slotNumber, mcGuiContainer) => {
    const guiLeft = guiContainerLeftField.get(mcGuiContainer);
    const guiTop = guiContainerTopField.get(mcGuiContainer);

    const slot = mcGuiContainer.field_147002_h.func_75139_a(slotNumber);

    return [guiLeft + slot.field_75223_e, guiTop + slot.field_75221_f];
};

/**
 *
 * @param {GuiContainer} gui - The GuiContainer to render inside of
 * @param {Number} slotIndex - The slot index
 * @param {Number} r - 0-1
 * @param {Number} g - 0-1
 * @param {Number} b - 0-1
 * @param {Number} a - 0-1
 * @param {Boolean} aboveItem - Hightlight in front of the item in the slot
 * @param {Number} z - The z position for the highlight to be rendered. Will override the aboveItem parameter if used.
 * yes this is taken from BloomCore
 */
export const highlightSlot = (gui, slotIndex, r, g, b, a, aboveItem = false, z = null) => {
    if (!(gui instanceof GuiContainer)) return;

    const [x, y] = getSlotRenderPosition(slotIndex, gui);

    let zPosition = 245;
    if (aboveItem) zPosition = 241;
    if (z !== null) zPosition = z;

    Renderer.translate(x, y, zPosition);
    Renderer.drawRect(Renderer.color(r * 255, g * 255, b * 255, a * 255), 0, 0, 16, 16);
    Renderer.finishDraw();
};

//outlines slot
export const outlineSlot = (gui, slotIndex, r, g, b, a, lw = 1, aboveItem = false, z = null) => {
    if (!(gui instanceof GuiContainer)) return;

    const [x, y] = getSlotRenderPosition(slotIndex, gui);

    let zPosition = 245;
    if (aboveItem) zPosition = 241;
    if (z !== null) zPosition = z;

    Renderer.retainTransforms(true);
    Renderer.translate(x, y, zPosition);
    Renderer.drawRect(Renderer.color(r * 255, g * 255, b * 255, a * 255), 0, 0, lw, 16);
    Renderer.drawRect(Renderer.color(r * 255, g * 255, b * 255, a * 255), 0, 0, 16, lw);
    Renderer.drawRect(Renderer.color(r * 255, g * 255, b * 255, a * 255), 0, 16 - lw, 16, lw);
    Renderer.drawRect(Renderer.color(r * 255, g * 255, b * 255, a * 255), 16 - lw, 0, lw, 16);
    Renderer.retainTransforms(false);
    Renderer.finishDraw();
};

export const drawLineBetweenSlots = (gui, slot1Index, slot2Index, r, g, b, a, lw = 1, aboveItem = false, z = null) => {
    if (!(gui instanceof GuiContainer)) return;

    const [x1, y1] = getSlotRenderPosition(slot1Index, gui);
    const [x2, y2] = getSlotRenderPosition(slot2Index, gui);

    let zPosition = 245;
    if (aboveItem) zPosition = 241;
    if (z !== null) zPosition = z;

    Renderer.translate(0, 0, zPosition);
    Renderer.drawLine(Renderer.color(r * 255, g * 255, b * 255, a * 255), x1 + 8, y1 + 8, x2 + 8, y2 + 8, lw);
};
