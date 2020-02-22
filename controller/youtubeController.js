const { google } = require('googleapis');
const model = require('../DB/googleSchema');


var youtube = google.youtube({
    version: 'v3',
    auth: process.env.google_api_key
});


async function searchPlaylist(req,res){
    youtube.search.list({
        part: 'snippet',
        order: 'viewCount',
        type: 'playlist',
        q: req
    }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            res.status(200).json(data.data.items);
        }
    });
}

module.exports = searchPlaylist;