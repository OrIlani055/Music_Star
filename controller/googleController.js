const { google } = require('googleapis');
const OAuth2Data = require('../google_key.json');
const model = require('../DB/googleSchema');


const CLIENT_ID = OAuth2Data.client.id;
const CLIENT_SECRET = OAuth2Data.client.secret;
const REDIRECT_URL = OAuth2Data.client.redirect

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var authed = false;

async function startauth(req, res) {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope:['https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/oauth2/v2/userinfo']
        });
        console.log(url)
        res.redirect(url);
    }
}

async function googleCallBack(req, res){
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                createGoogleUser(tokens);
                res.redirect('/');
            }
        });
    }
}



async function createGoogleUser(body) {
    try {
        console.log(body);
        const data = await model.createNewClientUser(body);

    } catch (err) {
        console.log(err);
    }
}

async function profileview (req,res){
        try {
            let data = await model.find({ _id: '5e3598e942ed8a4c05aed923'},
                err => {
                    if (err) throw err;
                }
            );
            console.log(data);
            //console.log(data.access_token);
            //console.log(data.refresh_token);

            const access = "ya29.Il-8B_0A99qBpanva-bvh1vKZvxhv8bT8D19ln2X25T3zbpUy1bgUtryWnC8X8s3_92dempOSjq23lyLMl6RjvATiP1KK5_0OEkP-x1pmWY7A3-60q_CAQznBYB0_dFnbQ"
            const refresh = "1//03ERTBW6GfC9OCgYIARAAGAMSNwF-L9IriLaliTnEjeZXJ559eSqmomS-nvo9FUEN1RUpCQvFzESC0RVveGfVStbjk_lK9iiatVY";
  const calendar = google.calendar({version: 'v3', access});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
        }catch (err) {
            console.log(err);
        }
}


module.exports = {
    startauth,
    googleCallBack,
    createGoogleUser,
    profileview
};