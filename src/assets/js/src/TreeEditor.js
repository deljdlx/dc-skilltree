class TreeEditor {


    storage = null;

    store = null;
    tree = null;

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
        this.store = store;
        this.tree = tree;
        this.options = Object.assign(this.options, options);

        this.tree.getData().updateSelectedNode = async (event) => {
            return await this.handleNodeUpdate(event);

        };

        // KEPT FOR EXEMPLE
        // this.tree.getData().handleNodeSelection = () => {
        //     console.log('%ceditor.js :: 17 =============================', 'color: #f00; font-size: 2rem');
        //     console.log("handleNodeSelection");

        //     const codeContainers = document.querySelectorAll('.code');
        //     codeContainers.forEach((container) => {
        //         console.log('%ceditor.js :: 87 =============================', 'color: #f0f; font-size: 1rem');
        //         console.log(container.value)
        //         console.log(container.innerHTML)
        //     });
        // }


        this.tree.addEventListener('select_node.jstree', async (event, data) => {
            setTimeout(() => {
                this.handleNodeSelection();
            }, 100);
        });


        this.handleIllustrationPaste();
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

        this.store.treeData = data;
        this.tree.destroy();
        this.tree.render();
    }

    async handleNodeSelection() {
        const selectedNode = this.tree.getData().selectedNode;
        // ===========================
        const imageUploader = document.querySelector('#imageUploader');
        if (imageUploader) {
            imageUploader.value = '';
            if (!imageUploader.dataset.initialized) {
                imageUploader.dataset.initialized = 'true'
                imageUploader.addEventListener('click', async (e) => {
                    e.target.value = null;
                });

                imageUploader.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = 'auto';
                    }
                    reader.readAsDataURL(file);
                    let json = await this.uploadImage(file);
                    this.tree.getData().selectedNode.data.illustration = json['image_url'];
                });
            }
        }

        //destroy all previous editors
        // const previousEditors = document.querySelectorAll('.wp-editor-wrap');
        // previousEditors.forEach((editor) => {
        //     editor.remove();
        // });




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


        this.handleWysiwygEditors();
        this.handleAceEditor();
    }

    handleWysiwygEditors() {
        const selectedNode = this.tree.getData().selectedNode;
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
                                this.tree.getData().selectedNode.data.description = content;
                            });
                            editor.on('change', () => {
                                const content = editor.getContent();
                                console.log('%cTreeEditor.js :: 116 =============================', 'color: #f00; font-size: 1rem');
                                console.log(content);
                                this.tree.getData().selectedNode.data.description = content;
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

    handleAceEditor() {


        const codeContainers = document.querySelectorAll('.code');

        codeContainers.forEach(async (container) => {
            const selectedNode = this.tree.getData().selectedNode;

            // destroy previous ace editor
            if (container.querySelector('.ace_editor')) {
                container.querySelector('.ace_editor').remove();
            }

            const langTools = ace.require("ace/ext/language_tools");
            const editor = ace.edit();

            editor.setOptions({
                theme: "ace/theme/dracula",
                mode: "ace/mode/taverne",
                maxLines: 30,
                minLines: container.dataset.lines,
                autoScrollEditorIntoView: true,
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true, // Si tu veux la complétion en temps réel
            });


            var taverneCompleter = {
                getCompletions: (editor, session, pos, prefix, callback) => {
                    if (prefix.length === 0) { callback(null, []); return }


                    const autocompletions = [];
                    const nodes = this.tree.getNodes();
                    nodes.forEach((node) => {
                        if (node.data.code) {
                            autocompletions.push({
                                name: node.text,
                                value: '${' + node.data.code + '}',
                                score: 1,
                                meta: node.data.code
                            });
                        }
                    });

                    callback(null, autocompletions);

                    // harcoded autocompletions, kept for exemple
                    // callback(null, [
                    //     {name: "test", value: "test", score: 1, meta: "test"},
                    //     {name: "foo", value: "foo", score: 1, meta: "test"},
                    // ]);

                }
            }
            langTools.addCompleter(taverneCompleter);
            const keys = container.dataset.model.split('.');

            let value = selectedNode;
            keys.forEach((key) => {
                value = value[key];
            });

            editor.session.setValue(value ?? '');

            // listen changes in editor
            editor.on('change', (e) => {
                selectedNode.data[container.dataset.fieldName] = editor.getValue();
            });

            // JDLX_TODO tooltips
            // editor.on("mousemove", function (e) {
            //     const renderer = editor.renderer;
            //     const session = editor.getSession();
            //     const docPos = renderer.screenToTextCoordinates(e.clientX, e.clientY);
            //     const token = session.getTokenAt(docPos.row, docPos.column);

            //     console.log(token);

            //     if (token && token.type === "variable.language") {
            //         tooltip.textContent = `Information sur : ${token.value}`; // Ton contenu d'aide
            //         tooltip.style.left = e.clientX + 10 + "px";
            //         tooltip.style.top = e.clientY + 10 + "px";
            //         tooltip.style.display = "block";
            //     } else {
            //         tooltip.style.display = "none";
            //     }
            // });


            container.appendChild(editor.container);

        });
    }

    async handleNodeUpdate(event) {
        const selectedNode = this.tree.getData().selectedNode;
        this.tree.updateNode(selectedNode);
    }

    async load() {
        if (!this.options.storage) {
            return;
        }

        const data = await this.options.storage.get();
        if (!data) {
            return;
        }

        this.store.ready = false;
        this.store.setValues(data.values);
        this.store.setAvailabilities(data.availabilities);
        this.store.setTreeData(data.tree);
        this.tree.destroy();
        this.tree.render();
    }

    async save(e) {

        this.handleEvent('beforeSave', e, this);
        const data = {
            values: this.store.getValues(),
            availabilities: this.store.getAvailabilities(),
            tree: this.tree.getJson(),
        }


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
        document.addEventListener('paste', async (e) => {
            const items = e.clipboardData.items;
            if (items.length === 0) {
                return;
            }

            const file = items[0].getAsFile();
            if (!file) {
                return;
            }

            const previewElement = document.querySelector('#imagePreview');
            if (previewElement) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewElement.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    previewElement.appendChild(img);
                }
                reader.readAsDataURL(file);


                let json = await this.uploadImage(file);
                this.tree.getData().selectedNode.data.illustration = json['image_url'];
            }
        });
    }

    async uploadImage(file) {

        if (!this.options.uploadUrl) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        const options = {
            method: 'POST',
            body: formData
        }
        const response = await fetch(this.options.uploadUrl, options);
        const json = await response.json();
        return json;
    }
}

