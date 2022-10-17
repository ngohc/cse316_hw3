import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);

    let playlistName = "asd";
    if (store.currentList) {
        playlistName = store.listMarkedForDeletion;
    } else {
        console.log("No current playlist")
    }

    function handleConfirmDeleteList(event) {
        // actually deletes it
            // only want to delete on Confirm
        store.deleteMarkedList();
    }

    function handleCancelDeleteList(event) {
        store.hideDeleteListModal();
    }

    return (
        <div
            id="delete-list-modal"
            className="modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog" id='verify-delete-list-root'>
                <header className="dialog-header">
                    Delete the {playlistName} playlist?
                </header>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete the {playlistName} playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" id="remove-song-confirm-button" className="modal-button" onClick={handleConfirmDeleteList} value='Confirm' />
                    <input type="button" id="remove-song-cancel-button" className="modal-button" onClick={handleCancelDeleteList} value='Cancel' />
                </div>
            </div>
        </div>
    );
}

export default DeleteListModal;