<div class="skill-tree-viewer" x-init="console.log(getData())">
    <div>
        <template x-if="ready">


            <!--
                <style
                x-text="`
                    .skill-tree-viewer {
                        ${getNodeByCode('THEME_COLOR') ? 'color:' + getNodeByCode('THEME_COLOR').data.value  : ''}
                    }
                `">
            </style>
            -->

            <div class="grid grid-cols-12 gap-2">
                <?php require __DIR__ . '/partials/attributes.html'; ?>
                <?php require __DIR__ . '/partials/perks.html'; ?>
                <?php require __DIR__ . '/partials/characteristics.html'; ?>
            </div>
        </template>
    </div>

    <hr />

    <template x-if="ready">
        <div style="margin-top: 1rem">
            <div class="available-points-container">
                <h2>
                    <span>Compétences</span>
                    <span class="available-points" x-text="_data.availabilities.skills"></span>
                </h2>
            </div>


            <div class="grid grid-cols-12 gap-2 skills-container">
                <template x-for="cluster in getNodeById('category-skills').children">
                    <?php require __DIR__ . '/partials/skills-cluster.html'; ?>
                </template>
            </div>
        </div>
    </template>
</div>