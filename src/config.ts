import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUsername: string;
}

const configFile = ".gatorconfig.json";

export function setUser(username: string) {
    const userConfig = readConfig();
    userConfig.currentUsername = username;
    writeConfig(userConfig);
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();
    let fileContents = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const userConfig = validateConfig(JSON.parse(fileContents));
    return userConfig;
}

function writeConfig(cfg: Config): void {
    const confStr = JSON.stringify(cfg);
    const filePath = getConfigFilePath();
    fs.writeFileSync(filePath, confStr);
}

function validateConfig(rawConfig: any): Config {
    let confDbUrl = '';
    let confUsername = 'Test';

    if (rawConfig.dbUrl) {
        confDbUrl = rawConfig.dbUrl;
    }
    if (rawConfig.currentUsername) {
        confUsername = rawConfig.currentUsername;
    }
    return {
        dbUrl: confDbUrl,
        currentUsername: confUsername
    };
}

function getConfigFilePath(): string {
    const homedir = os.homedir();
    const filePath = path.join(homedir, '/', configFile);
    return filePath;
}