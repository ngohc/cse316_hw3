const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }
    
    // save creates a new record
    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found'})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}
// PUT
updatePlaylistById = async (req, res) => {
    const body = req.body
    console.log("updated playlist: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No body',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found',
            })
        }
        list.name = body.name
        list.items = body.items
        list
            .save()
            .then(() => {
                console.log("Successfully updated playlist");
                return res.status(200).json({
                    success: true,
                    id: list._id,
                    message: `Updated playlist ${list.name}`,
                })
            })
            .catch(error => {
                console.log("Failed to update playlist: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: `Did not update playlist ${list.name}`,
                })
            })
    })
}
// DELETE
deletePlaylistById = async (req, res) => {
    console.log("delete list id: " + req.params.id);
    await Playlist.findOneAndDelete({ _id: req.params.id }, () => {
        return res.status(200).json({ success: true});
    }).catch(err =>  {
        console.log("Error: " + err);
        return res.status(400).json({ success: false })
    })
}



module.exports = {
    createPlaylist,
    getPlaylists,
    updatePlaylistById,
    deletePlaylistById,
    getPlaylistPairs,
    getPlaylistById
}