class DockerComposeCommandRenderer extends FieldRenderer {
  render() {
    if (!this._node.data.command) {
      return this.renderEmpty();
    }

    return this.renderWithOptions();
  }

  renderEmpty() {
    let { caption } = this.prepareAttributes();
    return `
      <template x-if="typeof selectedNode!== 'undefined'">
        <fieldset class="attribute-container">
          <div class="flex flex-col gap-2">
            <h2 class="attribute-header">
              ${caption}
              <button type="button"
                class="btn-xs bg-green-500 text-white rounded"
                @click="selectedNode.${this._descriptor.model} = ['']"
              >
                ➕
              </button>
            </h2>
          </div>
        </fieldset>
      </template>
    `;
  }

  renderWithOptions() {
    let { caption, model } = this.prepareAttributes();
    return `
      <template x-if="typeof selectedNode!== 'undefined'">
        <fieldset class="attribute-container">
          <div class="flex flex-col gap-1">
            <div class="flex flex-row justify-between items-center gap-2">
              <h2 class="attribute-header">
                <span>${caption}</span>
                <button type="button"
                  class="btn-xs bg-green-500 text-white rounded"
                  @click="selectedNode.${this._descriptor.model}.push('')">
                  ➕
                </button>
              </h2>

              <div class="flex gap-2">
                <template x-if="typeof selectedNode.${this._descriptor.model} === 'string'">
                  <button type="button"
                    class="btn-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    @click="selectedNode.${this._descriptor.model} = [selectedNode.${this._descriptor.model} || '']">
                    🔄 Convert to Array
                  </button>
                </template>
              </div>
            </div>

            ${this.handleSingleCommand()}
            ${this.handleArrayCommands()}

          </div>
        </fieldset>
      </template>
    `;
  }

  handleSingleCommand() {
    return `
      <template x-if="typeof selectedNode.${this._descriptor.model} === 'string'">
        <div>
          <input type="text"
            class=""
            x-model="selectedNode.${this._descriptor.model}"
            placeholder="Command" />
        </div>
      </template>
    `;
  }


  handleArrayCommands() {
    return `
      <template x-if="Array.isArray(selectedNode.${this._descriptor.model})">
        <div class="mt-2 flex flex-col gap-1">

          <template x-for="(cmd, index) in selectedNode.${this._descriptor.model}" :key="index">
            <div class="flex items-center gap-2 mt-1">
              <input
                type="text"
                class=""
                x-model="selectedNode.${this._descriptor.model}[index]"
                placeholder="Command"
              />
              <button type="button"
                class="rounded"
                @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                ❌
              </button>
            </div>
          </template>

        </div>
      </template>
    `;
  }


}
