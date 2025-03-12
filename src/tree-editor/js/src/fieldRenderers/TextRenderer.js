class TextRenderer extends FieldRenderer
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
        <template x-if="selectedNode">
          <fieldset class="attribute-container">
            <div class="flex items-center gap-2">
              <label>
                  ${caption}
              </label>
              <input
                ${name}
                ${extra}
                ${placeholder}
                ${model}
                type="text"
                class="grow"
              />
            </div>
          </fieldset>
        </template>
    `;
  }
}