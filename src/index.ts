import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands.js";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
} from "./commands/users.js";
import { handlerAgg } from "./commands/aggregate.js";
import {
  handlerAddFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerUnfollow,
} from "./commands/rss.js";
import { argv } from "node:process";
import { middlewareLoggedIn } from "./middleware.js";
import { handlerBrowse } from "./commands/browse.js";

async function main() {
  const args = argv.slice(2);
  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  const cmdRegistry: CommandsRegistry = {};
  registerCommand(cmdRegistry, "login", handlerLogin);
  registerCommand(cmdRegistry, "register", handlerRegister);
  registerCommand(cmdRegistry, "reset", handlerReset);
  registerCommand(cmdRegistry, "users", handlerUsers);
  registerCommand(cmdRegistry, "agg", handlerAgg);
  registerCommand(cmdRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(cmdRegistry, "feeds", handlerFeeds);
  registerCommand(cmdRegistry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(
    cmdRegistry,
    "following",
    middlewareLoggedIn(handlerFollowing),
  );
  registerCommand(cmdRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(cmdRegistry, "browse", middlewareLoggedIn(handlerBrowse));

  try {
    await runCommand(cmdRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();

// TechCrunch: https://techcrunch.com/feed/
// Hacker News: https://news.ycombinator.com/rss
// Boot.dev Blog: https://www.boot.dev/blog/index.xml
