initializeTree = async function (
  store,
  schemaUrl,
  dataUrl
) {
  let reactiveData = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveData))

  let defaultStore = await fetch(schemaUrl).then(response => response.json());
  reactiveData = Object.assign(reactiveData, defaultStore);

  await fetch(dataUrl).then(response => response.json()).then(response => {
      reactiveData = Object.assign(reactiveData, response);

      console.log('%cbootstrap.js :: 15 =============================', 'color: #f00; font-size: 1rem');
      console.log(reactiveData);
  });

  return reactiveData
};

document.addEventListener('alpine:init', async () => {

  const store = new Store();

  const reactiveStore = await initializeTree(
    store,
    'data/stores/fallout/schema.json',
    'data/fallout-exemple.json'
  );
  const nodeTypes = await fetch('data/stores/fallout/node-types.json').then(response => response.json());

  const tree = new Tree(reactiveStore, nodeTypes);
  tree.addEventListener('ready', () => {
    reactiveStore.ready = true;
  });

  reactiveStore.tree = tree;
  tree.render();


});
