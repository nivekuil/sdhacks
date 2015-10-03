var osc = require('node-osc');
var sumAvg = [];
//var url = "

var getAverage = function (msg, error) {
  if (error) {
    console.log(error);
  } else {

    //Only calc. avg if it is in beta session
    if (msg[0].indexOf("beta") != -1) {
      var avg = (msg[1] + msg[2] + msg[3] + msg[4]) * (1/4);
      //console.log("Average Beta (0-3): " + avg);
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
      console.log("Sum of ten averages: " + tenSum);
      /*
      if (tenSum > 10) {
        httpget(url);
      }
      */
    }
  }
}

var oscServer = new osc.Server(3334, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {
  //console.log("TUIO message:");
  //console.log(msg);
  getAverage(msg);
});
