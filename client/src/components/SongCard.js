import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import RemoveSongModal from '../components/RemoveSongModal.js';
import EditSongModal from '../components/EditSongModal.js';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editSongActive, setEditSongActive] = useState(false);
    const [draggedTo, setDraggedTo] = useState(0);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1, target.id.indexOf("-") + 2);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1, target.id.indexOf("-") + 2);

        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function handleRemoveSong() {
        store.markSongForRemoval(song.title, song, index);
    }

    function handleClick(event) {
        if (event.detail === 2) {
            store.markSongForEdit(song, index, song.artist, song.title, song.youTubeId);
        }
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
            <RemoveSongModal />
            <EditSongModal />
        </div>
    );
}

export default SongCard;