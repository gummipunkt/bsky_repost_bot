# bsky_repost_bot
A Bluesky/BSKY/ATPROTO Repost Bot

1) Clone Repo
2) install npm modules
  - yarn add @atproto/api
  - npm install lowdb
  - npm install cron
3) Edit 2x the identifier and password value
4) Edit 2x the PDS -> identifier service
5) Edit & Add & Remove your search strings
6) Edit package.json, add in the first line
  ´"type": "module",´
7) Run with 'node index.js'
8) Perhaps you want to use PM2 for a ongoing usage
    ´pm2 start index.js´
