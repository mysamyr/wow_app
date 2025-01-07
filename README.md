# App for game WOW (WorldOfWords) on NodeJs + MongoDB.

## Setup

Required stack:

- [node](https://nodejs.org/en/download/releases/) v20 or higher

Setup steps:

1. `git clone git@github.com:mysamyr/wow_app.git`
2. `cd wow-app`
3. add `.env` file to root according to `.env.example`
4. run `npm install` to install all dependencies
5. `npm run start` | `npm run start:dev` to start api

## Links

- [Game](https://play.google.com/store/apps/details?id=kz.codev.wowua)
- [GitHub](https://github.com/mysamyr/garden-API)
- [MongoDB Doc](https://www.mongodb.com/docs/)

## Endpoints

- POST / Add new word
- GET / Query words according to parameters
- DELETE /[:word] Delete not correct word
