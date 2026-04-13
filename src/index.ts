import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commands.js";
import { argv } from "node:process";

function main() {
    const cmdRegistry: CommandsRegistry = {};
    registerCommand(cmdRegistry, "login", handlerLogin);

    const args = argv.slice(2);
    if (args.length < 1) {
        console.log("Invalid command. At least 1 arguement required.");
        process.exit(1);
    }
    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    runCommand(cmdRegistry, cmdName, ...cmdArgs);
}

main();

