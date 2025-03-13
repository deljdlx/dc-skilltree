class TreeEventManager {
    constructor(tree, reactiveStore, storage, editor) {
        this._tree = tree;
        this._store = reactiveStore;
        this._storage = storage;
        this._editor = editor;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this._tree.addEventListener('ready', () => {
            this._store.ready = true;
            this._tree.selectNodeById('root');
        });

        this._tree.addEventListener('change', () => {
            this._store.generateChecksum();
            this._storage.set(this._store.getData());
        });

        this._tree.addEventListener('delete', (event, data) => {
            this._tree.selectNodeById(data.parent);
        });

        this._tree.addEventListener('move', (event, data) => {
            const node = this._store.getNodeById(data.node.id);
            this.updateNodeProfile(node, data.parent);
            this._tree.selectNodeById(data.parent);
        });
    }
}
