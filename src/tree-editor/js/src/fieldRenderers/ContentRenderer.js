class ContentRenderer extends FieldRenderer
{
  render() {
    return `
        <fieldset>
          <div
            data-url="${this._descriptor.url}"
            class="content"
          >
            ${this._descriptor.content}
          </div>
        </fieldset>
    `;
  }
}
