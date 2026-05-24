import { desc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { posts, feedFollows, feeds } from "../schema.js";

export async function createPost(
  title: string,
  url: string,
  pubDate: Date,
  description: string,
  feedId: string,
) {
  const [post] = await db
    .insert(posts)
    .values({
      title,
      url,
      publishedAt: pubDate,
      description,
      feedId,
    })
    .returning();
  return post;
}

export async function getPostsForUser(userId: string, limit: number) {
  const allPosts = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return allPosts;
}
