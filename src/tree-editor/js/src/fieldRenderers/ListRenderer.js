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
        <fieldset class="p-4 border rounded-lg shadow-sm">
          <div class="flex flex-col gap-2">
            <label class="text-lg font-semibold">
                ${caption}
            </label>

            <div class="flex flex-col gap-2">
              <template x-for="(item, index) in selectedNode.${this._descriptor.model}" :key="index">
                <div class="flex items-center gap-2">
                  <input type="text"
                    class="border p-2 rounded w-full"
                    x-model="selectedNode.${this._descriptor.model}[index]"
                    placeholder="${placeholder || 'Enter value...'}" />

                  <button type="button"
                          class="p-2 text-white hover:bg-red-600 rounded"
                          @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                    ❌
                  </button>
                </div>
              </template>
            </div>

            <!-- Bouton d'ajout -->
            <button type="button"
                    class="p-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    @click="selectedNode.${this._descriptor.model}.push('')">
              ➕ Ajouter
            </button>
          </div>
        </fieldset>
    `;
  }
}
