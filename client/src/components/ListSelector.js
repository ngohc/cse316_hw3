import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteListModal from '../components/DeleteListModal.js';

/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        console.log("new list");
        store.createNewList();
    }
    let listCard = "";

    // is listnameactive or store.currentlist
    // canaddlist = false
    let canAddSong = false;
    if (store.listNameActive && !store.currentList===null) {
        canAddSong = true;
    }

    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-list">
            <div id="playlist-selector-heading">
                <input
                    type="button"
                    id="add-list-button"
                    disabled={canAddSong}
                    onClick={handleCreateNewList}
                    className="playlister-button"
                    value="+" 
                />
                Your Lists
            </div>                
            {listCard}
            <DeleteListModal />
            </div>
        </div>)
}

export default ListSelector;