var body = document.body;
var zenStatus = document.getElementById("zenStatus");

var isSilent = false;

function requestFromServer() {
  $.get('http://127.0.0.1:3000/poll', function (data) {
    if (data) {
      if (data['silentStatus'] == false) {
        if (isSilent) {
          console.log("unblocked");
          body.style.backgroundColor = "#6495ED";
          zenStatus.style.color = "blue";
          zenStatus.innerHTML = "awake";
          $('#words').text("Get working.").hide().fadeIn('slow');
          isSilent = false;
        }
      } else if (data['silentStatus'] == true) {
          if (!isSilent) {
            console.log("blocked");
            body.style.backgroundColor = "#66CD00";
            zenStatus.style.color = "green";
            zenStatus.innerHTML = "asleep";
            $('#words').text(
              "Calls, texts, and other distractions are now being blocked.")
              .hide().fadeIn('slow');
            isSilent = true;
          }
      }
    }
    setTimeout(requestFromServer, 2000);
  });
}
requestFromServer();
