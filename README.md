# Holmok - Remix / Fastify

My personal site that I am working on.

### Run Stuff

Create a `.env.local` file in the root, using the `.env.local.example` as a template.

Uses `nvm`, so `nvm use` to make sure your node version is good.

|Command|What it do|
|-|-|
|`$ yarn migrate up` | Runs the migrations to build the database parts |
|`$ yarn dev` | Runs locally in dev mode with formatted logging |
|`$ yarn build` | Runs to build |
|`$ yarn start:local` | Runs the built code locally with .env.local in production mode and with formatted logging|
|`$ yarn start` | Run in production with json logging to `stdout`|

