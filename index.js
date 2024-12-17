import settings from "./utils/config"
import "./features/termwaypoints"
import "./features/firstInstall"
import "./features/secrets"
import "./features/routes"

/*  ------------------- Index -------------------

    Core File    
    I tried to doccument how it works as best as I could

    ------------------- To Do -------------------

    - finish routes stuff
    - add profit calculator
    - add numbered terminal waypoints

    --------------------------------------------- */


//commands

register("command", (...args) => {
    if (args[0] === 'help') {
            ChatLib.chat('&8&m-------------------------------------------------');
            ChatLib.chat('&6/eclipseaddons &7main command! Aliases: &6/ea /eca')
            ChatLib.chat('&6/ea help &7Opens the Eclipse Addons help menu!')
            ChatLib.chat('&6/srdb &7 debug options for routes try &6/srdb help &7for more info!')
            ChatLib.chat('&6/route &7 route recording try &6/route help &7for more info!')
            ChatLib.chat('&8&m-------------------------------------------------');
    } else  if (!args || !args.length || !args[0]){
        return settings().getConfig().openGui()
    } else {
        ChatLib.chat('&cUnknown command. &7Try &6/ea help &7for a list of commands')
    }
}).setName("eclipseaddons").setAliases("ea", "eca");