const { Schema, model } = require('mongoose');

const song = new Schema({
        name: {
            type: String,
            required: true
        },
        vid: {
            type: String,
            required: true
        }
},{ collection: "songs" });;

const playlist = new Schema({
        id : {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        songs: [song]
    }, {
        timestamps: true,
},{ collection: "plyalists" });;

playlist.static('getPlaylists', async function () {
    return await this.find({}, (err, res) => {
        if (err) throw err;
    });
});

playlist.static('getPlaylist', async function (id) {
    return await this.find({id: id}, (err, res) => {
        if (err) throw err;
    });
});

playlist.static('deletePlaylist', async function (id) {
    return await this.deleteOne({ _id: id }, (err) => {
        if (err) throw err;
    });
});

playlist.static('updatePlaylist', async function (obj) {
    return await this.updateOne({ _id: obj._id }, obj);
});

playlist.method('exists', async function () {
    return await this.model('Playlist').find({id:this.id},(err, res)=>{
        if(err) throw err;
    })
});

let PlaylistModel = model('Playlist', playlist);
let SongModel = model('Song',song);

module.exports = {PlaylistModel, SongModel};