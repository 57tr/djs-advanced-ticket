![DBT Image](https://github.com/57tr/djs-advanced-ticket/assets/96021196/0b275415-dec1-4f5e-ae0f-ad6a0ab5dc37)

# djs-advanced-ticket
This is an advanced ticket system with a database for different guilds, it is easy to use and adapt. You can prevent raids on your discord and bot injections.

<a href="https://github.com/57tr/djs-advanced-ticket"><img src= "https://img.shields.io/github/stars/57tr/djs-advanced-ticket?style=for-the-badge"/></a>
<a href="https://github.com/57tr"><img src="https://img.shields.io/github/followers/57tr?style=for-the-badge"/></a>

## Dependencies:
> The dependencies used are [discord.js](https://discord.js.org/#/), [mongoose](https://www.npmjs.com/package/mongoose) and [discord-html-transcripts](https://www.npmjs.com/package/discord-html-transcripts).
```
npm i discord.js mongoose discord-html-transcripts
```

# Instructions:
> 1. Put the slash commands in your slash commands folder.
> 2. Put the events in your event folder.
> 3. Create a new folder in the root directory of the bot and name it "schemas", and then put all the schemas there.
> 4. Change all paths to the correct ones if necessary.

# MongoDB Connection:
> To connect to mongodb with your discord bot make sure to add this to your ready.js event or index.js file.
```js
// Add this to the top of the file
const { connect } = require('mongoose');

// Add this to your ready.js or index.js file
await connect(MONGO_URI).then(() => {
    console.log('Successfully connected to MongoDB!');
}).catch((error) => {
    console.log('Error connecting to MongoDB!', error);
});
```

# Preview
https://github.com/57tr/djs-advanced-ticket/assets/96021196/184e3378-3c29-4290-9042-af16a5f29d09

# Contributing:
> If you want to contribute create a fork of this project and when you are done editing it update the fork and create a pull request.
