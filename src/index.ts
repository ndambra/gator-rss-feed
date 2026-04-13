import { setUser, readConfig } from "./config.js";

function main() {
    setUser("Nikki");
    const userConfig = readConfig();
    console.log(`currentUserName: ${userConfig.currentUsername}; dbUrl: ${userConfig.dbUrl}`);
}

main();

