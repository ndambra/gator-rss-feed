# gator-rss-feed

gator-rss-feed is a CLI tool that allows users to:

- Add RSS feeds from across the internet to be collected
- Store the collected posts in a PostgreSQL database
- Follow and unfollow RSS feeds that other users have added
- View summaries of the aggregated posts in the terminal, with a link to the full post

RSS feeds are a way for websites to publish updates to their content. You can use this CLI tool to keep up with your favorite blogs, news sites, podcasts, and more!

---

## Install

- clone repo and install dependencies

```shell
npm install
```

- install and setup postgresql

```shell
# install
sudo apt update
sudo apt install postgresql postgresql-contrib

# update postgres password
sudo passwd postgres

# start Postgres server in background
sudo service postgresql start

# enter shell and create db
sudo -u postgres psql
```

- setup database

```postgres
CREATE DATABASE gator;
\c gator
ALTER USER postgres PASSWORD 'postgres';
```

## Config

- Create a config file at the user home directors: `~/.gatorconfig.json`
  - **Important**: file must be name named exactly as above.
- add the following JSON object to the config file

```json
{
  "db_url": "psql_db_connection_string_here"
}
```

## How to run

- `npm run login <username>`
- `npm run register <username>`
- `npm run reset`
- `npm run users`
- `npm run agg <time_bewteen_reqs = 1h, 1s, 2h, etc.>`
- `npm run addfeed <feed_name> <url>`
- `npm run feeds`
- `npm run follow <url>`
- `npm run following`
- `npm run unfollow <url>`
- `npm run browse [limit]`

## Extending the project
- Add sorting and filtering options to the browse command
- Add pagination to the browse command
- Add concurrency to the agg command so that it can fetch more frequently
- Add a search command that allows for fuzzy searching of posts
- Add bookmarking or liking posts
- Add a TUI that allows you to select a post in the terminal and view it in a more readable format (either in the terminal or open in a browser)
- Add an HTTP API (and authentication/authorization) that allows other users to interact with the service remotely
- Write a service manager that keeps the agg command running in the background and restarts it if it crashes
