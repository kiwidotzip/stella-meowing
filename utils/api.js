import { Promise } from "../../tska/polyfill/Promise";
import { fetch } from "../../tska/polyfill/Fetch";

const BufferedImage = Java.type("java.awt.image.BufferedImage");
const ImageIO = Java.type("javax.imageio.ImageIO");
const Color = Java.type("java.awt.Color");

export const getMojangInfo = (player) => {
    // Using UUID
    if (player.length > 16)
        fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${player}`, {
            //headers: { "User-Agent": "Stella" },
            json: true,
        })
            .then((resp) => {
                resp.success = true;

                return resp;
            })
            .catch((e) => {
                const { path, errorMessage } = e;

                return {
                    success: false,
                    reason: errorMessage,
                    path,
                };
            });

    // Using Username
    fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`, {
        //headers: { "User-Agent": "Stella" },
        json: true,
    })
        .then((resp) => {
            resp.success = true;

            return resp;
        })
        .catch((e) => {
            const { path, errorMessage } = e;

            return {
                success: false,
                reason: errorMessage,
                path,
            };
        });
};

const cachedUUIDs = {}; // {player: {uuid: UUID, name: Username, updated: TIMESTAMP, promise: Promise}}

export const getPlayerUUID = (player) => {
    const nameLower = player.toLowerCase();

    if (nameLower == Player.getName().toLowerCase()) {
        return new Promise((resolve) => resolve(Player.getUUID().replace(/-/g, "")));
    }

    if (nameLower in cachedUUIDs) {
        if (cachedUUIDs[nameLower].promise) {
            ChatLib.chat(`&c[UUID]&r PROMISe for uuid! ! ! `);
            return cachedUUIDs[nameLower].promise;
        }

        if (cachedUUIDs[nameLower].uuid) {
            ChatLib.chat(`&c[UUID]&r &aReturning cached UUID for ${player}`);
            return new Promise((resolve) => resolve(cachedUUIDs[player.toLowerCase()].uuid));
        }
    }

    ChatLib.chat(`&c[UUID]&r Making UUID request for ${player}`);
    const promise = getMojangInfo(player);

    cachedUUIDs[nameLower] = {
        uuid: null,
        name: null,
        updated: null,
        promise,
    };

    return promise.then((mojangInfo) => {
        cachedUUIDs[nameLower].promise = null;

        if (!mojangInfo.success) return null;

        const { id, name } = mojangInfo;
        ChatLib.chat(`&c[UUID]&r Set cached uuid for ${player}: ${id}`);

        cachedUUIDs[nameLower].uuid = id;
        cachedUUIDs[nameLower].name = name;
        cachedUUIDs[nameLower].updated = Date.now();

        ChatLib.chat(`&c[UUID]&r &eRequesting new UUID data for ${player}`);

        return id.trim();
    });
};

const getHeadFromAPI = (uuid, border, both) => {
    let img = null;
    try {
        img = ImageIO.read(new java.net.URL(`https://crafatar.com/avatars/${uuid}?overlay`)).getScaledInstance(8, 8, java.awt.Image.SCALE_SMOOTH);
    } catch (e) {
        return null;
    }

    if (!img) {
        return null;
    }

    img.getWidth();
    img = img.getBufferedImage();
    let normal = new Image(img);
    let bordered = new Image(setBlackBG(img));

    if (both) return [normal, bordered];
    if (border) return bordered;
    else return normal;
};

export const getHead = (player, border, both = false, uuid = null) =>
    new Promise((resolve) => {
        if (uuid) resolve(getHeadFromAPI(uuid, border, both));

        getPlayerUUID(player)
            .then((uuid) => {
                resolve(getHeadFromAPI(uuid, border, both));
            })
            .catch((e) => {
                resolve(null);
            });
    });
