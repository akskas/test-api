# Simple Node.js API setup using TypeScript

This is a simple NodeJs API which has two routes. One to upload a list of users and one to login a user using Basic authentication method.

The detailed documentation for these API is [here](/docs/).

---
## Pre-requisites
  * Node.Js (10+)
  * NPM (6+)

---
## Start API
  * Create `.env` at the root of the project. Add the environments variables specified in [.env.example](/.env.example) file. If `.env` file is not provided then `.env.example` file is used by default.
  * `npm install`
  * For running API in production mode:
      * Install `forever` module globally" `sudo npm install forever -g`
      * To build the project: `npm run build`
      * To start the server: `npm run start`
      * To stop the server: `npm run stop`

  * For dev mode run: `npm run dev`
