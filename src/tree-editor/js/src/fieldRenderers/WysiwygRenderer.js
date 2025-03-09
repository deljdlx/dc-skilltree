class WysiwygRenderer extends FieldRenderer
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
        <fieldset>
            <label>
              ${caption}
            </label>
            <div class="wysiwyg-container">
                <div
                  class="wysiwyg-content hidden"
                  x-html="selectedNode.${this._descriptor.model ?? ''} ?? ''"
                ></div>

                <div
                  data-model="${this._descriptor.model}"
                  ${extra}
                  class="wysiwyg textarea textarea-bordered w-full grow"
                >
                </div>
            <div>
        </fieldset>
    `;
  }
}