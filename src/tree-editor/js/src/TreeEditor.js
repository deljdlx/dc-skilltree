class TreeEditor {


    _storage = null;

    _store = null;
    _tree = null;

    importEditor = null;
    importTreeAceContainer = null;
    importTreeTextarea = null;


    options = {
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

    initializeImportPanel() {
        this.importTreeAceContainer = document.querySelector('.import-tree-container');
        this.importTreeTextarea = document.querySelector('.import-tree-value');
        this.importEditor = ace.edit(this.importTreeAceContainer);
        this.importEditor.setOptions({
            theme: "ace/theme/dracula",
            mode: "ace/mode/json",
            maxLines: 40,
            minLines: 40,
            autoScrollEditorIntoView: true,
        });
        this.importEditor.session.setValue(this.importTreeTextarea.value);
        this.importEditor.on('change', (e) => {
            this.importTreeTextarea.value = this.importEditor.getValue();
        });

        document.querySelector('.import-tree-trigger').addEventListener('click', () => {
            this.importTree();
        });
    }

    importTree() {
        const json = this.importEditor.getValue();

        console.log('%cTreeEditor.js :: 73 =============================', 'color: #f00; font-size: 1rem');
        const data = JSON.parse(json);
        console.log(data);

        this._store.treeData = data;
        this._tree.destroy();
        this._tree.render();
    }

    async handleNodeSelection() {
        const fileHandler = new FileHandler(this._tree, this.options);
        fileHandler.handle();

        const codeHandler = new CodeHandler(this._tree, this.options);
        codeHandler.handle();

        const wysiwygHandler = new WysiwygHandler(this._tree, this.options);
        wysiwygHandler.handle();

        // ===========================

        // JDLX_TODO does not work
        // const containers = document.querySelectorAll('.quill');
        // containers.forEach((container) => {
        //     if(!container.dataset.initialized) {
        //         container.dataset.initialized = 'true';
        //         const quill = new Quill(container, {
        //             theme: "snow"
        //         });
        //     }
        // });

        // ===========================


        // this.handleWysiwygEditors();
        // this.handleAceEditor();
    }

    handleWysiwygEditors() {
        const selectedNode = this._tree.getData().selectedNode;
        const editors = document.querySelectorAll('.wysiwyg');

        // // get all tinymce instances
        // const tinymceInstances = tinymce.editors;
        // // destroy all tinymce instances
        // tinymceInstances.forEach((instance) => {
        //     instance.remove();
        // });

        editors.forEach((editorNode, index) => {

            // if(editorNode.id) {
            //     const tinyMceInstance = tinymce.get(editorNode.id);
            //     if (tinyMceInstance) {
            //         tinyMceInstance.remove();
            //         editorNode.initialized = false;
            //     }
            // }

            // if (!editorNode.id) {
            //     const id = Math.random().toString(36).substring(7);
            //     editorNode.id = `dynamic-editor-${id}`;
            // }
            if (!editorNode.initialized) {
                wp.editor.initialize(editorNode.id, {
                    tinymce: {
                        wpautop: true,
                        plugins: 'link',
                        toolbar1: 'bold italic underline | link',
                        setup: (editor) => {
                            editor.on('input', () => {
                                const content = editor.getContent();
                                console.log('%cTreeEditor.js :: 116 =============================', 'color: #f00; font-size: 1rem');
                                console.log(content);
                                this._tree.getData().selectedNode.data.description = content;
                            });
                            editor.on('change', () => {
                                const content = editor.getContent();
                                console.log('%cTreeEditor.js :: 116 =============================', 'color: #f00; font-size: 1rem');
                                console.log(content);
                                this._tree.getData().selectedNode.data.description = content;
                            });
                        }
                    },
                    quicktags: true,
                });

                editorNode.initialized = true;
            }

            const editor = tinymce.get(editorNode.id);
            editor.setContent(selectedNode.data.description ?? '');
            // set editor content with
            // wp.editor.setContent(editorNode.id, selectedNode.data[editorNode.dataset.fieldName] ?? '');

        });
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

