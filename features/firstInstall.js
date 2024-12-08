import PogObject from "../../PogData";

const firstInstall = new PogObject("CrafterAddons", {
    firstInstall: false
});

register("tick", () => {
    if (!firstInstall.firstInstall) {
        let message = `&b&l-----------------------------------------------------\n` +
                        `   &r&3Thank you for installing &b&lEclipse Addons&r&3!\n` +
                        `   &r&3Commands\n` +
                        `   &r&d/ea help &3&l- &r&bFor a list of commands!\n` +
                        `\n` +
                        `   &r&dGithub: TBD\n` +
                        `   &r&dDiscord: https://discord.gg/secretroutes\n` +
                        `&b&l-----------------------------------------------------`

        ChatLib.chat(message)

        firstInstall.firstInstall = true
        firstInstall.save()
    }
})

register("command", () => {
    firstInstall.firstInstall = false
    firstInstall.save()
}).setName("srdbfi")