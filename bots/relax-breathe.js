const helpers = require(__dirname + '/../helpers/helpers.js'),
      relax_helpers = require(__dirname + '/../relax-helpers/helpers.js'),
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js'), 
      tumblrClient = require(__dirname + '/../helpers/tumblr.js'),
      fs = require('fs');

const twitter = new TwitterClient( {
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
} );

/*
const mastodon = new mastodonClient( {
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
} );

const tumblr = new tumblrClient( {
  tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,
  consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
  token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
} );
*/

var bot_schedule = [
    "0 20 * * *",
    "19 21 * * *",
    "38 22 * * *",
    "57 23 * * *",
    "16 1 * * *",
    "35 2 * * *",
    "54 3 * * *",
    "13 5 * * *",
    "32 6 * * *",
    "51 7 * * *",
    "10 9 * * *",
    "29 10 * * *",
    "48 11 * * *",
    "7 13 * * *",
    "26 14 * * *",
    "45 15 * * *",
    "4 17 * * *",
    "23 18 * * *"
]

var message_list = [
  "Hey.\n\nYou may have tensed up again.\n\nIt's OK. Let's take a moment to take care of you.\n\nRelax your shoulders.\nUnclench your jaw.\nUnstick your tongue from the top of your mouth.\nRelax your hands.\nTake a deep breath.\n\nAnd go.",
  "Please take a minute to relax your body.\n\nUnclench your jaw.\nLoosen your tongue.\nTake a sip of water and relax your face.\nGently rotate your shoulders and then lower them.\nRest your wrists comfortably.\nClose your eyes and take a deep breath.",
  "Hold on. Please take a moment to check in with your body.\n\nDrop your shoulders.\nUnclench your jaw.\nLoosen your tongue from the roof of your mouth.\nRelax your hands.\nBreathe.",
  "Tense again? It'll be OK. Here's your reminder.\n\nRelax your hands and wrists.\nLoosen up along your arms and drop your shoulders.\nUnclench your jaw.\nStop your tongue from pressing into the top of your mouth.\nTake a slow breath.\nTake another."
];

var emoji_list = ['🌻','🌼','🌳','🍀','🍂','🏔️','🏞️','🧸','❤','🧡','💛','💚','💙','💜','💟','🌿','🌺','🌱','🌲'];

var special_characters = ['​','‌','‍','⁠'];

function get_random( input ) {
  var rand_index = Math.floor( Math.random() * input.length );
  return input[rand_index];
}

function dedupe_tweet( message ) {
  var special_set = "";
  var set_length = Math.floor( Math.random()*15 );
  
  for (var i = 0; i < set_length; i++) {
    special_set += get_random( special_characters );
  }
  return message + "\n\n" + special_set + get_random( emoji_list );
}

function get_message() {
  var last_message = "";
  
  if (fs.existsSync('.data/last_tweet.txt')) {
    last_message = fs.readFileSync(".data/last_tweet.txt", "utf8");
  }
  
  var message = null;
  
  while (message == null || message == last_message) {
    message = get_random( message_list );
  }
  
  fs.writeFile(".data/last_tweet.txt", message, "utf8", function(err) {
    if(err) {
        console.log("Error saving file.")
        return console.log(err);
    }

    console.log("The file was saved!");
  });
  
  var message = dedupe_tweet( message );
  return message;
}

module.exports = {
  /*
    Basic information about your bot.
  */
  active: true, // All bots inside the "bots" folder are loaded automatically. Change "active" to false to prevent loading your bot.
  name: 'Relax and Breathe',
  description: 'Just a very basic bot!',
  /*
    The `interval` can be either one of the values inside helpers/cron-schedules.js, or you can also use custom cron schedules.
    See https://www.npmjs.com/package/cron#available-cron-patterns for more details.
  */
  interval: bot_schedule,
  script: function(){
  /*
    This is your bot's main code. Check out botwiki.org/resources for tutorials and botwiki.org/bots for some inspiration.
  */
    const title = 'New post',
          text = get_message();

    twitter.tweet( text );
    
    /*
    mastodon.toot( text );
    tumblr.post( title, text );
    */
  }
};
