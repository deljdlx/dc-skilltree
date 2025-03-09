class TreeEditor {
<<<<<<< Updated upstream


=======
    /**
     * @type {Storage}
     */
>>>>>>> Stashed changes
    _storage = null;

    _store = null;
    _tree = null;

<<<<<<< Updated upstream

    options = {
=======
    _options = {
>>>>>>> Stashed changes
        storage: null,
        saveUrl: null,
        uploadUrl: null,
    }

    eventListeners = {
    }

    constructor(store, tree, options) {
        this._store = store;
        this._tree = tree;
        this.options = Object.assign(this.options, options);

        this._tree.getData().updateSelectedNode = async (event) => {
            return await this.handleNodeUpdate(event);

        };

        this._tree.addEventListener('select_node.jstree', async (event, data) => {
            setTimeout(() => {
                this.handleNodeSelection();
            }, 10);
        });


        const imagePasteHandler = new ImagePasteHandler(this._tree, this.options);
        imagePasteHandler.handle();
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
        const fileHandler = new FileHandler(this._tree, this.options);
        fileHandler.handle();

        const codeHandler = new CodeHandler(this._tree, this.options);
        codeHandler.handle();

        const wysiwygHandler = new WysiwygHandler(this._tree, this.options);
        wysiwygHandler.handle();

        const contentTemplateHandler = new ContentTemplateHandler(this._tree, this.options);
        contentTemplateHandler.handle();
    }

    async handleNodeUpdate(event) {
        const selectedNode = this._tree.getData().selectedNode;
        this._tree.updateNode(selectedNode);
    }

    async load() {
        if (!this.options.storage) {
            return;
        }

        const data = await this.options.storage.get();
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

        if(!this.options.storage) {
            return;
        }

        const response = this.options.storage.set(data);
        this.handleEvent('afterSave', e, response);

        // if (!this.options.saveUrl) {
        //     return;
        // }

        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // }

        // const response = await fetch(this.options.saveUrl, options);
        // const json = await response.json();

        // this.handleEvent('afterSave', e, json);
    }

    async handleIllustrationPaste() {

    }
}

