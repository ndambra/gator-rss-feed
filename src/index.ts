import { 
    CommandsRegistry,
    registerCommand,
    runCommand 
} from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerReset } from "./commands/users.js";
import { argv } from "node:process";

async function main() {
    const args = argv.slice(2);
    if (args.length < 1) {
        console.log("usage: cli <command> [args...]");
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    const cmdRegistry: CommandsRegistry = {};
    registerCommand(cmdRegistry, "login", handlerLogin);
    registerCommand(cmdRegistry, "register", handlerRegister);
    registerCommand(cmdRegistry, "reset", handlerReset);

    try {
        await runCommand(cmdRegistry, cmdName, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();

