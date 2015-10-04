var osc = require('node-osc');
var https = require('https');
/*
var optionsOn = {
  hostname: 'sdhacks.herokuapp.com/silent_on',
  port: 80,
  method: 'GET'
};

var optionsOff = {
  hostname: 'sdhacks.herokuapp.com/silent_off',
  port: 80,
  method: 'GET'
};
*/

var sumAvg = [];
var url = "https://sdhacks.herokuapp.com/";
var counter = 0;

var httpAsyncGetOn = https.get(url + "silent_on");
var httpAsyncGetOff = https.get(url + "silent_off");

var httpAsyncGet = function (url, callback) {
  var xhmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", url, true); //for Async
  xmlHttp.send(1); //send whatever
}

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
        counter = 0;
      }

      if (tenSum <= 10 && counter > 100) {
        console.log("silent_off, can recieve text");
        https.get(url + "silent_off");
        counter = 0;
      }
    }
  }
}

var oscServer = new osc.Server(3334, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {
  //console.log("TUIO message:");
  //console.log(msg);
  counter++;
  getAverage(msg);
});
