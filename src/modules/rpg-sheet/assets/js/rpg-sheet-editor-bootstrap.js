initializeTree = async function (
  store,
  schemaUrl,
) {
  let reactiveStore = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveStore))

  let storeData = await fetch(schemaUrl).then(response => response.json());

  reactiveStore = Object.assign(reactiveStore, storeData);

  reactiveStore.setData(storeData);

  return reactiveStore
};

document.addEventListener('alpine:init', async () => {

  const store = new Store();

  const reactiveStore = await initializeTree(
    store,
    'data/stores/fallout/schema.json'
  );

  const nodeTypes = await fetch('data/stores/fallout/node-types.json').then(response => response.json());

  const tree = new Tree(reactiveStore, nodeTypes);
  tree.addEventListener('ready', () => {
    reactiveStore.ready = true;
  });

  reactiveStore.tree = tree;
  tree.render();

  const storage = new LocalStorage('rpg-sheet');
  store.addEventListener('change', (data) => {
    console.log('%crpg-sheet-editor-bootstrap.js :: 34 =============================', 'color: #f00; font-size: 1rem');
    console.log(store.serialize());
    // storage.save(tree.serialize());
  });



});
