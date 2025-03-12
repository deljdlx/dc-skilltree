class KeyValueListRenderer extends FieldRenderer {
  render() {
    let { caption, model, placeholder } = this.prepareAttributes();

    return `
        <fieldset class="attribute-container">
          <h2 class="attribute-header">
              <span>${caption}</span>
              <button type="button"
                class="btn-xs bg-green-500 text-white rounded"
                @click="
                  if(!selectedNode.${this._descriptor.model}) {
                    selectedNode.${this._descriptor.model} = []
                  }
                  selectedNode.${this._descriptor.model}.push({ key: '', value: '' })
                "
              >
                ➕
            </button>
          </h2>

          <div class="flex flex-col">
            <template x-for="(item, index) in selectedNode.${this._descriptor.model}" :key="index">
              <div class="mb-1 flex items-center gap-2">

                <input type="text"
                  class=""
                  x-model="item.key"
                  placeholder="Key" />

                <span class="text-white">:</span>

                <input type="text"
                  class=""
                  x-model="item.value"
                  placeholder="Value" />

                <button type="button"
                    class="rounded"
                    @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                  ❌
                </button>
              </div>
            </template>
          </div>
        </fieldset>
    `;
  }
}
