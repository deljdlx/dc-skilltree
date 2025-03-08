initializeTree = async function (
  store,
  schemaUrl,
) {
  let reactiveStore = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveStore))

  let storeData = await fetch(schemaUrl).then(response => response.json());

  // reactiveStore = Object.assign(reactiveStore, storeData);

  reactiveStore.setData(storeData);

  return reactiveStore
};

document.addEventListener('alpine:init', async () => {

  const sheetStorage = new LocalStorage('rpg-sheet');
  const treeStorage = new LocalStorage('skill-tree');
  const store = new Store();

  const reactiveStore = await initializeTree(
    store,
    'data/stores/fallout/schema.json'
  );


  if(treeStorage.get()) {
    console.log('%crpg-sheet-editor-bootstrap.js :: 28 =============================', 'color: #f00; font-size: 1rem');
    console.log(treeStorage.get());
    store.setData(treeStorage.get());
    console.log('%crpg-sheet-editor-bootstrap.js :: 33 =============================', 'color: #f00; font-size: 1rem');
    console.log(store.getNodeByCode('THEME_COLOR'));
  }

  let savedData = sheetStorage.get();
  if (savedData) {
    store.setData(savedData);
  }

  store.addEventListener('change', (data) => {
    sheetStorage.set(store.getData());
  });

  reactiveStore.ready = true;

});
