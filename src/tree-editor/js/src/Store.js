class Store {

  _data = {
    values: {},
    availabilities: {},
    treeData: [],
    nodeTypes: {},
  };

  _listeners = {
    change: [],
  };

  constructor() {
    this.checksum = this.generateChecksum();
    this.selectedNode = null;
    this.ready = false;
  }

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

  incrementValue(code, increment = 1, min = 0, max = 100) {
    if (typeof this._data.values[code] === 'undefined') {
      this._data.values[code] = 0;
    }

    if (increment > 0 && this._data.values[code] < max) {
      this._data.values[code] += increment;
      this.dispatchEvent('change', { code, value: this._data.values[code] });
      return true;
    }

    if (increment < 0 && this._data.values[code] > min) {
      this._data.values[code] += increment;
      this.dispatchEvent('change', { code, value: this._data.values[code] });
      return true;
    }

    return false;
  }

  setValue(code, value) {
    this._data.values[code] = value;
    this.dispatchEvent('change', { code, value });
  }



  computeValue(node) {
    let formula = node.data.value;
    let value = this.getValueByCode(node.data.code);

    if (formula) {
      formula = formula.replace('${__VALUE}', 'value');

      const matches = formula.match(/\${(.*?)}/g);
      if (matches) {
        matches.forEach((match) => {
          const key = match.replace('${', '').replace('}', '');
          const linkedNode = this.getNodeByCode(key);
          formula = formula.replace(match, this.computeValue(linkedNode));
        });
      }
      value = eval(formula);
    }

    const perks = this.getNodeById('category-perks').children;
    for (const perk of perks) {
      if (!this._data.values[perk.data.code]) {
        continue;
      }

      const modifiersString = perk.data.modifiers;

      if (modifiersString) {
        const modifiers = modifiersString.split('\n');
        for (const modifier of modifiers) {
          const key = '${' + node.data.code + '}';
          const hasKey = modifier.includes(key);

          if (hasKey) {
            let formula = modifier;
            formula = formula.replace(key, 'value');
            formula = formula.replace('${__VALUE}', 'value');
            eval(formula);
          }
        }
      }
    }

    return parseInt(value);
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

  getAvailabilities() {
    return this._data.availabilities;
  }

  // ===========================

  searchNodeById(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const child = this.searchNodeById(node.children, id);
        if (child) {
          return child;
        }
      }
    }
    return null;
  }

  getNodeById(id) {
    for (const node of this._data.treeData) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const child = this.searchNodeById(node.children, id);
        if (child) {
          return child;
        }
      }
    }
    console.error('Node not found:' + id);
    return null;
  }

  // ===========================
  searchNodeByCode(nodes, code) {
    for (const node of nodes) {
      if (node.data.code === code) {
        return node;
      }
      if (node.children) {
        const child = this.searchNodeByCode(node.children, code);
        if (child) {
          return child;
        }
      }
    }
    return null;
  }

  getNodeByCode(code) {
    for (const node of this._data.treeData) {
      if (node.data.code === code) {
        return node;
      }
      if (node.children) {
        const child = this.searchNodeByCode(node.children, code);
        if (child) {
          return child;
        }
      }
    }

    console.error('Node not found:' + code);

    return null;
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

  renderField(fieldName, descriptor, node) {
    let renderer = null;

    switch (descriptor.type) {
      case 'text': {
        renderer = new TextRenderer(fieldName, descriptor, node);
        break;
      }
      case 'file': {
        renderer = new FileRenderer(fieldName, descriptor, node);
        break;
      }
      case 'image': {
        renderer = new ImageRenderer(fieldName, descriptor, node);
        break;
      }
      case 'textarea': {
        renderer = new TextareaRenderer(fieldName, descriptor, node);
        break;
      }
      case 'code': {
        renderer = new CodeRenderer(fieldName, descriptor, node);
        break;
      }
      case 'wysiwyg': {
        renderer = new WysiwygRenderer(fieldName, descriptor, node);
        break;
      }
      case 'content': {
        renderer = new ContentRenderer(fieldName, descriptor, node);
        break;
      }
      case 'content-template': {
        renderer = new ContentTemplateRenderer(fieldName, descriptor, node);
        break;
      }
    }

    return renderer.render();
  }

  // ============================================

  setValues(values) {
    this._data.values = values;
  }

  setAvailabilities(availabilities) {
    this._data.availabilities = availabilities;
  }

  setTreeData(treeData) {
    this._data.treeData = treeData;
    this.generateChecksum();
  }

  async init() {
    // Any initialization logic can go here (if needed in the future)
  }
}


