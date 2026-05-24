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
