# This is Project Hex (working title)
A turn-based strategy game with gods and peasants.

##Installation & Scripts
To get started you are going to need [Node v5.0+](https://nodejs.org/en/) and [BASH](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) (only for deploying). Windows users can use a tool like: [CASH](https://github.com/dthree/cash) or [Cygwin](https://www.cygwin.com/). Then clone this repository either with a GUI or with the following command:

  $ git clone https://github.com/Swiftwork/project-hex

Finally install all dependencies with:

  $ npm install

Bellow are a list of NPM scripts that you can run to aid development.

|Command|Description|
|---|---|
|`npm start`|Compiles the game and serves a local node against the dev environment|
|`npm run build:[prod|dev]`|Compiles the game against the targeted environment|
|`npm run deploy`|Runs a bash script to deploy the latest commit to gh-pages|
|`npm test`|Not yet added|

Now you are ready to build with ❤!

<!--
##Folder Structure
This is the general structure with a few files omitted for clarity's sake.

  trutoo-starter-kit/
  ├─── build/
  │    ├─── public/
  │    │    ├─── assets/
  │    │    │    ├─── debug/         Temp folder for hot reload files
  │    │    │    └─── *.*            All assets requested through require/import
  │    │    │
  │    │    ├─── main.js             JS entry point for browsers
  │    │    └─── main.css            CSS entry point for browsers (production only)
  │    │   
  │    ├─── assets.json              References to files hash id based on file name
  │    └─── server.js                Main express server compiled
-->

##Game Dependencies

|Plugin|Version|
|---|---|---|
|babylonjs|^2.4.1|
|core-js|^2.4.1|
|handjs|^1.3.11|

##Development Dependencies

|Plugin|Version|
|---|---|---|
|babylon-file-loader|^0.1.0|
|file-loader|^0.9.0|
|html-webpack-plugin|^2.22.0|
|path|^0.12.7|
|pug|^2.0.0-beta6|
|pug-loader|^2.3.0|
|raw-loader|^0.5.1|
|rimraf|^2.5.4|
|ts-loader|^0.8.2|
|typescript|^2.0.2|
|typings|^1.3.3|
|webpack|^1.13.2|
|webpack-dev-server|^1.16.1|
|webpack-merge|^0.14.1|