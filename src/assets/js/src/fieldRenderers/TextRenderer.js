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
        <fieldset>
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
        </fieldset>
    `;
  }
}