const { google } = require('googleapis');
const OAuth2Data = require('../google_key.json');
const model = require('../DB/googleSchema');
const userController = require('./userController');


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
            scope:['https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
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
                //console.log(oAuth2Client);
                createGoogleUser(tokens);
                userInfo(tokens)
                res.redirect('/');
            }
        });
    }
}



async function createGoogleUser(body) {
    try {
        //console.log(body);
        const data = await model.createNewClientUser(body);

    } catch (err) {
        console.log(err);
    }
}

async function profileview (data){
         try {
           let user = await model.find({ _id:("5e3eaf79db8c6030232c930a")}, { '_id': false, '__v': false},
                err => {
                    if (err) throw err;
                }
            );
            //userInfo(data);
           //console.log(user);
            oAuth2Client.setCredentials({refresh_token: user[0].refresh_token});
            //console.log(oAuth2Client);
            
  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
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
async function userInfo(data){
    // let user = await model.find({ _id:("5e3eaf79db8c6030232c930a")}, { '_id': false, '__v': false},
    // err => {
    //     if (err) throw err;
    //  }
    // );
    console.log(data);
    var OAuth2 = google.auth.OAuth2;
    var oauth2Client = new OAuth2();
    oauth2Client.setCredentials({access_token: data.access_token});
    var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    oauth2.userinfo.get(
      function(err, res) {
        if (err) {
           console.log(err);
        } else {
            userController.createClientUser(res);
           //console.log(res);

        }
    });}

module.exports = {
    startauth,
    googleCallBack,
    createGoogleUser,
    profileview,
    userInfo
};


