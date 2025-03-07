
<div class="sheet-container">
    <div class="skill-tree-viewer">
        <div>
            <template x-if="ready">
                <div class="grid grid-cols-12 gap-2">
                    <div id="attributes-container"></div>
                    <?php require __DIR__ . '/partials/attributes.php'; ?>
                    <?php require __DIR__ . '/partials/perks.php'; ?>
                    <?php require __DIR__ . '/partials/characteristics.php'; ?>
                </div>
            </template>
        </div>

        <hr />

        <template x-if="ready">
            <div style="margin-top: 1rem">
                <div class="available-points-container">
                    <h2>Compétences</h2>
                    <span class="available-points" x-text="availabilities.skills"></span>
                </div>


                <div class="grid grid-cols-12 gap-2 skills-container">
                    <template x-for="clusterId in getNodeById('category-skills').children">
                        <?php require __DIR__ . '/partials/skills-cluster.php'; ?>
                    </template>
                </div>
            </div>
        </template>
    </div>

