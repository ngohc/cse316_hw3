import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [ title, setTitle ] = useState("bloop");        
    const [ artist, setArtist ] = useState("");        
    const [ youtubeId, setYouTubeId ] = useState("");   

    function handleConfirmEditSong(event) {
        let newSongData = {
            title: title,
            artist: artist,
            youtubeId: youtubeId
        }
        store.addUpdateSongTrans(store.songMarkedForEditIndex, newSongData);
    }

    function handleCancelEditSong(event) {
        store.hideEditSongModal();
    }

    function handleUpdateTitle(event) {
        setTitle(event.target.value);
    }

    function handleUpdateArtist(event) {
        setArtist(event.target.value);
    }

    function handleUpdateYouTubeId(event) {
        setYouTubeId(event.target.value);
    }
    return (
        <div
            id="edit-song-modal"
            className="modal"
            data-animation="slideInOutLeft">
            <div
                id='edit-song-root'
                className="modal-dialog">
                <div
                    id="edit-song-modal-header"
                    className="modal-north">Edit Song</div>
                <div
                    id="edit-song-modal-content"
                    className="modal-center">
                    <div id="title-prompt" className="modal-prompt">Title:</div>
                    <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" defaultValue={store.songMarkedForEditTitle} onChange={handleUpdateTitle} />
                    <div id="artist-prompt" className="modal-prompt">Artist:</div>
                    <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" defaultValue={store.songMarkedForEditArtist} onChange={handleUpdateArtist} />
                    <div id="you-tube-id-prompt" className="modal-prompt">You Tube Id:</div>
                    <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" defaultValue={store.songMarkedForEditYoutubeId} onChange={handleUpdateYouTubeId} />
                </div>
                <div className="modal-south">
                    <input type="button" id="edit-song-confirm-button" className="modal-button" value='Confirm' onClick={handleConfirmEditSong} />
                    <input type="button" id="edit-song-cancel-button" className="modal-button" value='Cancel' onClick={handleCancelEditSong} />
                </div>
            </div>
        </div>
    );
}

export default EditSongModal;