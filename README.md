# cluster-map

Cluster Map is an attempt to dynamically capture the star system cluster information from my Space Opera RPG Game In Dire Straits.

I decided I needed to learn a new front-end framework, picked Vue.js to do so.

I converted the project to build with Nuxt.js, so I could implement easy server-side APIs (and to
get SSR pages.)

Implemented a persistence layer using MongoDB. Storing cluster information there.

This is another learning project for me.

## Installation

The MongoDB interface uses a couple of environment variables to identify how to connect to the database:

For a local MongoDB installation, use values like this:

```bash
MONGO_CONNECTION_STRING="mongodb://127.0.0.1:27017/?directConnection=true"
MONGO_DB="clustermap"
```

Adding these lines to your local `.env` file should work. Do not commit the `.env` file to the repository.

How to set up those environment variables in your hosting environment is specific to that environment.  I use Vercel, and
set them in the Environment Variables section of the Project Settings page.


