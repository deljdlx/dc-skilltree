class TextareaRenderer extends FieldRenderer
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
                <textarea
                  ${name}
                  ${placeholder}
                  ${model}
                  ${extra}
                  class="textarea textarea-bordered w-full grow"
                >
                </textarea>
            <div>
        </fieldset>
    `;
  }
}