var http             = require('http');
var express          = require('express');
var app              = express();
var server           = http.createServer(app);
var multipart        = require('connect-multiparty');
var bodyParser       = require('body-parser');
var mongoose         = require('mongoose');
var colors           = require('colors');
var redis            = require('redis');
var client           = redis.createClient();
var io               = require('socket.io')(server);
var serverConf       = {
  tmp  : "app/components",
  port : 4004,
  ip   : "localhost",
  start: function() {
    console.log('server started @'.blue    +
                ' http://'.green           +
                serverConf.ip + ':'.green  +
                colors.red(serverConf.port)+
                '/'.green);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multipart({
  uploadDir: serverConf.tmp
})); 

app.use('/', express.static(__dirname + '/app'));
app.use('/bower_components', 
        express.static(__dirname + '/bower_components'));

mongoose.connect("mongodb://localhost:27017/scratch", 
  function(err) {
    if (err) { 
      console.log("ERROR: something went ".red        +
                  "wrong connecting to MongoDB. ".red +
                  "Are you sure you've started ".red  +
                  "the service?".red);
    } else {
      console.log('Successfully connected to MongoDB!'.green);
    }
});

var searches = new mongoose.Schema({
  city:{},
  loc:{},
  pop:{},
  state:{},
  created: { type: Date, default: Date.now }
});

var search = mongoose.model('search', searches);

io.on('connection', function(socket) {
  var same = '';
  socket.on('kp', function(data, fn) {
    if (data === "" || data === undefined || data === null) {
      data = 0;
      same = data;
    } else if (data === same) {
      //do nothing
    } else {
      same = data;
      client.zrangebylex(['searches0', 
                          '[' + data,
                          '[' + data + 'z'],
        function(err, areas) {
          if (areas.length === 0) {
            socket.emit('noresults', {status:"no results"});
          } else if (areas.length > -1) {
            client.sunion(areas, function(err, response) {
              adSearch(socket, response);
            });
          }
      });
    }
  });
});

function adSearch(socket, response) {
  var nums = response.length;
  search.find({'_id': { $in: response }}, 
              {email: 0, password: 0}, { skip: 0, limit: 100 }, 
              function(err, posts) {
                if (err) { 
                  console.log(err);
                } else {
                  socket.emit('results', {results: 
                                            {
                                              posts: posts,
                                              num  : nums 
                                            }
                                         
                                         });
                }
  });
 
}

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
      }
  }
  return a;
}

server.listen(
  serverConf.port, 
  serverConf.ip, 
  serverConf.start()
);
