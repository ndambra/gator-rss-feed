import { getPostsForUser } from "../lib/db/queries/posts.js";
import { Posts, User } from "../lib/db/schema.js";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit = 2;
  if (args.length === 1) {
    limit = Number(args[0]);
  }
  const posts = await getPostsForUser(user.id, limit);

  console.log(`Found ${posts.length} posts for user ${user.name}`);
  posts.forEach((post) => {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`--- ${post.title} ---`);
    console.log(`    ${post.description}`);
    console.log(`Link: ${post.url}`);
    console.log(`=====================================`);
  });
}

function printPostObject(post: Posts) {}
