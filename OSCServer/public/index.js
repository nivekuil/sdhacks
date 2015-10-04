var body = document.body;
var zenStatus = document.getElementById("zenStatus");

var isSilent = false;

body.addEventListener("click", function() {
    if (isSilent) {
        body.style.backgroundColor = "#6495ED";
        zenStatus.style.color = "blue";
        zenStatus.innerHTML = "awake";
        $('#words').text("Get working.").hide().fadeIn('slow');
        isSilent = false;
    } else {
        body.style.backgroundColor = "#66CD00";
        zenStatus.style.color = "green";
        zenStatus.innerHTML = "asleep";
        $('#words').text(
            "Calls, texts, and other distractions are now being blocked.")
            .hide().fadeIn('slow');

        isSilent = true;
    }
});
