class FieldHandler
{
  _tree = null;
  _options = null;

  constructor(tree, options) {
    this._tree = tree;
    this._options = options;
  }

  setModelValue(model, value) {
    const selectedNode = this._tree.getData().selectedNode
    const keys = model.split('.');

    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], selectedNode);
    target[lastKey] = value;
  }
}