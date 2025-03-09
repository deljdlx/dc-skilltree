class KeyValueListRenderer extends FieldRenderer {
  render() {
    let { caption, model, placeholder } = this.prepareAttributes();

    return `
        <fieldset class="p-4 border rounded-lg shadow-sm">
          <div class="flex flex-col gap-2">
            <label class="text-lg font-semibold">
                ${caption}
            </label>

            <div class="flex flex-col gap-2">
              <template x-for="(item, index) in selectedNode.${this._descriptor.model}" :key="index">
                <div class="flex items-center gap-2">
                  <!-- Champ Clé -->
                  <input type="text" 
                    class="border p-2 rounded w-1/2"
                    x-model="selectedNode.${this._descriptor.model}[index].key"
                    placeholder="Clé" />

                  <!-- Champ Valeur -->
                  <input type="text"
                    class="border p-2 rounded w-1/2"
                    x-model="selectedNode.${this._descriptor.model}[index].value"
                    placeholder="Valeur" />

                  <!-- Bouton de suppression -->
                  <button type="button"
                          class="p-2 text-white bg-red-500 hover:bg-red-600 rounded"
                          @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                    ❌
                  </button>
                </div>
              </template>
            </div>

            <!-- Bouton d'ajout -->
            <button type="button"
                    class="p-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    @click="selectedNode.${this._descriptor.model}.push({ key: '', value: '' })">
              ➕ Ajouter
            </button>
          </div>
        </fieldset>
    `;
  }
}
