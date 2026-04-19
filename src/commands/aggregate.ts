import { fetchFeed } from "../lib/rssfeeds.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const url = "https://www.wagslane.dev/index.xml";
    // if (!args || args.length == 0) {
    //     console.log("Invalid: command 'agg' requires <rssFeedURL>");
    //     process.exit(1);
    // }
    await fetchFeed(url);
}