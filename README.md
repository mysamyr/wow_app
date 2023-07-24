# App for game WOW (WorldOfWords) on NodeJs + MongoDB.

## Setup

Required stack:

- [node](https://nodejs.org/en/download/releases/) v16
- [yarn](https://yarnpkg.com/cli/install)

Setup steps:

1. `git clone git@github.com:mysamyr/wow_app.git`
2. `cd wow-app`
3. add `keys-dev.js` file to `src/config` folder
4. `yarn install`
5. `yarn start` | `yarn start:dev` to start api
6. `yarn open:win` | `yarn open:mac` to open html page

## Links

- [Game](https://play.google.com/store/apps/details?id=kz.codev.wowua)
- [GitHub](https://github.com/mysamyr/garden-API)
- [MongoDB Doc](https://www.mongodb.com/docs/)

## Endpoints

- POST / Add new word
- GET / Query words according to parameters
- DELETE /[:word] Delete not correct word

## Logic

- Add new word by typing word in first input and submit
- Query word using **panel with characters**, word mush include and schema (second input).
- Schema's logic:
  - `-` - unknown char
  - `{char}` - type character on right position
  - can not be empty
  - minimum 3 characters
  - e.g. `--e` can be `eye, bye, age, ate, ...`
- Third input is for deleting wrong added word
