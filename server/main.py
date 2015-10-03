from flask import Flask
from twilio.twiml import Response

TWILIO_SID = "AC9867a6902e33cabe8d4085354077882a"
TWILIO_TOKEN = "5298d24f86066d604ce7c690f29b7595"
TWILIO_NUMBER = "+13238922618"

app = Flask(__name__)

@app.route("/text", methods=['GET', 'POST'])
def text():
    resp = Response()
    resp.message("Will is busy right now.")
    return str(resp)

if __name__ == "__main__":
    app.run(debug=True)
