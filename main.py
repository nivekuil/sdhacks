from flask import Flask, request
from twilio.rest import TwilioRestClient
from twilio.twiml import Response
from datetime import datetime


TWILIO_SID = "AC9867a6902e33cabe8d4085354077882a"
TWILIO_TOKEN = "5298d24f86066d604ce7c690f29b7595"
TWILIO_NUMBER = "+13238922618"

app = Flask(__name__)

client = TwilioRestClient(TWILIO_SID, TWILIO_TOKEN)

app.config['is_silent'] = False

user_num = "+18322820708"

app.config['message_queue'] = []

@app.route("/")
def main():
    print(app.config)
    if app.config['is_silent']:
        return "silent"
    else:
        return "not silent"

@app.route("/text", methods=['GET', 'POST'])
def text():
    request_body = request.form["Body"]

    msg_body = "Message from " + request.form["From"] + " at " \
    + datetime.now().strftime('%H:%M:%S') + ": " + request_body

    if app.config['is_silent']:
        resp = Response()
        resp.message("Will is busy right now. \
        Your messages will be sent when he is available.")
        print("Tried to contact someone in silent mode.")
        app.config['message_queue'].append(msg_body);
        return str(resp)

    else:
        print("Not busy right not, let the sms go through")
        print(msg_body)
        msg = client.messages.create(
            to=user_num,
            from_=TWILIO_NUMBER,
            body=msg_body,
        )
        return msg.sid

@app.route("/silent_on", methods=['GET', 'POST'])
def silent_on():
    app.config['is_silent'] = True
    print("Silent is now ", app.config['is_silent'])
    return "Silent mode on."

@app.route("/silent_off", methods=['GET', 'POST'])
def silent_off():
    app.config['is_silent'] = False
    print("Silent is now ", app.config['is_silent'])
    for message in app.config['message_queue']:
        print("Sending message " + message)
        client.messages.create(to=user_num,
                               from_=TWILIO_NUMBER,
                               body=message,)
        message.pop(0)
    return "Silent mode off."

if __name__ == "__main__":
    app.run(debug=True)
