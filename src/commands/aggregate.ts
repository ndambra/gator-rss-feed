import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/rssfeeds.js";
import { fetchFeed } from "../lib/rssfeeds.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const url = "https://www.wagslane.dev/index.xml";
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_bewteen_reqs = 1h, 1s, 2h, etc.>`);
    }
    const userTimeReq = args[0];
    const timeBetweenRequests = parseDuration(userTimeReq);
    if (timeBetweenRequests == null) {
        throw new Error("Invalid time_between_reqs interval value")
    }
    console.log(`Collecting feeds every ${userTimeReq}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        console.log("No feeds to fetch");
    }
    console.log("Fetching feed...");
    markFeedFetched(nextFeed.id);
    const feed = await fetchFeed(nextFeed.url);

    if (!feed) {
        throw new Error("RSS Feed not found");
    }
    feed.channel.item.forEach(item => {
        console.log(`* ${item.title}`);
    })
}

function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    console.log(`parse => ${match}`);

    if(match) {
        let time = Number(match.at(1));
        let unit = match.at(2);

        switch (unit) {
            case "s":
                return time * 1000;
            case "m":
                return time * 60 * 1000;
            case "h":
                return time * 60 * 60 * 1000;
            default:
                return time;
        }
    }
}

function handleError(err: unknown){
    throw new Error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}