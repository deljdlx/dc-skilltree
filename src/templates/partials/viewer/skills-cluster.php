<div class="col-span-4 cluster-container container" x-data="{cluster: getNodeById(clusterId)}">
    <h2 x-text="cluster.text"></h2>
    <template x-for="skillId in cluster.children":key="skillId + '-' + checksum">
        <div x-data="{skill: getNodeById(skillId)}" class="skill-container">
            <div class="with-tooltip">
                <span x-text="skill.text"></span>
                <template x-if="skill.data.description || skill.data.value">
                    <div class="dropdown ">
                        <div tabindex="0"><i class="fas fa-question-circle"></i></div>
                        <div
                            tabindex="0"
                            class="dropdown-content shadow">
                            <div class="tooltip-content">
                                <template x-if="skill.data.illustration">
                                    <img :src="skill.data.illustration" />
                                </template>
                                <template x-if="skill.data.value">
                                    <div>
                                        Formule
                                        <div x-html="skill.data.value"></div>
                                    </div>
                                </template>

                                <template x-if="skill.data.description">
                                    <div x-html="skill.data.description"></div>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="value-container">
                <span class="value" x-text="computeValue(skill)"></span>
                <button x-on:click="
                    if(availabilities.skills > 0) {
                        if(incrementValue(skill.data.code)) {
                            availabilities.skills--;
                        }
                    }" class="btn btn-xs btn-primary value-modifier">
                    <i class="button-increment"></i>
                </button>

                <button x-on:click="
                    if(incrementValue(skill.data.code, -1)) {
                        availabilities.skills++;
                    }" class="btn btn-xs btn-primary value-modifier">
                    <i class="button-decrement"></i>
                </button>
            </div>
        </div>
    </template>
</div>
