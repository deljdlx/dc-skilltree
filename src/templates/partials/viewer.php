<div class="skill-tree-viewer">
    <div>
        <template x-if="ready">
            <div class="grid grid-cols-12 gap-2">
                <?php require __DIR__ . '/viewer/attributes.php'; ?>
                <?php require __DIR__ . '/viewer/perks.php'; ?>
                <?php require __DIR__ . '/viewer/characteristics.php'; ?>
            </div>
        </template>
    </div>

    <hr/>

    <template x-if="ready">
        <div style="margin-top: 1rem">
            <div class="available-points-container">
                <h2>Compétences</h2>
                <span class="available-points" x-text="availabilities.skills"></span>
            </div>


            <div class="grid grid-cols-12 gap-2 skills-container">
                <template x-for="clusterId in getNodeById('category-skills').children">
                    <?php  require __DIR__ . '/viewer/skills-cluster.php'; ?>
                </template>
            </div>
        </div>
    </template>


</div>
