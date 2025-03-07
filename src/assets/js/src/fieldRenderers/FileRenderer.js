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
            <label class="input input-bordered flex items-center gap-2">
                <input
                  ${name}
                  ${placeholder}
                  ${model}
                  ${extra}
                  type="file"
                  class="grow"
                />
            </label>
            <div id="imagePreview" style="display: nonee"></div>
        </fieldset>
    `;
  }
}