class Store {
  _data = {
    values: {},
    treeData: [],
    nodeTypes: {},
  };

  _listeners = {
    change: [],
    watch: {},
  };

  /**
   * @type {TreeNodeFieldRenderer}
   */
  _fieldRenderer = null;

  constructor() {
    this.checksum = this.generateChecksum();
    this.selectedNode = null;
    this.ready = false;
  }

  getProxy(getCallback, setCallback) {
    const proxy = new Proxy(this, {
      get(target, prop, receiver) {

        if (getCallback) {
          getCallback(target, prop, receiver);
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
          if (setCallback) {
            setCallback(target, prop, value, receiver);
          }
          return Reflect.set(target, prop, value, receiver);
      }
    });

    return proxy;
  }

  // ===========================

  setData(data) {
    this._data = data;
  }

  getData() {
    return this._data;
  }

  setTreeData(treeData) {
    this._data.treeData = treeData;
  }

  getTreeData() {
    return this._data.treeData;
  }

  // ===========================

  addWatcher(property, callback) {
    if (!this._listeners.watch[property]) {
      this._listeners.watch[property] = [];
    }
    this._listeners.watch[property].push(callback);
  }

  notifyWatchers(property, value) {
    if (this._listeners.watch[property]) {
      this._listeners.watch[property].forEach(callback => callback(value));
    }
  }

  // ===========================


  addEventListener(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  }

  dispatchEvent(event, data) {
    if (this._listeners[event]) {
      this._listeners[event].forEach((callback) => {
        callback(data);
      });
    }
  }

  generateChecksum() {
    this.checksum = Math.random() + '-' + Math.random();
  }

  setValue(code, value) {
    this._data.values[code] = value;
    this.dispatchEvent('change', { code, value });
  }


  getValueByCode(code) {
    if (typeof this._data.values[code] !== 'undefined') {
      const returnValue = parseInt(this._data.values[code]);
      if (isNaN(returnValue)) {
        this._data.values[code] = 0;
        return 0;
      }
      return returnValue;
    }

    return 0;
  }

  getValues() {
    return this._data.values;
  }

  // ===========================

  setSelectedNodeById(id) {
    const selectedNode = this.getNodeById(id);
    if (selectedNode) {
      this.selectedNode = selectedNode;
      return selectedNode;
    }
    console.error('Node not found: ' + id);
    return null;
  }

  // ===========================

  searchNode(nodes, predicate) {
    for (const node of nodes) {
      if (predicate(node)) {
        return node;
      }
      if (node.children) {
        const child = this.searchNode(node.children, predicate);
        if (child) {
          return child;
        }
      }
    }
    return null;
  }

  getNodeById(id) {
    return this.searchNode(this._data.treeData, node => node.id === id);
  }

  getNodeByCode(code) {
    return this.searchNode(this._data.treeData, node => node.data.code === code);
  }

  getNodeByText(text) {
    return this.searchNode(this._data.treeData, node => node.data.text === text);
  }

  getNodeByName(name) {
    return this.searchNode(this._data.treeData, node => node.text === name);
  }

  getParentNode(node) {
    return this.searchNode(this._data.treeData, n => n.children && n.children.includes(node));
  }

  // ===========================

  getNodeTypes() {
    return this._data.nodeTypes;
  }

  getFieldDescriptors() {
    return this._data.fieldDescriptors;
  }

  getNodeTypeByNode(node) {
    const type = node.type;
    return this._data.nodeTypes[type];
  }

  setNodeTypes(nodeTypes) {

    this._data.nodeTypes = nodeTypes.types;
    this._data.fieldDescriptors = nodeTypes.fields;

    Object.keys(this._data.nodeTypes).forEach(key => {
      const fieldDescriptorName = this._data.nodeTypes[key].fieldsDescriptor;
      if (fieldDescriptorName) {
        this._data.nodeTypes[key].fields = this._data.fieldDescriptors[fieldDescriptorName];
      }
    });
  }

  // ============================================

  setFieldRenderer(renderer) {
    this._fieldRenderer = renderer;
  }

  getFieldRenderer() {
    return this._fieldRenderer;
  }

  renderField(fieldName, descriptor, node) {
    if(!this._fieldRenderer) {
      console.error('Field renderer not set');
      return '';
    }

    return this._fieldRenderer.renderField(fieldName, descriptor, node);
  }

  // ============================================

  setValue(code, value) {
    this._data.values[code] = value;
    this.dispatchEvent('change', { code, value });
    this.notifyWatchers(code, value);
  }

  setTreeData(treeData) {
    this._data.treeData = treeData;
    this.generateChecksum();
    this.notifyWatchers("treeData", treeData);
  }

  setTreeData(treeData) {
    this._data.treeData = treeData;
    this.generateChecksum();
  }

  async init() {
    // Any initialization logic can go here (if needed in the future)
  }
}


