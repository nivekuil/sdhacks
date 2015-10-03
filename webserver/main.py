from flask import Flask, request
from twilio.rest import TwilioRestClient
from twilio.twiml import Response

### Play nice with pythonanywhere
import os
from urlparse import urlparse

from twilio.rest.resources import Connection
from twilio.rest.resources.connection import PROXY_TYPE_HTTP

proxy_url = os.environ.get("http_proxy")
host, port = urlparse(proxy_url).netloc.split(":")
Connection.set_proxy_info(host, int(port), proxy_type=PROXY_TYPE_HTTP)
###

TWILIO_SID = "AC9867a6902e33cabe8d4085354077882a"
TWILIO_TOKEN = "5298d24f86066d604ce7c690f29b7595"
TWILIO_NUMBER = "+13238922618"

app = Flask(__name__)

client = TwilioRestClient(TWILIO_SID, TWILIO_TOKEN)

is_silent = False

user_num = "+18322820708"

@app.route("/text", methods=['GET', 'POST'])
def text():
    request_body = request.args.get("body")
    if is_silent:
        resp = Response()
        resp.message("Will is busy right now.")
        return str(resp)
    else:
        txt = request_body
        msg = client.messages.create(
            to=user_num,
            from_=TWILIO_NUMBER,
            body=request_body,
        )
        #send sms

@app.route("/silent_on", methods=['GET', 'POST'])
def silent_on():
    print("silent_on")
    silent = True

@app.route("/silent_off", methods=['GET', 'POST'])
def silent_off():
    print("silent_off")
    silent = False

if __name__ == "__main__":
    app.run(debug=True)
