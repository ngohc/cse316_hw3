/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

router.post('/playlist', PlaylistController.createPlaylist)

// individual playlist obj by id
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.put('/playlist/:id', PlaylistController.updatePlaylistById)
router.delete('/playlist/:id', PlaylistController.deletePlaylistById)

// all playlists
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)   // gets ID and name of playlist

module.exports = router