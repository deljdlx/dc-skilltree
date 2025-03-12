class TreeEditor {
    /**
     * @type {Storage}
     */
    _storage = null;

    /**
     * @type {Store}
     */
    _store = null;

    /**
     * @type {Tree}
     */
    _tree = null;

    _options = {
        storage: null,
        saveUrl: null,
        uploadUrl: null,
    }

    eventListeners = {
    }

    constructor(store, tree, options) {
        this._store = store;
        this._tree = tree;
        this._options = Object.assign(this._options, options);

        this._tree.getData().updateSelectedNode = async (event) => {
            return await this.handleNodeUpdate(event);

        };

        this._tree.addEventListener('select_node.jstree', async (event, data) => {
            setTimeout(() => {
                this.handleNodeSelection();
            }, 10);
        });

        const imagePasteHandler = new ImagePasteHandler(this._tree, this._options);
        imagePasteHandler.handle();
    }

    /**
     * @param {Storage} storage
     */
    setStorage(storage) {
        this._storage = storage;
        return this;
    }

    addEventListener(name, callback) {
        if (!this.eventListeners[name]) {
            this.eventListeners[name] = [];
        }

        this.eventListeners[name].push(callback);
    }

    handleEvent(name, e, data) {
        if (!this.eventListeners[name]) {
            return;
        }

        this.eventListeners[name].forEach(callback => {
            callback(e, data);
        });
    }

    async handleNodeSelection() {
        const fileHandler = new FileHandler(this._tree, this._options);
        fileHandler.handle();

        const codeHandler = new CodeHandler(this._tree, this._options);
        codeHandler.handle();

        const wysiwygHandler = new WysiwygHandler(this._tree, this._options);
        wysiwygHandler.handle();

        const contentTemplateHandler = new ContentTemplateHandler(this._tree, this._options);
        contentTemplateHandler.handle();
    }

    async handleNodeUpdate(event) {
        const selectedNode = this._tree.getData().selectedNode;
        this._tree.updateNode(selectedNode);
    }

    async load() {
        if (!this._options.storage) {
            return;
        }

        const data = await this._options.storage.get();
        if (!data) {
            return;
        }

        this._store.ready = false;
        this._store.setData(data);
        this._tree.destroy();
        this._tree.render();
    }

    async save(e) {

        this.handleEvent('beforeSave', e, this);
        const data = this._store.getData();


        console.log('%cTreeEditor.js :: 212 =============================', 'color: #f00; font-size: 1rem');
        console.log(data);

        if(!this._storage) {
            return;
        }

        const response = this._storage.set(data);
        this.handleEvent('afterSave', e, response);

        // if (!this._options.saveUrl) {
        //     return;
        // }

        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // }

        // const response = await fetch(this._options.saveUrl, options);
        // const json = await response.json();

        // this.handleEvent('afterSave', e, json);
    }
}

