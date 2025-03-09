initializeTree = async function (
  schemaUrl,
  nodeTypesUrl = 'data/stores/fallout/node-types.json'
) {
  const store = new Store();
  let reactiveStore = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveStore))

  let storeData = await fetch(schemaUrl).then(response => response.json());
  reactiveStore.setData(storeData);

  const nodeTypes = await fetch(nodeTypesUrl).then(response => response.json());
  reactiveStore.setNodeTypes(nodeTypes);


  return reactiveStore
};

document.addEventListener('alpine:init', async () => {

  const storage = new LocalStorage('skill-tree');

  const reactiveStore = await initializeTree(
    'data/stores/fallout/schema.json',
    'data/stores/fallout/node-types.json',
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
    storage: storage,
    uploadUrl: 'backend/stub.json',
    // uploadUrl: 'backend/upload.php',
  });

  editor.load();
  tree.render();

  // ======================================================
  const clearTrigger = document.querySelector('#clear-trigger');
  clearTrigger.addEventListener('click', async (e) => {
    storage.remove();
    document.location.reload();
  });
});
