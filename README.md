This is a "search engine" built with:
  iojs/node + redis + mongodb + express + socket.io

This is for learning purposes only.

![instant search](http://i.imgur.com/PGwqbC7.gif)

###Install

clone the git repo and cd into the newly created directory:
```
$ git clone https://github.com/JohnAppleSeed-/searchEngine.git
$ cd searchEngine
```
Run comamnds to install dependencies and to add information to redis and mongodb:
```
$ npm install
$ node addtodb.js
```
Run:
```
$ node server.js
```

And navigate to the URL displayed (default: localhost:4004) to test.
