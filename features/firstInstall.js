import PogObject from "../../PogData";

/*  ----------- First Install Message -----------

    Funny Popup thing

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

const firstInstall = new PogObject("stella", {
    firstInstall: false,
});

register("tick", () => {
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
        firstInstall.save();
    }
});

//debug command for testing
register("command", () => {
    firstInstall.firstInstall = false;
    firstInstall.save();
}).setName("srdbfi");
