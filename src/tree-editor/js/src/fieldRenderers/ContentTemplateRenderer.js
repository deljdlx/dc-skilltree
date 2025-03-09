class ContentTemplateRenderer extends FieldRenderer
{
  render() {
    return `
        <fieldset>
          <div
            data-url="${this._descriptor.url}"
            class="content-template"
          >
          </div>
        </fieldset>
    `;
  }
}
