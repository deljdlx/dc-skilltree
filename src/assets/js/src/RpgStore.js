class RpgStore {
  constructor() {
    this.checksum = this.generateChecksum();
    this.values = {};
    this.availabilities = {};
    this.selectedNode = null;
    this.treeData = null;
    this.ready = false;

    this.tree = null;
    this.editor = null;
  }

  generateChecksum() {
    this.checksum = Math.random() + '-' + Math.random();
  }

  incrementValue(code, increment = 1, min = 0, max = 100) {
    if (typeof this.values[code] === 'undefined') {
      this.values[code] = 0;
    }

    if (increment > 0 && this.values[code] < max) {
      this.values[code] += increment;
      return true;
    }

    if (increment < 0 && this.values[code] > min) {
      this.values[code] += increment;
      return true;
    }

    return false;
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
          const linkedNode = this.tree.getNodeByCode(key);
          formula = formula.replace(match, this.computeValue(linkedNode));
        });
      }
      value = eval(formula);
    }

    const perks = this.getNodeById('category-perks').children;
    for (const perkId of perks) {
      const perk = this.getNodeById(perkId);

      if (!this.values[perk.data.code]) {
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
    if (typeof this.values[code] !== 'undefined') {
      const returnValue = parseInt(this.values[code]);
      if (isNaN(returnValue)) {
        this.values[code] = 0;
        return 0;
      }
      return returnValue;
    }
    return 0;
  }

  getValues() {
    return this.values;
  }

  getAvailabilities() {
    return this.availabilities;
  }

  getNodeById(id) {
    //search recursively in the this.treeData
    // const search = (data, id) => {
    //   for (const node of data) {
    //     if (node.id === id) {
    //       return node;
    //     }

    //     if (node.children) {
    //       const result = search(node.children, id);
    //       if (result) {
    //         return result;
    //       }
    //     }
    //   }
    // }
    // const node0 = search(this.treeData, id);

    const node = this.tree.getNodeById(id);
    return node;
  }

  // ============================================

  setValues(values) {
    this.values = values;
  }

  setAvailabilities(availabilities) {
    this.availabilities = availabilities;
  }

  setTreeData(treeData) {
    console.log('%cRpgStore.js :: 119 =============================', 'color: #f00; font-size: 1rem');
    console.log(treeData);
    this.treeData = treeData;
    this.generateChecksum();
    console.log('%cRpgStore.js :: 123 =============================', 'color: #f00; font-size: 1rem');
    console.log(this);
  }

  setTree(tree) {
    this.tree = tree;
  }

  setEditor(editor) {
    this.editor = editor;
  }



  async init() {
    // Any initialization logic can go here (if needed in the future)
  }
}


