import { setUser, readConfig } from "../config.js";
import { createUser, deleteAllUsers, getUserByName, getUsers} from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (!args || args.length == 0) {
        throw new Error(`usage: ${cmdName} <username>`);
    }
    const userName = args[0];
    setUser(userName);
    console.log(`User set: ${userName}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (!args || args.length == 0) {
        throw new Error(`usage: ${cmdName} <username>`);
    }
    const userName = args[0];
    const userExists = await getUserByName(userName);
    if (userExists) {
        throw new Error("Register fail. Username already exists.");
    }
    const newUser = await createUser(userName);
    setUser(userName);
    console.log(`New user Created: ${newUser.name}`);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteAllUsers();   
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const allUsers = await getUsers();
    const currentUser = readConfig().currentUsername;
    allUsers.forEach((user) => {
        let printStr = `* ${user.name}`;
        if (user.name === currentUser) {
            printStr = printStr + " (current)"
        }
        console.log(printStr);
    })
} 