// Description: This script fetches posts from the Bsky feed and reposts them to the user's feed.

// Importing the required modules
import { BskyAgent } from '@atproto/api'
import { JSONFilePreset } from 'lowdb/node'
import { CronJob } from 'cron';


// Create a new JSON file preset with lowdb
const db = await JSONFilePreset('db.json', { uris: [] })

// Create a new agent and login to the service with atproto API
async function posting() {
  const agent = new BskyAgent({ service: "https://instance.tld" }); // EDIT sample: bsky.social
  
  await agent.login({
    identifier: "sample.handle.tld", // EDIT sample: bot.bsky.app
    password: "p4ssw0rd", // EDIT
  });

  // Search Posts with the given queries
  const data = await agent.app.bsky.feed.searchPosts({ // EDIT
      'q': "god",
      'q': "dont",
      'q': "#exist",
      'q': "believe",
      'q': "#in",
      'q': "#bsky",
  });
  return data;
}

//run cronjob every 60s
const job = new CronJob(
	'0 * * * * *', // cronTime
	function () {
		// Fetching the posts and reposting them
    posting().then(async (response) => {
      console.log('Start search');
      const data = response.data; // Extracting the data object from XRPCResponse

      // Check if the data object is valid and contains posts array
      if (data && data.posts && Array.isArray(data.posts)) {
        for (let post of data.posts) {
          const uri = post.uri;
          const cid = post.cid;

          // Check if the post is already reposted
          await db.read();
          const exists = db.data.uris.includes(post.uri)
          if (exists) {
            console.log("Already reposted:", "URI:", uri, "&", "CID:", cid);
            continue;
          }
          // Update the reposted posts in db
          await db.update(({ uris }) => uris.push(post.uri))

          // login again to bsky
          const agent = new BskyAgent({ service: "https://instance.tld" }); // EDIT sample: bsky.social
      
          await agent.login({
            identifier: "sample.handle.tld", // sample: bot.bsky.app
            password: "p4ssw0rd", // EDIT
          });

          // Repost the post
          await agent.repost(uri, cid)
          console.log("Reposted:", "URI:", uri, "&", "CID:", cid);

        }
      } else {
        console.error("Invalid data format or missing posts array");
      }
    console.log('Search done, start again in 60s');
    });    

	}, // onTick
	null, // onComplete
	true, // start
	'Europe/Berlin' // timeZone
);
