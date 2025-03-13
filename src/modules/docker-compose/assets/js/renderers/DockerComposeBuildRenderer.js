class DockerComposeBuildRenderer extends FieldRenderer {
  render() {
    if (!Array.isArray(this._node.data.build) || typeof this._node.data.build === 'undefined') {
      return this.renderEmpty();
    }

    return `
      <template x-if="typeof selectedNode.${this._descriptor.model} !== 'undefined'">
        ${this.renderWithOptions()}
      </template>
    `

  }

  renderEmpty() {
    let { caption } = this.prepareAttributes();
    return `
      <fieldset class="attribute-container"
        x-init="  selectedNode.${this._descriptor.model} = []"
      >
        <div class="flex flex-col gap-2">
          <h2 class="attribute-header">
            <span>${caption}</span>
            <button type="button"
              class="btn-xs bg-green-500 text-white rounded"
              @click="selectedNode.${this._descriptor.model} = [
                { key: 'context', value: '' },
                { key: 'dockerfile', value: '' },
                { key: 'target', value: '' },
                { key: 'network', value: '' },
                { key: 'cache_from', value: [] },
                { key: 'cache_to', value: [] },
                { key: 'secrets', value: [] },
                { key: 'ssh', value: [] },
                { key: 'extra_hosts', value: [] },
                { key: 'args', value: [] }
              ]">
            ➕ Build Configuration
          </button>
          </h2>
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
            <button type="button"
              class="btn-xs text-white rounded bg-red-500"
              @click="delete selectedNode.${this._descriptor.model}"
            >
              Remove Build Configuration
            </button>
          </h2>

          <div class="attribute-subvalue-container">
            ${this.renderTextField("context", "Context")}
            ${this.renderTextField("dockerfile", "Dockerfile")}
          </div>

          <details>
            <summary>Advanced Options</summary>
            <div class="flex flex-col gap-2">
              <div class="attribute-subvalue-container">
                ${this.renderKeyValueList("args", "Build Arguments")}
              </div>

              <div class="attribute-subvalue-container">
                ${this.renderTextField("network", "Network")}
              </div>

              <div class="attribute-subvalue-container">
                ${this.renderTextField("target", "Target")}
                </div>

              <div class="attribute-subvalue-container">
                ${this.renderArray("extra_hosts", "Extra Hosts")}
              </div>


              <div class="attribute-subvalue-container">
                ${this.renderArray("cache_from", "Cache From")}
                ${this.renderArray("cache_to", "Cache To")}
              </div>

              <div class="attribute-subvalue-container">
                ${this.renderArray("secrets", "Secrets")}
                ${this.renderArray("ssh", "SSH Keys")}
              </div>
            </div>
          </details>
        </div>
      </fieldset>
    `;
  }

  renderTextField(field, label) {
    return `

      <div class="grow"
        x-init="
          if (!selectedNode.${this._descriptor.model}.find(item => item.key === '${field}')) {
            selectedNode.${this._descriptor.model}.push({ key: '${field}', value: '' })
          }
        "
        x-effect="
          if (!selectedNode.${this._descriptor.model}.find(item => item.key === '${field}')) {
            selectedNode.${this._descriptor.model}.push({ key: '${field}', value: '' })
          }
        "
      >
        <label>${label}</label>
        <input type="text"
          class=""
          x-model="selectedNode.${this._descriptor.model}.find(item => item.key === '${field}').value"
          placeholder="${label}" />
      </div>
    `;
  }

  renderArray(field, label) {
    return `
      <div class="flex flex-col gap-1 grow"
        x-init="if (!selectedNode.${this._descriptor.model}.find(item => item.key === '${field}')) {
          selectedNode.${this._descriptor.model}.push({ key: '${field}', value: [] })
        }"
        x-effect="
          if (!selectedNode.${this._descriptor.model}.find(item => item.key === '${field}')) {
            selectedNode.${this._descriptor.model}.push({ key: '${field}', value: [] })
          }
        "
      >
        <h3 class="flex items-center gap-2">
          <span>${label}</span>
          <button type="button"
            class="btn-xs bg-green-500 text-white rounded"
            @click="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value.push('')"
          >
            ➕
          </button>
        </h3>
        <template x-for="(item, index) in selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value" :key="index">
          <div class="flex items-center gap-2 mt-1">
            <input type="text"
              class="border p-1 rounded bg-gray-700 text-white w-full"
              x-model="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value[index]"
              placeholder="${label}" />
            <button type="button"
              class="rounded"
              @click="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value.splice(index, 1)">
              ❌
            </button>
          </div>
        </template>
      </div>
    `;
  }

  renderKeyValueList(field, label) {
    return `
      <template x-if="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}')" >
        <div class="flex flex-col gap-1 grow">
          <h3 class="flex items-center gap-2">
            <span>${label}</span>
            <button type="button"
              class="btn-xs bg-green-500 text-white rounded"
              @click="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value.push({ key: '', value: '' })"
            >
              ➕
            </button>
          </h3>
          <template x-for="(entry, index) in selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value" :key="index">
            <div class="flex items-center gap-2 mt-1">

              <!--<pre x-text="JSON.stringify(selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value[index])"></pre>//-->


                <div class="flex flex-row gap-2 grow">
                  <input type="text"
                    x-model="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value[index].key"
                    placeholder="Key" />

                  <span class="text-white">:</span>

                  <input type="text"
                    x-model="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value[index].value"
                    placeholder="Value" />
                </div>

                <button type="button"
                  class="rounded"
                  @click="selectedNode.${this._descriptor.model}.find(opt => opt.key === '${field}').value.splice(index, 1)">
                  ❌
                </button>
            </div>
          </template>
        </div>
      </template>
    `;
  }
}
