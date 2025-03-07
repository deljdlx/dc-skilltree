<div class="col-span-4 p-2 tree-container container perks-container">
    <div class="available-points-container">
        <h2>Perks</h2>
        <span class="available-points" x-text="availabilities.perks"></span>
    </div>
    <template x-for="childId in getNodeById('category-perks').children" :key="childId + '-' + checksum">
        <div class="perk-container" x-data="{node: getNodeById(childId)}">
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

                                <div x-show="node.data.modifiers">
                                    <hr />
                                    <div>Modificateurs</div>
                                    <pre x-html="node.data.modifiers"></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <input
                @click="
                    if(!values[node.data.code]) {
                        if(!availabilities.perks) {
                            values[node.data.code] = false;
                        }
                        else {
                            availabilities.perks--;
                        }
                    } else {
                        availabilities.perks++;
                    };

                    if(typeof(save) === 'function') {
                        save();
                    }
                "
                type="checkbox"
                x-model="values[node.data.code]"
                :checked="values[node.data.code]"
                :disabled="!values[node.data.code] && !availabilities.perks"
                class="checkbox checkbox-primary"
            />
        </div>
    </template>
</div>
