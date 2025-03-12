class ListRenderer extends FieldRenderer {
  render() {
    let {
      extra,
      name,
      placeholder,
      model,
      caption
    } = this.prepareAttributes();

    return `
      <template x-if="typeof selectedNode!== 'undefined'">
        <fieldset class="attribute-container">
          <div class="flex flex-col gap-2">
            <h2 class="attribute-header">
                <span>${caption}</span>
                <button type="button"
                    class="btn-xs bg-green-500 text-white rounded"
                    @click="
                      if(!selectedNode.${this._descriptor.model}) {
                        selectedNode.${this._descriptor.model} = []
                      }
                      selectedNode.${this._descriptor.model}.push('')"
                >
                  ➕
                </button>
            </h2>


            <div class="flex flex-col gap-1">
              <template x-if="Array.isArray(selectedNode.${this._descriptor.model})">
                ${this.renderList()}
              </template>
            </div>
          </div>
        </fieldset>
      </template>
    `;
  }

  renderList() {
    return `
      <template x-for="(value, index) in selectedNode.${this._descriptor.model}" :key="'${this._descriptor.model}-' + index">
        <div class="flex items-center gap-2">
          <input
            type="text"
            class=""
            @change="selectedNode.${this._descriptor.model}[index] = $event.target.value"
            :value="value"
          />

          <button type="button"
            class="text-white hover:bg-red-600 rounded"
            @click="selectedNode.${this._descriptor.model}.splice(index, 1)"
          >
            ❌
          </button>
        </div>
      </template>
    `;
  }
}
