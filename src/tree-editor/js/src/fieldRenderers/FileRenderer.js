class FileRenderer extends FieldRenderer
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
            ${caption}
            <label class="flex items-center gap-2">
                <input
                  ${name}
                  ${placeholder}
                  ${extra}
                  type="file"
                  data-model="${this._descriptor.model}"
                  class="grow file"
                />
            </label>
            <div
              id="imagePreview"
              data-model="${this._descriptor.model}"
              style="display: nonee"
            ></div>
        </fieldset>
    `;
  }
}