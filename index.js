import settings from "./utils/config"
import "./features/firstInstall"
import "./features/secrets"
import "./features/routes"

//commands

register("command", (...args) => {
    if (args[0] === 'help') {
            ChatLib.chat('&8&m-------------------------------------------------');
            ChatLib.chat('&6/eclipseaddons &7main command! Aliases: &6/ea /eca')
            ChatLib.chat('&6/ea help &7Opens the Eclipse Addons help menu!')
            ChatLib.chat('&6/srdb &7 debug options for secret stufff! try &6/srdb help &7for more info!')
            ChatLib.chat('&8&m-------------------------------------------------');
    } else  if (!args || !args.length || !args[0]){
        return settings().getConfig().openGui()
    } else {
        ChatLib.chat('&cUnknown command. &7Try &6/ea help &7for a list of commands')
    }
}).setName("eclipseaddons").setAliases("ea", "eca");