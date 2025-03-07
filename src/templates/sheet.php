<div
    x-data="application"
    class="skill-tree-editor">

    <template x-if="typeof(treeData) !== 'undefined'">
        <div>

            <!-- required to compute tree -->
            <div class="hidden">
                <div id="skill-tree"></div>
            </div>

            <?php require __DIR__ . '/partials/editor/header.php'; ?>



            <div class="sheet-container">
                <?php
                    require __DIR__ . '/partials/viewer.php';
                ?>
            </div>

        </div>
    </template>

</div>