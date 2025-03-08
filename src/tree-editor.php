<!DOCTYPE html>
<html>

<head>
    <title>Skill tree editor</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎲</text></svg>">
</head>

<body>
    <div
        x-data="application"
        class="skill-tree-editor"
    >
        <div>
            <div id="header-container"></div>

            <div class="grid grid-cols-12 gap-2">

                <!-- =========================================================== -->

                <section class="col-span-3 p-2 tree-editor-panel tree-editor-panel--left">
                    <div id="skill-tree"></div>
                </section>

                <!-- =========================================================== -->

                <section class="col-span-4 p-2 tree-editor-panel tree-editor-panel--middle">
                    <div id="node-informations-container"></div>
                </section>

                <!-- =========================================================== -->

                <section class="col-span-5 p-2 tree-editor-panel tree-editor-panel--right">
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
                </section>

                <!-- =========================================================== -->
            </div>
        </div>
    </div>


    <script src="assets/js/src/PageLoader.js"></script>
    <script>
        const pageLoader = new PageLoader('assets/js/tree-editor.page.json');
        document.addEventListener('DOMContentLoaded', () => {
            pageLoader.init();
        });
    </script>
</body>

</html>