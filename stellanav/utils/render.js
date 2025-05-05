if (!GlStateManager) {
    var GL11 = Java.type("org.lwjgl.opengl.GL11"); //using var so it goes to global scope
    var GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
}

class RenderLibs {
    /**
     * @constructor
     */
    constructor() {
        this.lastSizzorX = 0;
        this.lastSizzorY = 0;
        this.lastSizzorW = 0;
        this.lastSizzorH = 0;
        this.scizzoring = false;
        this.sizzorOverride = {
            disabled: false,
        };
    }

    /**
     * Returns the current scizzor location
     * @return {[Number, Number, Number, Number]} the current scizzor location [x,y,w,h]
     */
    getCurrScizzor = function () {
        return [this.lastSizzorX, this.lastSizzorY, this.lastSizzorW, this.lastSizzorH];
    };
    /**
     * Sets the current scizzor location
     * @param {Number} x The left location of the scizzor
     * @param {Number} y The top location of the scizzor
     * @param {Number} width The width of the scizzor
     * @param {Number} height The height of the scizzor
     */
    scizzorFast = function (x, y, width, height) {
        if (this.sizzorOverride.disabled) return;
        this.lastSizzorX = x;
        this.lastSizzorY = y;
        this.lastSizzorW = width;
        this.lastSizzorH = height;
        let guiScale = Renderer.screen.getScale();
        let screenHeight = Renderer.screen.getHeight();
        GL11.glEnable(GL11.GL_SCISSOR_TEST);
        try {
            GL11.glScissor(x * guiScale, screenHeight * guiScale - y * guiScale - height * guiScale, width * guiScale, height * guiScale);
        } catch (e) {
            this.lastSizzorW = 0;
            this.lastSizzorH = 0;
            GL11.glScissor(0, 0, 0, 0);
            GL11.glDisable(GL11.GL_SCISSOR_TEST);
            return;
        }
        this.scizzoring = true;
    };
    /**
     * Sets the current scizzor location
     * This will stack with a rectangle intersection, call RenderLibs.stopScizzor() to clear the location
     * @param {Number} x The left location of the scizzor
     * @param {Number} y The top location of the scizzor
     * @param {Number} width The width of the scizzor
     * @param {Number} height The height of the scizzor
     */
    scizzor = function (x, y, width, height) {
        if (this.sizzorOverride.disabled) return;
        if (this.scizzoring) {
            if (this.lastSizzorW === 0 || this.lastSizzorH === 0) return;
            let intersect = global.soopyRenderLibsThingo.getIntersectingRectangle(
                { x1: this.lastSizzorX, y1: this.lastSizzorY, x2: this.lastSizzorX + this.lastSizzorW, y2: this.lastSizzorY + this.lastSizzorH },
                { x1: x, y1: y, x2: x + width, y2: y + height }
            );
            if (intersect === false) {
                this.lastSizzorW = 0;
                this.lastSizzorH = 0;
                GL11.glScissor(0, 0, 0, 0);
                GL11.glDisable(GL11.GL_SCISSOR_TEST);
                return;
            } else {
                x = intersect.x1;
                y = intersect.y1;
                width = Math.min(width, this.lastSizzorW, intersect.x2 - intersect.x1);
                height = Math.min(height, this.lastSizzorH, intersect.y2 - intersect.y1);
            }
        }
        this.lastSizzorX = x;
        this.lastSizzorY = y;
        this.lastSizzorW = width;
        this.lastSizzorH = height;
        let guiScale = Renderer.screen.getScale();
        let screenHeight = Renderer.screen.getHeight();
        GL11.glEnable(GL11.GL_SCISSOR_TEST);
        try {
            GL11.glScissor(x * guiScale, screenHeight * guiScale - y * guiScale - height * guiScale, width * guiScale, height * guiScale);
        } catch (e) {
            this.lastSizzorW = 0;
            this.lastSizzorH = 0;
            GL11.glScissor(0, 0, 0, 0);
            GL11.glDisable(GL11.GL_SCISSOR_TEST);
            return;
        }
        this.scizzoring = true;
    };
    /**
     * Clears the current scizzor
     */
    stopScizzor = function () {
        GL11.glDisable(GL11.GL_SCISSOR_TEST);
        this.scizzoring = false;
    };

    /**
     * Takes a string and returns an array of strings split by that text width
     * @param {String} string The input string
     * @param {Number} width The max width of the string
     * @return {Array<String>} The array of strings with the maximum width
     */
    splitStringAtWidth = function (string, width) {
        let ret = [];
        // let currLen = 0
        let lastStr = "";
        let first = true;
        string.split(" ").forEach((str) => {
            if (Renderer.getStringWidth(lastStr + " " + str) > width) {
                ret.push(lastStr);
                // currLen = 0
                lastStr = str;
            } else {
                lastStr += (first ? "" : " ") + str;
                first = false;
            }
            // currLen+=Renderer.getStringWidth(str)
        });
        ret.push(lastStr);
        return ret;
    };
    /**
     * Returns intersecting part of two rectangles
     * @param  {object}  r1 4 coordinates in form of {x1, y1, x2, y2} object
     * @param  {object}  r2 4 coordinates in form of {x1, y1, x2, y2} object
     * @return {boolean}    False if there's no intersecting part
     * @return {object}     4 coordinates in form of {x1, y1, x2, y2} object
     */
    getIntersectingRectangle = (r1, r2) => {
        [r1, r2] = [r1, r2].map((r) => {
            return {
                x: [r.x1, r.x2].sort((a, b) => a - b),
                y: [r.y1, r.y2].sort((a, b) => a - b),
            };
        });

        const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] || r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0];

        return noIntersect
            ? false
            : {
                  x1: Math.max(r1.x[0], r2.x[0]), // _[0] is the lesser,
                  y1: Math.max(r1.y[0], r2.y[0]), // _[1] is the greater
                  x2: Math.min(r1.x[1], r2.x[1]),
                  y2: Math.min(r1.y[1], r2.y[1]),
              };
    };
}

export default new RenderLibs();
