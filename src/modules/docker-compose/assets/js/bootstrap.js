initializeTree = async function (
  schemaUrl,
  nodeTypesUrl = 'data/stores/fallout/node-types.json'
) {
  const store = new SkillTreeStore();
  let reactiveStore = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveStore))

  if(schemaUrl) {
    let storeData = await fetch(schemaUrl).then(response => response.json());
    reactiveStore.setData(storeData);
  }

  if(nodeTypesUrl) {
    let nodeTypes = await fetch(nodeTypesUrl).then(response => response.json());
    reactiveStore.setNodeTypes(nodeTypes);
  }

  const renderer = new TreeNodeFieldRenderer();
  reactiveStore.setFieldRenderer(renderer);

  return reactiveStore
};

document.addEventListener('alpine:init', async () => {

  const storage = new LocalStorage('skill-tree');
  const reactiveStore = await initializeTree(
    null,
    'data/stores/docker-compose/node-types.json',
  );

  const tree = new Tree(reactiveStore);
  tree.addEventListener('ready', () => {
    reactiveStore.ready = true;
    tree.selectNodeById('root');
  });

  tree.addEventListener('change', () => {
    reactiveStore.generateChecksum();
    storage.set(reactiveStore.getData());
  });

  const editor = new TreeEditor(reactiveStore, tree, {
    uploadUrl: 'backend/stub.json',
    // uploadUrl: 'backend/upload.php',
  });
  editor.setStorage(storage);

  editor.load();
  tree.render();


  // ======================================================
  const clearTrigger = document.querySelector('#clear-trigger');
  clearTrigger.addEventListener('click', async (e) => {
    storage.remove();
    document.location.reload();
  });

  setTimeout(() => {
    const yamlUrl = "data/demo/compose.yml";

    async function testDockerComposeParser() {
      const parser = new DockerComposeParser();
      const treeData = await parser.loadAndParseFromUrl(yamlUrl);

      console.log('%ctree-editor-bootstrap.js :: 63 =============================', 'color: #f00; font-size: 1rem');
      console.log(treeData);

      reactiveStore.setTreeData(treeData);
      // this._store.ready = false;
      // this._store.setData(data);
      tree.destroy();
      tree.render();


    }
    testDockerComposeParser();

  }, 100);


});

