import { and, eq } from "drizzle-orm";
import { db } from "../index.js"
import { feedFollows, feeds, users } from "../schema.js"
import { firstOrUndefined } from "./utils.js";
import { getUserByName } from "./users.js";

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

export async function createFeedFollow(feedId: string, userId: string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({
    feedId,
    userId,
  }).returning();

  const [result] = await db.select({
    feedFollowId: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    feedName: feeds.name,
    userName: users.name
  }).from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id));
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getFeedFollowsForUser(userName: string) {
  const user = getUserByName(userName);
  console.log(`Getting feed followers for ${(await user).name}`);

  const feedsFollowing = await db.select({
    feedsName: feeds.name,
  }).from(feedFollows).where(eq(feedFollows.userId, (await user).id)).innerJoin(feeds, eq(feedFollows.feedId, feeds.id));
  console.log(`User '${userName} follows:'`)

  feedsFollowing.forEach(feed => {
    console.log(`* ${feed.feedsName}`);
  });
}

export async function deleteFeedFollow(feedId: string, userId: string) {
  const [result] = await db.delete(feedFollows).where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId))).returning();
  return result;
}