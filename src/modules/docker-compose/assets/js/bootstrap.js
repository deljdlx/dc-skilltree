initializeTree = async function (
  schemaUrl,
  nodeTypesUrl = 'data/stores/fallout/node-types.json'
) {
  let store = new DockerComposeStore();
  let reactiveStore = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveStore))

  if (schemaUrl) {
    let storeData = await fetch(schemaUrl).then(response => response.json());
    reactiveStore.setData(storeData);
  }

  if (nodeTypesUrl) {
    let nodeTypes = await fetch(nodeTypesUrl).then(response => response.json());
    reactiveStore.setNodeTypes(nodeTypes);
  }

  const renderer = new DockerComposeNodeFieldRenderer();
  reactiveStore.setFieldRenderer(renderer);

  return reactiveStore;
};


function setupTreeEventListeners(tree, reactiveStore, storage) {
  tree.addEventListener('ready', () => {
    reactiveStore.ready = true;
    tree.selectNodeById('root');
  });

  tree.addEventListener('change', () => {
    reactiveStore.generateChecksum();
    storage.set(reactiveStore.getData());
  });

  tree.addEventListener('delete', (event, data) => {
    tree.selectNodeById(data.parent);
  });

  tree.addEventListener('move', (event, data) => {
    const node = reactiveStore.getNodeById(data.node.id);

    if (data.parent === 'section-services') {
      node.data.profiles = node.data.profiles?.filter(p => p !== 'disabled') || [];
    }
    else if (data.parent === 'section-disabled-services') {
      if (!node.data.profiles) node.data.profiles = [];
      if (!node.data.profiles.includes('disabled')) node.data.profiles.push('disabled');
    }

    tree.selectNodeById(data.parent);
  });
}


document.addEventListener('alpine:init', async () => {
  const normalizer = new DockerComposeNormalizer();
  const parser = new DockerComposeParser(normalizer);
  const compiler = new DockerComposeCompiler();

  const storage = new LocalStorage('skill-tree');
  const reactiveStore = await initializeTree(
    null,
    'modules/docker-compose/node-types.json',
  );

  const tree = new Tree(reactiveStore);
  // =========================== Code Editor ===========================
  const codeEditor = new DockerComposeSourceEditor("#preview-container");
  codeEditor.session.on('change', async (delta) => {
    let yaml = codeEditor.session.getValue();
  });

  const editor = new DockerComposeTreeEditor(reactiveStore, tree, {}, compiler, codeEditor);
  editor.setStorage(storage);


  tree.addEventListener('ready', () => {
    reactiveStore.ready = true;
    tree.selectNodeById('root');
  });

  tree.addEventListener('change', () => {
    reactiveStore.generateChecksum();
    storage.set(reactiveStore.getData());
  });

  tree.addEventListener('delete', (event, data) => {
    let parentId = data.parent;
    tree.selectNodeById(parentId);
  });

  editor.load();


  // codeEditor.on('click', async (data) => {
  //   let cursor = codeEditor.getCursorPosition();
  //   let serviceName = getServiceNameForLine(codeEditor, cursor.row);

  //   if(serviceName) {
  //     let node = reactiveStore.getNodeByName(serviceName);
  //     console.log('%cbootstrap.js :: 127 =============================', 'color: #f00; font-size: 1rem');
  //     console.log(node);
  //     if(node) {
  //       tree.selectNodeById(node.id);
  //     }
  //   }
  // });

  // =========================== Watch changes on selectedNode ===========================

  reactiveStore.addWatcher('selectedNode', (data) => {
    compiler.compile(reactiveStore.getData());
    const yaml = compiler.getYaml();
    codeEditor.session.setValue(yaml);

    const selectedNode = reactiveStore.selectedNode;
    let serviceName = null

    if (selectedNode.type === 'service') {
      serviceName = selectedNode.text;
    }
    else if (
      selectedNode.type === 'service-networks'
      || selectedNode.type === 'service-build'
      || selectedNode.type === 'service-volumes'
    ) {
      let parentNode = reactiveStore.getParentNode(selectedNode);
      if (parentNode) {
        serviceName = parentNode.text;
      }
    }

    if (serviceName) {
      codeEditor.selectServiceInEditor(serviceName);
    }
  });




  // ======================================================
  const clearTrigger = document.querySelector('#clear-trigger');
  clearTrigger.addEventListener('click', async (e) => {
    // storage.remove();
    // document.location.reload();
  });


  // const yamlUrl = "modules/docker-compose/demo-files/compose-all.yml";
  // const yamlUrl = "modules/docker-compose/demo-files/compose.yml";
  // const yamlUrl = "modules/docker-compose/demo-files/00-hello-world.yaml";
  // const yamlUrl = "modules/docker-compose/demo-files/01-test-build.yaml";
  // const yamlUrl = "modules/docker-compose/demo-files/02-php.yaml";
  // const yamlUrl = "modules/docker-compose/demo-files/03-php-many-commands.yaml";
  // const yamlUrl = "modules/docker-compose/demo-files/04-test-volumes.yaml";
  // const yamlUrl = "modules/docker-compose/demo-files/05-test-networks.yaml";
  // const yamlUrl = "modules/docker-compose/demo-files/06-test-http-php-myqsl.yaml";
  const yamlUrl = "modules/docker-compose/demo-files/07-test-build.yaml";
  const treeData = await parser.loadAndParseFromUrl(yamlUrl);

  console.log('%cbootstrap.js :: 128 =============================', 'color: #f00; font-size: 1rem');
  console.log(treeData);

  reactiveStore.setTreeData(treeData);
  tree.render();

  compiler.compile(reactiveStore.getData());
  const yaml = compiler.getYaml();
  codeEditor.session.setValue(yaml);

});

