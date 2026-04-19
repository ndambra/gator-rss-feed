import { readConfig } from "./config.js";
import { UserCommandHandler } from "./commands/commands.js";
import { CommandHandler } from "./commands/commands.js";
import { getUserByName

 } from "./lib/db/queries/users.js";
export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();
        const userName = config.currentUsername;
        if (!userName) {
            throw new Error("User not logged in");
        }

        const user = await getUserByName(userName);
        if (!user) {
            throw new Error(`User ${userName} not found`);
        }

        await handler(cmdName, user, ...args);
    };
}