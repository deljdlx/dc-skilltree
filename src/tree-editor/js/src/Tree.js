
class Tree {
  currentSelectedNode = null;
  _renderer;

  formElement;
  skillNameInput;
  skillCodeInput;

  data = null;
  plugins = [
    // "checkbox",
    "contextmenu",
    "dnd",
    // "massload",
    // "search",
    // "sort",
    // "state",
    "types",
    // "unique",
    // "wholerow",
    // "changed",
    // "conditionalselect"
  ];

  typeDescriptor = {};
  fieldDescriptors = {};
  types = {};

  eventListeners = {
    'select_node.jstree': [],
    'rename_node.jstree': [],
    'move_node.jstree': [],
    'create_node.jstree': [],
    'delete_node.jstree': [],
  }


  constructor(store) {
    this.store = store;
    this.types = this.store.getNodeTypes();
  }

  addEventListener(name, callback) {
    if(!this.eventListeners[name]) {
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


  getData() {
    return this.store;
  }


  destroy() {
    this._renderer.jstree('destroy');
  }

  render() {
    this._renderer = $('#skill-tree').jstree({
      'core': {
        'data': this.store.getTreeData(),
        'multiple': false,
        "check_callback": (operation, node, parent, position, more) => {

          if (operation === "move_node") {
            return true;
            return this.checkMove(operation, node, parent, position, more);
          }

          if (node.id === "root") {

            if (operation === "delete_node") {
              return false;
            }
            if (operation === 'rename_node') {
              return false;
            }
          }

          return true; // all other operations are allowed
        }
      },
      plugins: this.plugins,
      types: this.types,
      contextmenu: {
        items: (node) => {
          return this.getContextMenu(node);
        }
      },
    })
      .on('ready.jstree', (e, data) => {
        this.handleEvent('ready', e, data);
      })
      .on('ready.jstree', function () {
        $(this).jstree('open_all');
      })
      .on('select_node.jstree', (e, data) => {
        this.store.previousSelectedNode = this.store.selectedNode;

        let node = this.store.getNodeById(data.node.id);
        this.store.selectedNode = node;

        this.eventListeners['select_node.jstree'].forEach(callback => {
          callback(e, data);
        });
      })
      .on('before_open.jstree', function (e, data) {


      })
      .on('contextmenu.jstree', function (e, data) {

        var tree = $(this).jstree(true);
        var node = $(e.target).closest("li");

        if (node && node.attr("id")) {
          tree.select_node(node.attr("id"));
        }
      })

      // =========================== handle node events

      .on('rename_node.jstree', (e, data) => {
        this.selectNodeById('root');
        this.selectNode(data.node);
        this.store.setTreeData(data.instance.get_json());
        this.handleEvent('rename', e, data);
        this.handleEvent('change', e, data);
      })
      .on('create_node.jstree', (e, data) => {
        this.handleCreate(e, data);
        this.handleEvent('create', e, data);
        this.handleEvent('change', e, data);
      })
      .on('move_node.jstree', (e, data) => {
        this.store.setTreeData(data.instance.get_json());
        this.handleEvent('move', e, data);
        this.handleEvent('change', e, data);
      })
      .on('delete_node.jstree', (e, data) => {
        this.store.setTreeData(data.instance.get_json());
        this.handleEvent('delete', e, data);
        this.handleEvent('change', e, data);
      })

    ;
  }

  getJson() {
    return this._renderer.jstree(true).get_json();
  }

  getContextMenu(node) {
    const typeInfo = this.getTypeByNode(node);

    let items = $.jstree.defaults.contextmenu.items();

    if (typeInfo.noChildren) {
      delete items.create;
    }

    if (typeInfo.noDelete) {
      delete items.remove;
    }

    if (typeInfo.noRename) {
      delete items.rename;
    }

    delete items.ccp;

    return items;
  }

  checkMove(operation, node, parent, position, more) {
    let newParent = more.ref;
    if (!newParent) {
      newParent = parent;
    }

    if (node.type === "skill" && newParent.type !== "cluster") {
      return false;
    }

    if (node.type === "cluster" && newParent.type !== "category-skills") {
      return false;
    }

    if (node.type === "attribute" && newParent.type !== "category-attributes") {
      return false;
    }

    if (node.type === "perk" && newParent.type !== "category-perks") {
      return false;
    }
  }


  renameCurrentNode(text) {
    const node = this._renderer.jstree('get_selected', true)[0];
    if (node) {
      return;
    }
    this._renderer.jstree('rename_node', node, text);
  }

  renameNode(node, text) {
    this._renderer.jstree('rename_node', node, text);
  }


  updateNode(node) {
        this._renderer.jstree('rename_node', node, node.text);
  }


  handleCreate(e, data) {
    const parentNodeId = data.node.parent;
    const parentNode = data.instance.get_node(parentNodeId);
    const parentTypeInfo = this.getTypeByNode(parentNode);

    if (parentTypeInfo.childType) {
      data.instance.set_type(data.node, parentTypeInfo.childType);
      if (this.types[parentTypeInfo.childType] && this.types[parentTypeInfo.childType].defaultName) {
        data.instance.set_text(data.node, this.types[parentTypeInfo.childType].defaultName);
      }
    }

    data.node.data = {
      code: '',
    };

    this.store.setTreeData(data.instance.get_json());
    this.selectNode(data.node);
  }

  // ===========================


  selectNode(node) {
    this._renderer.jstree('deselect_all');

    this._renderer.jstree('select_node', node);
    this.store.selectedNode = node;
  }

  getTypeByNode(node) {
    const type = node.type;
    return this.types[type];
  }

  selectNodeById(id) {
    const node = this._renderer.jstree('get_node', id);
    this.selectNode(node);
  }

  getNodes() {
    return this._renderer.jstree('get_json', 'root', {
      flat: true
    });
  }

  getNodeById(id) {
    return this._renderer.jstree('get_node', id);
  }

  getNodeByCode(code) {
    const nodes = this._renderer.jstree('get_json', 'root', {
      flat: true
    });

    return nodes.find(node => node.data.code === code);
  }
}
