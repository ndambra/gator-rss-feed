import { eq } from "drizzle-orm";
import { db } from "../index.js"
import { feeds, users } from "../schema.js"
import { firstOrUndefined } from "./utils.js";

export async function createFeed(feedName: string, url: string, userId: string) {
    const result = await db
      .insert(feeds)
      .values({
        name: feedName,
        url,
        user_id: userId
      }).returning();

      return firstOrUndefined(result);
}

export async function getFeeds() {
  const result = await db.select({name: feeds.name, url: feeds.url, userName: users.name}).from(feeds).leftJoin(users, eq(feeds.user_id, users.id));
  return result;
}