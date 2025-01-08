const MCTessellator = net.minecraft.client.renderer.Tessellator.func_178181_a();
const DefaultVertexFormats =
  net.minecraft.client.renderer.vertex.DefaultVertexFormats;
const WorldRenderer = MCTessellator.func_178180_c();
const EnumParticleTypes = Java.type("net.minecraft.util.EnumParticleTypes");
const GuiContainer = Java.type(
  "net.minecraft.client.gui.inventory.GuiContainer"
);

/*  ------------- General Utilities -------------

    General skyblok utilities

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

/**
 * - Chattrigger's Tessellator.drawString() with depth check and multiline and shadow
 * - Renders floating lines of text in the 3D world at a specific position.
 *
 * @param {String} text The text to render
 * @param {Number} x X coordinate in the game world
 * @param {Number} y Y coordinate in the game world
 * @param {Number} z Z coordinate in the game world
 * @param {Number} color the color of the text
 * @param {Boolean} renderBlackBox
 * @param {Number} scale the scale of the text
 * @param {Boolean} increase whether to scale the text up as the player moves away
 * @param {Boolean} shadow whether to render shadow
 * @param {Boolean} depth whether to render through walls
 */
export function drawString(
  text,
  x,
  y,
  z,
  color = 0xffffff,
  renderBlackBox = true,
  scale = 1,
  increase = true,
  shadow = true,
  depth = true
) {
  ({ x, y, z } = Tessellator.getRenderPos(x, y, z));

  const lText = text.addColor();

  const lScale = increase
    ? scale * 0.45 * (Math.sqrt(x ** 2 + y ** 2 + z ** 2) / 120) //increase up to 120 blocks away
    : scale;
  const xMulti =
    Client.getMinecraft().field_71474_y.field_74320_O == 2 ? -1 : 1; //perspective

  GlStateManager.func_179131_c(1, 1, 1, 0.5); // color
  GlStateManager.func_179094_E(); // pushmatrix

  GlStateManager.func_179137_b(x, y, z); // translate
  GlStateManager.func_179114_b(
    -Renderer.getRenderManager().field_78735_i,
    0,
    1,
    0
  ); // rotate
  GlStateManager.func_179114_b(
    Renderer.getRenderManager().field_78732_j * xMulti,
    1,
    0,
    0
  ); // rotate

  GlStateManager.func_179152_a(-lScale, -lScale, lScale); // scale
  GlStateManager.func_179140_f(); //disableLighting
  GlStateManager.func_179132_a(false); //depthMask

  if (depth) GlStateManager.func_179097_i(); // disableDepth

  GlStateManager.func_179147_l(); // enableBlend
  GlStateManager.func_179112_b(770, 771); // blendFunc

  const lines = lText.split("\n");
  const l = lines.length;
  const maxWidth =
    Math.max(...lines.map((it) => Renderer.getStringWidth(it))) / 2;

  if (renderBlackBox) {
    GlStateManager.func_179090_x(); //disableTexture2D
    WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181706_f); // begin
    WorldRenderer.func_181662_b(-maxWidth - 1, -1 * l, 0)
      .func_181666_a(0, 0, 0, 0.25)
      .func_181675_d(); // pos, color, endvertex
    WorldRenderer.func_181662_b(-maxWidth - 1, 9 * l, 0)
      .func_181666_a(0, 0, 0, 0.25)
      .func_181675_d(); // pos, color, endvertex
    WorldRenderer.func_181662_b(maxWidth + 1, 9 * l, 0)
      .func_181666_a(0, 0, 0, 0.25)
      .func_181675_d(); // pos, color, endvertex
    WorldRenderer.func_181662_b(maxWidth + 1, -1 * l, 0)
      .func_181666_a(0, 0, 0, 0.25)
      .func_181675_d(); // pos, color, endvertex
    MCTessellator.func_78381_a(); // draw
    GlStateManager.func_179098_w(); // enableTexture2D
  }

  lines.forEach((it, idx) => {
    Renderer.getFontRenderer().func_175065_a(
      it,
      -Renderer.getStringWidth(it) / 2,
      idx * 9,
      color,
      shadow
    ); // drawString
  });

  GlStateManager.func_179131_c(1, 1, 1, 1); // color
  GlStateManager.func_179132_a(true); // depthMask
  GlStateManager.func_179126_j(); // enableDepth
  GlStateManager.func_179121_F(); // popMatrix
}

// Renders centered text at a position. Can split each word onto a new line.
// If an array of strings is passed, it will render each item on a new line.
/**
 * Renders text perfectly centered on the screen both horizontally and vertically. Supports color codes
 * or optionally, pass in a Java Color to force the text to render that color.
 * @param {String|String[]} string - The text to be rendered. If an array of strings is passed, each item will be rendered on a new line.
 * @param {Number} x - Left/Right on the screen.
 * @param {Number} y - Up/Down on the screen.
 * @param {Number} scale - Scale the text to make it larger/smaller.
 * @param {Boolean} splitWords - Split the string at each space and render on a new line.
 * @param {Color} forceColor - Force the text to be a certain Java Color.
 * @returns
 */
