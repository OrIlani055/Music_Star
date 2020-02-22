const router = require('express').Router();
const { google } = require('googleapis');
const youtubeController = require('../controller/youtubeController');

var youtube = google.youtube({
    version: 'v3',
    auth: process.env.google_api_key
});

router.get('/search/:q', (req, res) => {
   youtubeController.searchPlaylist(req.params.q,res);
});



module.exports = router;

