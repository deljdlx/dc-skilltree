<?php

$css = [
    'https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css?ver=6.6.2',
    './assets/vendor/jquery-ui/jquery-ui.css?ver=6.6.2',
    './assets/vendor/jstree/jstree.min.css',

    './assets/css/page.css',
    './assets/css/sheet-editor.css',
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

<?php
require __DIR__ . '/templates/sheet.php';
?>

<?php
foreach ($js as $j) {
    echo "<script src='$j'></script>";
    echo PHP_EOL;
}
?>

</body>
</html>