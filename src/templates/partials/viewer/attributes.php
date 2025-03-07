<div
    class="col-span-4 p-2 tree-container container attributes-container"
>
    <div class="available-points-container">
        <h2>Attributs</h2>
        <span class="available-points" x-text="availabilities.attributes"></span>
    </div>
    <div>
        <template
            x-for="childId in getNodeById('category-attributes').children"
            :key="childId + '-' + checksum"
        >
            <div class="attribute-container" x-data="{node: getNodeById(childId)}">
                <div class="with-tooltip">
                    <span x-text="node.text"></span>
                    <template x-if="node.data.description">
                        <div class="dropdown ">
                            <div tabindex="0"><i class="fas fa-question-circle"></i></div>
                            <div
                                tabindex="0"
                                class="dropdown-content shadow">
                                <div class="tooltip-content">
                                    <template x-if="node.data.illustration">
                                        <img :src="node.data.illustration" />
                                    </template>
                                    <div x-html="node.data.description"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="value-container">
                    <span class="value" x-text="computeValue(node)"></span>
                    <button x-on:click="
                        if(availabilities.attributes > 0) {
                            if(incrementValue(node.data.code, 1, 0, 10)) {
                                availabilities.attributes--;
                            }
                        }" class="btn btn-xs btn-primary value-modifier">
                        <i class="button-increment" style="font-size: 10px;"></i>
                    </button>
                    <button x-on:click="
                        if(incrementValue(node.data.code, -1, 0, 10)) {
                            availabilities.attributes++;
                        }
                    " class="btn btn-xs btn-primary value-modifier">
                        <i class="button-decrement"></i>
                    </button>
                </div>
            </div>
        </template>
    </div>
</div>
