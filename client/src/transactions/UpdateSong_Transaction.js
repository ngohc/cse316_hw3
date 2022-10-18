import jsTPS_Transaction from "../common/jsTPS.js"

export default class UpdateSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initOldsong, initNewSong) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.oldSongData = initOldsong;
        this.newSongData = initNewSong;
    }

    doTransaction() {
        this.store.updateSong(this.index, this.newSongData);
    }
    
    undoTransaction() {
        this.store.updateSong(this.index, this.oldSongData);
    }
}