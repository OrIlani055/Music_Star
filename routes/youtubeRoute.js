const router = require('express').Router();
const { google } = require('googleapis');

var youtube = google.youtube({
    version: 'v3',
    auth: process.env.google_api_key
});

router.get('/search/:q', (req, res) => {
    youtube.search.list({
        part: 'snippet',
        order: 'viewCount',
        type: 'playlist',
        q: req.params.q
    }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            res.status(200).json(data.data.items);
        }
    });
});

module.exports = router;
