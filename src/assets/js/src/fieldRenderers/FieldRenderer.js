class FieldRenderer
{
  _name = null;
  _descriptor = null;
  _node = null;

  constructor(fieldName, descriptor, node) {
    this._name = fieldName;
    this._node = node;

    this._descriptor = Object.assign({
      "caption": null,
      "inputName": null,
      "model": null,
      "type": null,
      "default": null,
      "placeholder": null,
      "extra": null,
    }, descriptor);
  }

  prepareAttributes() {
    let extra = '';
    if(this._descriptor.extra) {
      Object.keys(this._descriptor.extra).forEach(key => {
        extra += ` ${key}="${this._descriptor.extra[key]}"` + "\n";
      });
    }

    let name = '';
    if(this._descriptor.inputName) {
      name = `name="${this._descriptor.inputName}"`;
    }

    let placeholder = '';
    if(this._descriptor.placeholder) {
      placeholder = `placeholder="${this._descriptor.placeholder}"`;
    }

    let model = '';
    if(this._descriptor.model) {
      model = `x-model="selectedNode.${this._descriptor.model}"`;
    }

    let caption = '';
    if(this._descriptor.caption) {
      caption = this._descriptor.caption;
    }

    return {
      extra,
      name,
      placeholder,
      model,
      caption,
    };
  }

}