export const renderCenteredString = (
  string,
  x,
  y,
  scale,
  splitWords = false,
  javaColor = null
) => {
  if (!string || !x || !y) return;
  Renderer.retainTransforms(true);
  string = Array.isArray(string)
    ? string
    : splitWords
    ? string.split(" ")
    : [string];
  let vertOffset = string.length * 7 + 2 * (string.length - 1);
  let [r, g, b, a] = [];
  if (javaColor) {
    r = javaColor.getRed();
    g = javaColor.getGreen();
    b = javaColor.getBlue();
    a = javaColor.getAlpha();
  }
  Renderer.translate(x, y);
  Renderer.scale(scale, scale);
  Renderer.translate(0, -vertOffset / 2);
  for (let i = 0; i < string.length; i++) {
    if (javaColor) Renderer.colorize(r, g, b, a);
    Renderer.drawStringWithShadow(
      string[i],
      -Renderer.getStringWidth(string[i]) / 2,
      i * 7 + 2 * i
    );
  }
  Renderer.retainTransforms(false);
};

//calculates the distance between 2 points using the 3d distance formula
export const calcDistance = (p1, p2) => {
  var a = p2[0] - p1[0];
  var b = p2[1] - p1[1];
  var c = p2[2] - p1[2];

  let dist = Math.sqrt(a * a + b * b + c * c);

  if (dist < 0) {
    dist *= -1;
  }
  return dist;
};

//self explanitory
export function spawnParticleAtLocation(loc, velo, particle) {
  let particleType = EnumParticleTypes.valueOf(particle);
  let idField = particleType.getClass().getDeclaredField("field_179372_R");
  idField.setAccessible(true);
  let id = idField.get(particleType);

  Client.getMinecraft().field_71438_f.func_174974_b(
    id, // particleID
    true, // shouldIgnoreRange
    loc[0], // x
    loc[1], // y
    loc[2], // z
    velo[0], // speedX
    velo[1], // speedY
    velo[2] // speedZ
  );
}

//draws a linne of particles
export function drawLineParticles(loc1, loc2) {
  let distance = Math.hypot(...loc1.map((a, i) => a - loc2[i]));
  let maxPoints = Math.ceil(distance * 1);
  for (let i = 0; i < maxPoints; i++) {
    let actualI = i + Math.random();
    let a = actualI / maxPoints;
    let loc = [
      loc1[0] * a + loc2[0] * (1 - a) - 0.5,
      loc1[1] * a + loc2[1] * (1 - a) + 0.1,
      loc1[2] * a + loc2[2] * (1 - a) - 0.5,
    ];

    let a2 = (actualI + 0.02) / maxPoints;
    let loc3 = [
      loc1[0] * a2 + loc2[0] * (1 - a2) - 0.5,
      loc1[1] * a2 + loc2[1] * (1 - a2) + 0.1,
      loc1[2] * a2 + loc2[2] * (1 - a2) - 0.5,
    ];
    loc3 = loc3.map((a, i) => loc[i] - a);

    spawnParticleAtLocation(loc, loc3, "FLAME");
  }
}

const guiContainerLeftField =
  GuiContainer.class.getDeclaredField("field_147003_i");
const guiContainerTopField =
  GuiContainer.class.getDeclaredField("field_147009_r");
guiContainerLeftField.setAccessible(true);
guiContainerTopField.setAccessible(true);

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
 */
export const highlightSlot = (
  gui,
  slotIndex,
  r,
  g,
  b,
  a,
  aboveItem = false,
  z = null
) => {
  if (!(gui instanceof GuiContainer)) return;

  const [x, y] = getSlotRenderPosition(slotIndex, gui);

  let zPosition = 245;
  if (aboveItem) zPosition = 241;
  if (z !== null) zPosition = z;

  Renderer.translate(x, y, zPosition);
  Renderer.drawRect(
    Renderer.color(r * 255, g * 255, b * 255, a * 255),
    0,
    0,
    16,
    16
  );
  Renderer.finishDraw();
};

/**
 * Checks if the chunk at the specified coordinate is loaded.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns
 */
export const chunkLoaded = (x, y, z) => {
  if (!World || !World.getWorld()) return false;
  return World.getChunk(x, y, z).chunk.func_177410_o();
};

/**
 *
 * @param {Block} ctBlock
 * @returns {Number[]} - A 6-long array of numbers with the [x0, y0, z0, x1, y1, z1] corners of the block's bounding box.
 */
export const getBlockBoundingBox = (ctBlock) => {
  const mcBlock = ctBlock.type.mcBlock;
  return [
    ctBlock.getX() + mcBlock.func_149704_x(),
    ctBlock.getY() + mcBlock.func_149665_z(),
    ctBlock.getZ() + mcBlock.func_149706_B(),
    ctBlock.getX() + mcBlock.func_149753_y(),
    ctBlock.getY() + mcBlock.func_149669_A(),
    ctBlock.getZ() + mcBlock.func_149693_C(),
  ];
};
