const { google } = require('googleapis');
const { PlaylistModel,SongModel } = require('../DB/youtubeSchema');
const model = require('../DB/googleSchema');
const ErrHandler = require('../helpers/errHandler');


model.findOneAndDelete
var youtube = google.youtube({
    version: 'v3',
    auth: process.env.google_api_key
});



class YoutubePlaylist{

    static async searchPlaylist(req,res){
        let user = await model.find({ "email":"arieell25@gmail.com"},
        err => {if (err) throw err;}
        );
        
        let pref = user[0].music_pref;
        const randompref = pref[Math.floor(Math.random(0-2) * pref.length)];
        
        youtube.search.list({
            part: 'snippet',
            type: 'playlist',
            q: randompref
            }, function (err, data) {
                if (err) {
                    console.error('Error: ' + err);
                }
                if (data) {
                    res.status(200).json(data.data.items);
                    }
            });
    };

    static async insertToplaylist(req, res) {
        try {
            let obj = await PlaylistModel.getPlaylist(req.params.playlist);
            let playlist;
            if (obj.length != 0) {
                playlist = obj[0];
            }

            let song = SongModel({
                name: req.body.songName,
                vid: req.body.videoID
            });

            if (playlist) {
                playlist.songs.push(song);
                PlaylistModel.updatePlaylist(playlist);
            } else {
                playlist = PlaylistModel({
                    id: req.params.playlist,
                    name: "Temp Name",
                    songs: [song]
                });
                await playlist.save();
            }

            res.status(200).send('Succesfully inserted');
        } catch (err) {
            ErrHandler.handle(res, err);
        }
    };

    static async create(req, res) {
        console.log(req.params.id);
        try {
            let playlist = PlaylistModel({
                id: req.params.id,
                name: req.body.playlistName
            });

            if ((await playlist.exists()).length != 0) throw {
                status: 409,
                message: 'A playlist with this id already exists'
            };

            if (req.body.songs) {
                let songsArr = req.body.songs;
                songsArr.forEach(element => {
                    if (!element.songName || !element.videoID) throw {
                        status: 403,
                        message: 'Missing Song Variables'
                    };
                    let song = SongModel({
                        name: element.songName,
                        vid: element.videoID
                    });
                    playlist.songs.push(song);
                });
            }

            await playlist.save();
            res.status(200).send('Successfully created');
        } catch (err) {
            ErrHandler.handle(res, err);
        }
    };

    static async update(req, res) {
        try {
            let obj = await PlaylistModel.getPlaylist(req.params.id);
            if (obj.length == 0) throw {
                status: 409,
                message: 'A playlist with this id doesnt exists'
            };
            obj = obj[0];
            if (req.body.playlistName) obj.name = req.body.playlistName;
            if (req.body.songs) {
                req.body.songs.forEach(element => {
                    if (!element.name || !element.vid) throw {
                        status: 409,
                        message: 'Incorrect song array format.'
                    };
                });
                obj.songs = req.body.songs;
            }
            let msg = 'Playlist already up to date!';
            let result = await PlaylistModel.updatePlaylist(obj);
            if (result.nModified != 0)
                msg = 'Updated Succesfully';

            res.status(200).send(msg);
        } catch (err) {
            ErrHandler.handle(res, err);
        }
    };

    static async delete(req, res) {
        try {
            let obj = await PlaylistModel.getPlaylist(req.params.id);
            if (obj.length == 0) throw {
                status: 409,
                message: 'A playlist with this id doesnt exists'
            };
            obj = obj[0];
            await PlaylistModel.deletePlaylist(obj._id);
            res.status(200).send('Successfully removed playlist');
        } catch (err) {
            ErrHandler.handle(res, err);
        }
    };

    static async read(req, res) {
        try {
            let obj = await PlaylistModel.getPlaylist(req.params.id);
            if (obj.length == 0) throw {
                status: 409,
                message: 'A playlist with this id doesnt exists'
            };
            res.status(200).json(obj);
        } catch (err) {
            ErrHandler.handle(res, err);
        }
    };

    static async readAll(req, res) {
        try {
            let obj = await PlaylistModel.getPlaylists();
            if (obj.length == 0) throw {
                status: 409,
                message: 'A playlist with this id doesnt exists'
            };
            res.status(200).json(obj);
        } catch (err) {
            ErrHandler.handle(res, err);
        }
    };

}

module.exports = YoutubePlaylist;





// const CLIENT_ID = process.env.google_client_id;
// const CLIENT_SECRET = process.env.google_client_secret;
// const REDIRECT_URL = process.env.google_client_redirect;
// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


// async function ssearchPlaylist(req,res){
//     let user =  await Googlemodel.findUserByEmail('arieell25@gmail.com');
//     console.log(user[0].google);
//     oAuth2Client.setCredentials({access_token: user[0].google.access_token});
//     console.log(oAuth2Client);
//     const youtube = google.youtube({
//         version: 'v3',
//         auth: oAuth2Client
//     });
//     youtube.search.list({
//         part: 'snippet',
//         order: 'viewCount',
//         q: req.params.q
//         }, function (err, data) {
//             if (err) {
//                 console.error('Error: ' + err);
//             }
//             if (data) {
//                 res.status(200).json(data.data.items);
                
//             }
//         });
// };