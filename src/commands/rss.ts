import { createFeed, createFeedFollow, deleteFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds } from "../lib/db/queries/rssfeeds.js";
import { Feed, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }
    
    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    console.log("Feed created successfully");
    printFeed(feed, user);
    const result = await createFeedFollow(feed.id, user.id);
    console.log(`User ${user.name} followed ${result.feedName}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = getFeeds();
    (await feeds).forEach(feed => {
        console.log(`Feed: ${feed.name}`);
        console.log(`URL: ${feed.url}`);
        console.log(`User: ${feed.userName}`);
        console.log("");
    })
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage ${cmdName} <url>`);
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);

    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`User ${user.name} followed ${feedFollow.feedName}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    const following = await getFeedFollowsForUser(user.name);
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length != 1) {
        throw new Error(`usage ${cmdName} <url>`);
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed not found`);
    }

    const deletedFollow = await deleteFeedFollow(feed.id, user.id);
    if (deletedFollow) {
        console.log(`${user.name} unfollowed ${feed.name}`);
    } else {
        throw new Error('Feed not unfollowed');
    }
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:          ${feed.id}`);
    console.log(`* Created:     ${feed.createdAt}`);
    console.log(`* Updated:     ${feed.updatedAt}`);
    console.log(`* name:        ${feed.name}`);
    console.log(`* URL:         ${feed.url}`);
    console.log(`* User:        ${user.name}`);
}
