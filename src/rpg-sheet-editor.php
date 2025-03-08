<!DOCTYPE html>
<html>

<head>
    <title>Skill tree editor</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <main
        x-data="application"
        class="skill-tree-editor"
    >
        <section class="hidden">
            <div id="skill-tree"></div>
        </section>

        <div>
            <div id="header-container"></div>
            <div id="sheet-container"></div>
        </div>
</main>


    <script src="assets/js/src/PageLoader.js"></script>
    <script>
        const pageLoader = new PageLoader('modules/rpg-sheet/assets/rpg-sheet-editor.page.json');
        document.addEventListener('DOMContentLoaded', () => {
            pageLoader.init();
        });
    </script>
</body>

</html>