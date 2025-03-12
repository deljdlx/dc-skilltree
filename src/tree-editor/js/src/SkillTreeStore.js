class SkillTreeStore extends Store
{
  _data = {
    values: {},
    availabilities: {},
    treeData: [],
    nodeTypes: {},
  };

  getAvailabilities() {
    return this._data.availabilities;
  }

  setAvailabilities(availabilities) {
    this._data.availabilities = availabilities;
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
}
