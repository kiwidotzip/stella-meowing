import { LocalStore } from "../../tska/storage/LocalStore";

/*  ----------- First Install Message -----------

    Funny Popup thing

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

const firstInstall = new LocalStore(
    "stella",
    {
        firstInstall: false,
    },
    "./data/stella.json"
);

register("step", () => {
    if (!firstInstall.firstInstall) {
        let message =
            `&b&l-----------------------------------------------------\n` +
            `   &r&3Thank you for installing &b&lStella&r&3!\n` +
            `\n` +
            `   &r&3Commands\n` +
            `   &r&d/sa help &3&l- &r&bFor a list of commands!\n` +
            `\n` +
            `   &r&dGithub: https://github.com/Eclipse-5214/stella\n` +
            `   &r&dDiscord: Coming Soon\n` +
            `&b&l-----------------------------------------------------`;

        ChatLib.chat(message);
        firstInstall.firstInstall = true;
    }
}).setFps(1);

//debug command for testing
register("command", () => {
    firstInstall.firstInstall = false;
}).setName("srdbfi");
