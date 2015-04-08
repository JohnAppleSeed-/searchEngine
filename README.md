This is a "search engine" built with:
  iojs/node + redis + mongodb + express + socket.io

This is for learning purposes only. It's very simple and "bare bones" and can probably be improved. 

![instant search](http://i.imgur.com/PGwqbC7.gif)

###Dependencies:

Must have MongoDB and Redis installed and running. Only tested with MongoDB V2.4.13 and Redis V2.8.19. See `bower.json` and `package.json` for info on pacjages that will be installed by `npm` and `bower`.

###Install

Clone the git repo and `cd` into the newly created directory:
```
$ git clone https://github.com/JohnAppleSeed-/searchEngine.git
$ cd searchEngine
```
Run commands to install dependencies and to add information to redis and mongodb:
```
$ npm install
$ node addtodb.js
```
Run:
```
$ node server.js
```

And navigate to the URL displayed (default: `localhost:4004`) to test.
