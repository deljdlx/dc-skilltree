<!DOCTYPE html>
<html>

<head>
    <title>Skill tree editor</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <div
        x-data="application"
        class="skill-tree-editor">
        <!-- <template x-if="typeof(treeData) !== 'undefined'"> -->
        <div>

            <div id="header-container"></div>

            <div class="grid grid-cols-12 gap-2">

                <!-- =========================================================== -->

                <div class="col-span-3 p-2 tree-editor-panel tree-editor-panel--left">
                    <div id="skill-tree"></div>
                </div>

                <!-- =========================================================== -->

                <div class="col-span-4 p-2 tree-editor-panel tree-editor-panel--middle">
                    <div id="node-informations-container"></div>
                </div>

                <!-- =========================================================== -->

                <div class="col-span-5 p-2 tree-editor-panel tree-editor-panel--right">
                    <h2>Preview</h2>
                    <div style="position: relative">
                        <div id="sheet-container"></div>
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

                <!-- =========================================================== -->

            </div>
        </div>
        <!-- </template> -->
    </div>


    <script src="assets/js/src/PageLoader.js"></script>
    <script>
        const pageLoader = new PageLoader('data/pages/tree-editor.json');
        document.addEventListener('DOMContentLoaded', () => {
            pageLoader.init();
        });
    </script>



    <script type="null">
        document.addEventListener('DOMContentLoaded', async () => {
            await fetch('./templates/editor/partials/header.php')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('header-container').innerHTML = html;
                });

            await fetch('./templates/editor/partials/node-informations.php')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('node-informations-container').innerHTML = html;
                });

            await fetch('./templates/viewers/rpg-sheet/main.php')
                .then(response => response.text())
                .then(html => {
                    document.getElementById('sheet-container').innerHTML = html;
                });


            // JDLX_TODO: OPTIMIZE THIS
            const css = [
                'https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css?ver=6.6.2',
                'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css',

                // './assets/vendor/jquery-ui/jquery-ui.css?ver=6.6.2',
                './assets/vendor/jstree/jstree.min.css',

                './assets/css/page.css',
                './assets/css/node-types.css',
                './assets/css/tree-editor.css',
                './assets/css/tree-viewer.css',

            ];

            css.forEach(c => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = c;
                document.head.appendChild(link);
            });


            // JDLX_TODO: OPTIMIZE THIS
            const js = [
                'https://cdn.tailwindcss.com',
                'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js',
                './assets/vendor/jquery/jquery.js',
                // './assets/vendor/jquery-ui/jquery-ui.min.js',

                './assets/vendor/jstree/jstree.min.js',
                './assets/vendor/ace-editor/src/ace.js',
                './assets/vendor/ace-editor/src/ext-language_tools.js',


                './assets/js/src/storages/LocalStorage.js',


                './assets/js/src/fieldHandlers/FieldHandler.js',
                './assets/js/src/fieldHandlers/FileHandler.js',
                './assets/js/src/fieldHandlers/CodeHandler.js',
                './assets/js/src/fieldHandlers/ImagePasteHandler.js',
                './assets/js/src/fieldHandlers/WysiwygHandler.js',

                './assets/js/src/fieldRenderers/FieldRenderer.js',
                './assets/js/src/fieldRenderers/TextRenderer.js',
                './assets/js/src/fieldRenderers/FileRenderer.js',
                './assets/js/src/fieldRenderers/ImageRenderer.js',
                './assets/js/src/fieldRenderers/TextareaRenderer.js',
                './assets/js/src/fieldRenderers/CodeRenderer.js',
                './assets/js/src/fieldRenderers/WysiwygRenderer.js',



                './assets/js/src/Store.js',
                './assets/js/src/Tree.js',
                './assets/js/src/TreeEditor.js',


                './assets/js/editor-bootstrap.js',
                '//unpkg.com/alpinejs',
            ];

            function loadScript(src) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve; // Appel resolve une fois que le script est chargé
                    script.onerror = reject; // Appel reject en cas d'erreur de chargement
                    document.body.appendChild(script);
                });
            }

            async function loadScripts() {
                try {
                    for (let i = 0; i < js.length; i++) {
                        await loadScript(js[i]); // Attendre que chaque script soit chargé avant de passer au suivant
                    }
                    console.log('Tous les scripts ont été chargés avec succès');
                } catch (error) {
                    console.error('Erreur lors du chargement des scripts:', error);
                }
            }
            loadScripts();
        });
    </script>


    <?php
    // foreach ($js as $j) {
    //     echo "<script src='$j'></script>";
    //     echo PHP_EOL;
    // }
    ?>

</body>

</html>