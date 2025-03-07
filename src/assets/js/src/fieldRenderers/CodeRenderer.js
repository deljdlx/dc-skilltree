class CodeRenderer extends FieldRenderer
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
          <div>
              <div
                class="code"
                data-model="${this._descriptor.model}"
                data-lines="${this._descriptor.lines ?? 1}"
              ></div>
          <div>
      </fieldset>
    `;
  }
}