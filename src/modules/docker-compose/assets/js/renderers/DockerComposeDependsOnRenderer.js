class DockerComposeDependsOnRenderer extends FieldRenderer {
  render() {
    // check if this._node.data.depends_on is an array of objects or an array of strings
    if (Array.isArray(this._node.data.depends_on) && typeof this._node.data.depends_on[0] === 'object') {
      return this.renderWithOptions();
    }

    return this.renderFlat();
  }

  renderFlat() {
    let { caption, model } = this.prepareAttributes();

    return `
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
                    selectedNode.${this._descriptor.model}.push({ key: '', value: [] })
                  "
                >
                ➕
              </button>
            </h2>

            <div class="flex flex-col gap-1">
              <template x-for="(dependency, index) in selectedNode.${this._descriptor.model}" :key="index">
                  <!--<pre x-text="JSON.stringify(getServiceNames())"></pre>//-->
                  <div class="flex items-center gap-1">

                    <template x-if="typeof getServiceNames === 'function'">
                      <select x-model="dependency" class="">
                        <option value=""></option>
                        <template x-for="service in getServiceNames()">
                          <option
                            x-text="service"
                            :value="service"
                            :selected="service === dependency"
                          ></option>
                        </template>
                      </select>
                    </template>

                    <button type="button"
                        class="text-white rounded"
                        @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                      ❌
                    </button>
                  </div>

              </template>
            </div>
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
                  class="btn-xs bg-green-500 text-white rounded"
                  @click="
                    if(!selectedNode.${this._descriptor.model}) {
                      selectedNode.${this._descriptor.model} = []
                    }
                    console.log('ICI');
                    selectedNode.${this._descriptor.model}.push({ key: '', value: [
                      { key: 'condition', value: 'service_started' },
                    ] })
                  "
                >
                  ➕
                </button>
            </h2>

            <div class="flex flex-col gap-3">
              <template x-for="(dependency, index) in selectedNode.${this._descriptor.model}" :key="index">
                <div class="depends-on-container">

                  <div class="flex items-center gap-1">
                    <h3>Service : </h3>
                    <select
                      x-model="dependency.key"
                      class="">
                      <option value=""></option>
                      <template x-for="service in getServiceNames()">
                        <option
                          x-text="service"
                          :value="service"
                          :selected="service === dependency.key"
                        ></option>
                      </template>
                    </select>

                    <button type="button"
                        class="text-white rounded"
                        @click="selectedNode.${this._descriptor.model}.splice(index, 1)">
                      ❌
                    </button>
                  </div>

                  <!-- ============================================================================ -->
                  <div class="depends-on-container__options">
                    <h4 class="text-sm  flex items-center justify-start gap-2">
                      <span>Options</span>
                      <button type="button"
                        class="btn-xs bg-green-500 hover:bg-green-600 text-white rounded"
                        @click="dependency.value.push({ key: '', value: '' })">
                        ➕
                      </button>
                    </h4>

                    <template x-for="(subOption, subIndex) in dependency.value" :key="subIndex">
                      <div class="flex items-center gap-2 mt-1">

                        <div class="grow flex items-center gap-2">

                          ${this.handleOptionType()}
                          ${this.handleConditionOption()}
                          ${this.handleRestartOption()}
                          ${this.handleRequiredOption()}
                        </div>

                        <button type="button"
                          class="text-whitehover:bg-red-600 rounded"
                          @click="dependency.value.splice(subIndex, 1)">
                          ❌
                        </button>
                      </div>
                    </template>
                  </div>
                  <!-- ============================================================================ -->

                </div>
              </template>
            </div>
          </div>
        </fieldset>
    `;
  }

  handleOptionType() {
    return `
      <select x-model="subOption.key" class="deponds-on-option">
        <option value=""></option>
        <template x-for="option in ['condition', 'restart', 'required']">
          <option
            x-text="option"
            :value="option"
            :selected="option === subOption.key"
          ></option>
        </template>
      </select>
    `;
  }

  handleRequiredOption() {
    return `
      <template x-if="subOption.key === 'required'">
        <select x-model="subOption.value">
          <option value=""></option>
          <template x-for="value in [true, false,]">
            <option
              :selected="value == subOption.value"
              :value="value"
              x-text="value"
            ></option>
          </template>
        </select>
      </template>
    `;
  }


  handleRestartOption() {
    return `
      <template x-if="subOption.key === 'restart'">
        <select x-model="subOption.value" class="">
          <option value=""></option>
          <template x-for="value in [true, false, 'no', 'always', 'on-failure', 'unless-stopped',]">
            <option
              :selected="value == subOption.value"
              :value="value"
              x-text="value"
            ></option>
          </template>
        </select>
      </template>
    `;
  }

  handleConditionOption() {
    return `
      <template x-if="subOption.key === 'condition'">
        <select x-model="subOption.value" class="">
          <option value=""></option>
          <option
            :selected="'service_started' === subOption.value"
            value="service_started"
          >service_started</option>

          <option
            :selected="'service_healthy' === subOption.value"
            value="service_healthy"
          >service_healthy</option>

          <option
            :selected="'service_completed_successfully' === subOption.value"
            value="service_completed_successfully"
          >service_completed_successfully</option>
        </select>
    </template>
    `;
  }

}
