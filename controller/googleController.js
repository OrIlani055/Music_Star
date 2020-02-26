const { google } = require('googleapis');
const model = require('../DB/googleSchema');


const CLIENT_ID = process.env.google_client_id;
const CLIENT_SECRET = process.env.google_client_secret;
const REDIRECT_URL = process.env.google_client_redirect;


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var authed = false;

async function startauth(req, res) {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope:['https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/youtube']
        });
        //console.log(url)
        res.json(url);
    }
}

let myauth;

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
                console.log(tokens);
                myauth = tokens;
                createGoogleUser();
                res.redirect('http://localhost:3000/#');
            }
        });
    }
}

async function createGoogleUser() {
    try {
        console.log('issue here')
        console.log(myauth.refresh_token);
        await model.createGoogleUser(myauth);
        userInfo(myauth)

    } catch (err) {
        console.log(err);
    }
}

async function userInfo(data){
   let user = await model.find({ "google.refresh_token":data.refresh_token},
    err => {
        if (err) throw err;
     }
    );
    let objID = console.log(user[0]);
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
                let update = {
                    google_id: res.data.id,
                    email: res.data.email,
                    name: res.data.name
                };
                console.log(update);
                
                model.updateOne(objID, update,
                err => { if (err) throw err;}
                );
        }
    });
}

async function profileview (data){
        try {
               let user = await model.findUserByEmail('orilani055@gmail.com');
               oAuth2Client.setCredentials({refresh_token: user[0].google.refresh_token});
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


module.exports = {
    startauth,
    googleCallBack,
    createGoogleUser,
    profileview,
};


