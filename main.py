from flask import Flask, request
from twilio.rest import TwilioRestClient
from twilio.twiml import Response

TWILIO_SID = "AC9867a6902e33cabe8d4085354077882a"
TWILIO_TOKEN = "5298d24f86066d604ce7c690f29b7595"
TWILIO_NUMBER = "+13238922618"

app = Flask(__name__)

client = TwilioRestClient(TWILIO_SID, TWILIO_TOKEN)

is_silent = False

user_num = "+18322820708"

@app.route("/")
def main():
    return "Hello"

@app.route("/text", methods=['GET', 'POST'])
def text():
    print("Silent status is ", is_silent)
    print("Silent status is ", is_silent)
    print("Silent status is ", is_silent)
    print("Silent status is ", is_silent)
    if is_silent:
        resp = Response()
        resp.message("Will is busy right now.")
        print("Tried to contact someone in silent mode.")
        return str(resp)
    else:
        print("Not busy right not, let the sms go through")
        request_body = request.args.get("Body")
        print(request_body)
        msg = client.messages.create(
            to=user_num,
            from_=TWILIO_NUMBER,
            body=request_body,
        )
        return msg.sid

@app.route("/silent_on", methods=['GET', 'POST'])
def silent_on():
    is_silent = True
    print("Silent is now %s", is_silent)
    return "Silent mode on."

@app.route("/silent_off", methods=['GET', 'POST'])
def silent_off():
    is_silent = False
    print("Silent is now %s", is_silent)
    return "Silent mode off."

if __name__ == "__main__":
    app.run(debug=True)
