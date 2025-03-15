class DockerComposeNetworksRenderer extends FieldRenderer {
  render() {
    if (!Array.isArray(this._node.data.networks) || this._node.data.networks.length === 0) {
      return this.renderEmpty();
    }

    return this.renderWithOptions();
  }

  renderEmpty() {
    let { caption } = this.prepareAttributes();
    return `
      <fieldset class="attribute-container" x-init="
        selectedNode.${this._descriptor.model} = [];
      ">
        <div class="flex flex-col gap-2">
          <label class="">${caption}</label>
          <button type="button"
            class="p-2 mt-2 bg-green-500 hover:bg-green-600 text-white rounded"
            @click="selectedNode.${this._descriptor.model} = [{
              key: '',
              value: []
            }]">
            ➕ Network Configuration
          </button>
        </div>
      </fieldset>
    `;
  }

  renderWithOptions() {
    let { caption, model } = this.prepareAttributes();
    return `
        <fieldset class="attribute-container">
          <div class="flex flex-col gap-2">
            <h2 class="attribute-header">
              <span>${caption}</span>

              <template
                x-effect="console.log(selectedNode)"
                x-if="
                  Array.isArray(selectedNode.${this._descriptor.model})
                  && typeof selectedNode.${this._descriptor.model}[0] === 'string'
              ">
                <button type="button"
                  class="btn-xs bg-green-500 text-white rounded"
                  @click="selectedNode.${this._descriptor.model}.push('')"
                >
                  ➕
                </button>
              </template>

              <template x-if="typeof selectedNode.${this._descriptor.model}[0] === 'object'">
                <button type="button"
                  class="btn-xs bg-green-500 text-white rounded"
                  @click="selectedNode.${this._descriptor.model}.push({ key: '', value: [] })">
                  ➕
                </button>
              </template>

            </h2>

            <template x-if="typeof selectedNode.${this._descriptor.model}[0] === 'string'">
              ${this.handleArrayNetworks()}
            </template>


            <template x-if="typeof selectedNode.${this._descriptor.model}[0] === 'object'">
              ${this.handleNetworksWithOptions()}
            </template>

          </div>
        </fieldset>
    `;
  }

  handleArrayNetworks() {
    return `
          <div class="flex flex-col gap-1">
            <template
              x-for="(network, index) in selectedNode.${this._descriptor.model}"
              :key="index"
            >

                <div class="flex items-center gap-2">
                  <input type="text"
                    class=""
                    x-model="selectedNode.${this._descriptor.model}[index]"
                    placeholder="Network Name" />
                  <button type="button"
                    class="rounded"
                    @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                    ❌
                  </button>
                </div>

            </template>
          </div>
    `;
  }

  handleNetworksWithOptions() {
    return `
      <div class="flex flex-col gap-2">
        <template
          x-for="(networkDescriptor, index) in selectedNode.${this._descriptor.model}"
          :key="index"
        >
          <div class="attribute-subvalue-container">
            <div class="flex items-center gap-2">
              <input type="text"
                class=""
                x-model="networkDescriptor.key"
                placeholder="Network Name" />
              <button type="button"
                class="rounded"
                @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                ❌
              </button>
            </div>

            ${this.handleNetworkOptions()}
          </div>
        </template>
      </div>
    `;
  }


  handleNetworkOptions() {
    return `
      <div class="flex flex-col gap-1">
        <h3 class="flex items-center gap-2 justify-start">
            <span>Options</span>
            <button
              type="button"
              class="btn-xs bg-green-500 text-white rounded"
              @click="networkDescriptor.value.push({ key: '', value: '' })"
            >
              ➕
            </button>
        </h3>
        <template x-for="(networkDescriptor.value, index) in networkDescriptor.value" :key="index">

          <div class="flex items-center gap-2 mt-1">
            <input
              type="text"
              class=""
              x-model="networkDescriptor.value[index].key"
            />
            <span class="text-white">:</span>
            <input
              type="text"
              class=""
              x-model="networkDescriptor.value[index].value"
            />
            <button type="button"
              class="rounded"
              @click="networkDescriptor.value.splice(index, 1)">
              ❌
            </button>
          </div>
        </template>
      </div>
    `;
  }
}
