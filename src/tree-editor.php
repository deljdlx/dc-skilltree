<?php

$css = [
    'https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css?ver=6.6.2',

    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',

    './assets/vendor/jquery-ui/jquery-ui.css?ver=6.6.2',
    './assets/vendor/jstree/jstree.min.css',

    './assets/css/page.css',
    './assets/css/node-types.css',
    './assets/css/tree-editor.css',
    './assets/css/tree-viewer.css',

];


$js = [
    'https://cdn.tailwindcss.com',

    './assets/vendor/jquery/jquery.js',
    './assets/vendor/jquery-ui/jquery-ui.min.js',

    './assets/vendor/jstree/jstree.min.js',
    './assets/vendor/ace-editor/src/ace.js',
    './assets/vendor/ace-editor/src/ext-language_tools.js',


    './assets/js/src/storages/LocalStorage.js',

    './assets/js/src/RpgStore.js',
    './assets/js/src/Tree.js',
    './assets/js/src/TreeEditor.js',


    './assets/js/bootstrap.js',
    '//unpkg.com/alpinejs',
];
?>
<!DOCTYPE html>
<html>

<head>
    <title>Skill tree editor</title>
    <?php
    foreach ($css as $c) {
        echo "<link rel='stylesheet' href='$c'>";
        echo PHP_EOL;
    }
    ?>
</head>

<body>


    <div
        x-data="application"
        class="skill-tree-editor"
    >

        <template x-if="typeof(treeData) !== 'undefined'">
            <div>

                <?php require __DIR__ . '/templates/partials/editor/header.php'; ?>

                <div class="grid grid-cols-12 gap-2">
                    <div class="col-span-3 p-2 tree-editor-panel tree-editor-panel--left">
                        <div id="skill-tree"></div>
                    </div>

                    <div class="col-span-3 p-2 tree-editor-panel tree-editor-panel--middle">
                        <template x-if="selectedNode">
                            <?php
                            require __DIR__ . '/templates/partials/editor/node-informations.php';
                            ?>
                        </template>
                    </div>

                    <div class="col-span-6 p-2 tree-editor-panel tree-editor-panel--right">
                        <h2>Preview</h2>
                        <div style="position: relative">
                            <?php
                            require __DIR__ . '/templates/partials/viewer.php';
                            ?>
                            <div style="
                                position: absolute;
                                background-color: #0008;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                            ">
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </template>

    </div>







    <?php
    foreach ($js as $j) {
        echo "<script src='$j'></script>";
        echo PHP_EOL;
    }
    ?>

</body>

</html>