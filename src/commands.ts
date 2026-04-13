import { setUser } from "./config.js";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (!args || args.length == 0) {
        console.log("Invalid: command 'login' requires <username>");
        process.exit(1);
    }
    const userName = args[0];
    setUser(userName);
    console.log(`User set: ${userName}`);
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const cmd = registry[cmdName];
    cmd(cmdName, ...args);
}