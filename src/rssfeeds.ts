import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string) {
    const headers = new Headers();
    headers.set('User-Agent', 'gator');
    try {
        const response = await fetch(feedUrl, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error("Unable to fetch data.");
        }
        
        let text = await response.text();
        const rssFeed: RSSFeed = parseXml(text);
        printRSSFeedObject(rssFeed);
    } catch (error) {
        console.log(`Error occured: ${error}`)
    }
    
}

function printRSSFeedObject(obj: RSSFeed) {
    console.log("\n  channel:{");
    console.log(`  title: ${obj.channel.title},`);
    console.log(`  link: ${obj.channel.link},`);
    console.log(`  description: ${obj.channel.description},`);
    console.log(`  item: [\n`);
    obj.channel.item.forEach(rssItem => {
        console.log(`  {`);
        console.log(`    title: ${rssItem.title},`)
        console.log(`    link: ${rssItem.link},`)
        console.log(`    pubDate: ${rssItem.pubDate},`)
        console.log(`    description: ${rssItem.description},`)
    })
    
}

function parseXml(text: string): RSSFeed {
    const parser = new XMLParser();
    let rssObj = parser.parse(text);
    // console.log(rssObj);

    let channel = rssObj.rss.channel;
    if (!channel) {
        console.log("Error: Invalid Xml");
        throw new Error("Invalid xml")
    }
    let title = channel.title;
    let link = channel.link;
    let description = channel.description;

    if (!title || !link || !description) {
        throw new Error("Invalid xml")
    }

    let items: RSSItem[] = [];
    let rssItems = channel.item as RSSItem[];
    if (Array.isArray(rssItems)) {
        rssItems.forEach(rssItem => {
            let itemTitle = rssItem.title;
            let itemLink = rssItem.link;
            let itemDesc = rssItem.description;
            let itemPubDate = rssItem.pubDate;
            if (itemTitle && itemLink && itemDesc && itemPubDate ) {
                const newItem: RSSItem = {
                    title: itemTitle,
                    link: itemLink,
                    description: itemDesc,
                    pubDate: itemPubDate
                };
                items.push(newItem);
            }
        })
    }

    const rssFeed: RSSFeed = {
        channel: {
            title, 
            link,
            description,
            item: items,
        }
    }

    return rssFeed;
}


export async function handlerAgg(cmdName: string, ...args: string[]) {
    const url = "https://www.wagslane.dev/index.xml";
    // if (!args || args.length == 0) {
    //     console.log("Invalid: command 'agg' requires <rssFeedURL>");
    //     process.exit(1);
    // }
    await fetchFeed(url);
}