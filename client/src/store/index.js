import { createContext, StrictMode, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_REMOVAL: "MARK_SONG_FOR_DELETION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        listNameForDeletion: null,
        songMarkedForRemoval: null,
        toRemoveIndex: null,
        toRemoveTitle: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    listNameForDeletion: null,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    listNameForDeletion: null,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    listNameForDeletion: null,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    listNameForDeletion: null,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload.id,
                    listNameForDeletion: payload.name,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                });
            }
            // PREPARE TO REMOVE A SONG
            case GlobalStoreActionType.MARK_SONG_FOR_REMOVAL: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songMarkedForRemoval: payload.song,
                    listNameForDeletion: null,
                    toRemoveIndex: payload.toRemoveIndex,
                    toRemoveTitle: payload.toRemoveTitle
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    listNameForDeletion: null,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    listNameForDeletion: null,
                    songMarkedForRemoval: null,
                    toRemoveIndex: null
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.createNewList = function () {
        async function asyncCreateNewList() {
            let playlistName = "Untitled" + store.newListCounter;
            let newPlaylistObj = {name : playlistName, song : []};
            let response = await api.createPlaylist(newPlaylistObj);

            if (response.data.success) {
                let newPlaylist = response.data.playlist;
                storeReducer({ 
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: newPlaylist
                });
                store.history.push("/playlist/" + newPlaylist._id);
            } else {
                console.log("Could not create a new list")
            }
        }
        asyncCreateNewList();
    }

    // 1. mark list for deletion (NO DELETION YET)
    store.markListForDeletion = function (id, playlistName) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {
                name: playlistName,
                id: id
            }
        });
        store.showDeleteListModal();
    }

    // 2. begins process of deleting marked list (NO DELETION YET)
    store.deleteMarkedList = function() {
        store.deletePlaylist(store.listMarkedForDeletion);
        store.hideDeleteListModal();
    }

    // 3. actually deletes the list
    store.deletePlaylist = function (id) {
        async function asyncDeleteList(id) {
            let response = await api.deletePlaylistById(id);
            
            if (response.data.success) {
                store.loadIdNamePairs();
                store.history.push("/");
            } else {
                console.log("No response. Did not delete list")
            }
        }
        asyncDeleteList(id);
    }

    store.showDeleteListModal = function () {
        let deleteListModal = document.getElementById("delete-list-modal");
        deleteListModal.classList.add("is-visible");
    }

    store.hideDeleteListModal = function() {
        let deleteListModal = document.getElementById("delete-list-modal");
        deleteListModal.classList.remove("is-visible");
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }

            }
        }
        asyncSetCurrentList(id);
    }

    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            } else {
                console.log("Response unsuccessful");
            }
        }
        asyncUpdateCurrentList();
    }

    store.getPlaylistSize = function() {
        console.log("size of playlist:" + (store.currentList.songs.length+1));
        return store.currentList.songs.length;
    }
    
    // 1. inititate adding to the transaction stack
    store.addNewSong = function () {
        let index = store.getPlaylistSize();
        store.addCreateSongTrans(index, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }

    // 2. adds to transaction stack
    store.addCreateSongTrans = function(index, title, artist, youTubeId) {
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(this, index, song);
        tps.addTransaction(transaction);
    }

    // 3. actually creates the song and store in backend
    store.createSong = function(index, song) {
        store.currentList.songs[index] = song;
        store.updateCurrentList();
    }

    store.markSongForRemoval = function(songName, song, index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_REMOVAL,
            payload: {
                toRemoveIndex: index,
                song: song,
                toRemoveTitle: songName
            }
        });
        store.showRemoveSongModal();
    }

    store.removeMarkedSong = function () {
        store.removeSong(store.toRemoveIndex);
        store.hideRemoveSongModal();
    }
    // 3. actually removes the song and update in backend
    store.removeSong = function(index) {
        let songArr = store.currentList.songs;
        songArr.splice(index,1);
        store.updateCurrentList();
    }

    store.addRemoveSongTrans = function(song, index) {
        let transaction = new RemoveSong_Transaction(this, index, song);
        tps.addTransaction(transaction);
    }

    store.showRemoveSongModal = function () {
        let removeSongModal = document.getElementById("remove-song-modal");
        removeSongModal.classList.add("is-visible");
    }

    store.hideRemoveSongModal = function() {
        let removeSongModal = document.getElementById("remove-song-modal");
        removeSongModal.classList.remove("is-visible");
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}