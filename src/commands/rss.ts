import { readConfig } from "../config.js";
import { getUserByName } from "../lib/db/queries/users.js";
import { createFeed, getFeeds } from "../lib/db/queries/rssfeeds.js";
import { Feed, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }
    const config = readConfig();
    const user = await getUserByName(config.currentUsername);

    if (!user) {
        throw new Error(`User ${config.currentUsername} not found`);
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    console.log("Feed created successfully");
    printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = getFeeds();
    (await feeds).forEach(feed => {
        console.log(`Feed: ${feed.name}`);
        console.log(`URL: ${feed.url}`);
        console.log(`User: ${feed.userName}`);
    })
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:          ${feed.id}`);
    console.log(`* Created:     ${feed.createdAt}`);
    console.log(`* Updated:     ${feed.updatedAt}`);
    console.log(`* name:        ${feed.name}`);
    console.log(`* URL:         ${feed.url}`);
    console.log(`* User:        ${user.name}`);
}
