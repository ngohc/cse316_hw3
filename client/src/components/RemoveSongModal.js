import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function RemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    let songName = "asd";
    if (store.currentList) {
        songName = store.songMarkedForRemoval;
        console.log("song name:" + songName);
        console.log("remove index:" + store.toRemoveIndex);

    } else {
        console.log("No current list")
    }

    function handleConfirmRemoveSong(event) {
        // actually deletes it
            // only want to delete on Confirm
        store.removeSong(store.toRemoveIndex);   // need to add it
    }

    function handleCancelRemoveSong(event) {
        store.hideRemoveSongModal();    // need to add it
    }

    return (
        <div
            id="remove-song-modal"
            className="modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog" id='verify-delete-list-root'>
                <header className="dialog-header">
                    Remove song?
                </header>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently remove <b>{songName}</b> from the playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" id="remove-song-confirm-button" className="modal-button" onClick={handleConfirmRemoveSong} value='Confirm' />
                    <input type="button" id="remove-song-cancel-button" className="modal-button" onClick={handleCancelRemoveSong} value='Cancel' />
                </div>
            </div>
        </div>
    );
}

export default RemoveSongModal;