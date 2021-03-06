var osc = require('node-osc'),
    https = require('https'),
    http = require('http'),
    express = require('express'),
    path = require('path');

var app = express();
var silentStatus;
var message;

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/poll', function(req, res) {
  res.status(200).send({
    silentStatus: silentStatus,
    b0: message[1],
    b1: message[2],
    b3: message[3],
    b4: message[4]
  });    
});

var sumAvg = [];
var url = "https://sdhacks.herokuapp.com/";
var counter = 0;

var getAverage = function (msg, error) {
  if (error) {
    console.log(error);
  } else {

    //Only calc. avg if it is in beta session
    if (msg[0].indexOf("beta") != -1) {
      var avg = (msg[1] + msg[2] + msg[3] + msg[4]) * (1/4);
      sumTenAverage(avg);
    } else {
      console.log("Was not beta session");
    }
  }
}

var addSumAvg = function (sumAvg, error) {
  if (error) {
    console.log(error);
  } else {
    
    var retSum = 0;
    var index = 0;
    for (index = 0; index < sumAvg.length; index++) {
      retSum += sumAvg[index];
    }
    return retSum;
  }
}

var sumTenAverage = function (avg, error) {
  if (error) {
    console.log(error);
  } else {

    var tenSum = 0;
    if (sumAvg.length > 19) {
      sumAvg.shift();
    }
    sumAvg.push(avg);

    if (sumAvg.length > 19) {
      tenSum = addSumAvg(sumAvg); 
      console.log("Average beta wave concentration (0-3): " + tenSum);
      
      if (tenSum > 10 && counter > 100) {
        console.log("silent_on, cannot recieve text");
        https.get(url + "silent_on");
        silentStatus = true;
        counter = 0;
      }

      if (tenSum <= 10 && counter > 100) {
        console.log("silent_off, can recieve text");
        https.get(url + "silent_off");
        silentStatus = false;
        counter = 0;
      }
    }
  }
}

var oscServer = new osc.Server(3334, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {
  counter++;
  message = msg;
  getAverage(msg);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
