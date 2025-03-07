class ImageRenderer extends FieldRenderer
{
  render() {
    let {
      extra,
      name,
      placeholder,
      model,
      caption,
    } = this.prepareAttributes();

    return `
        <template x-if="selectedNode.${this._descriptor.model}">
            <fieldset>
                <img :src="selectedNode.${this._descriptor.model}"/>
            </fieldset>
        </template>
    `;
  }
}