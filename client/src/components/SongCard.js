import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import RemoveSongModal from '../components/RemoveSongModal.js';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleRemoveSong() {
        store.markSongForRemoval(song.title, song, index);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
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
        </div>
    );
}

export default SongCard;