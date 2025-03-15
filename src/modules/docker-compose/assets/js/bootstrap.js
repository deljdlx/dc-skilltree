initializeTree = async function () {
  let store = new DockerComposeStore();
  let reactiveStore = Alpine.reactive(store);
  Alpine.data('application', () => (reactiveStore))

  const nodeTypes = await fetch('modules/docker-compose/assets/node-types.json').then(response => response.json());
  reactiveStore.setNodeTypes(nodeTypes);

  const renderer = new DockerComposeNodeFieldRenderer();
  reactiveStore.setFieldRenderer(renderer);

  return reactiveStore;
};


document.addEventListener('alpine:init', async () => {
  const normalizer = new DockerComposeNormalizer();
  const parser = new DockerComposeParser(normalizer);
  const compiler = new DockerComposeCompiler();
  const validator = new DockerComposeValidator('http://localhost:3003/validate');

  const storage = new LocalStorage('skill-tree');
  const reactiveStore = await initializeTree();

  const tree = new Tree(reactiveStore);
  // =========================== Code Editor ===========================
  const codeEditor = new DockerComposeSourceEditor("#preview-container");
  codeEditor.session.on('change', async (delta) => {
    let yaml = codeEditor.session.getValue();
  });

  const editor = new DockerComposeTreeEditor(reactiveStore, tree, {}, compiler, codeEditor);
  editor.setStorage(storage);

  const eventManager = new TreeEventManager(tree, reactiveStore, storage);

  editor.load();


  const loadTrigger = document.querySelector('#import-compose-trigger');
  loadTrigger.addEventListener('click', async (e) => {
    const yaml = document.querySelector('#import-compose').value;
    const treeData = await parser.parse(yaml);
    console.group('%cbootstrap.js :: 45 =============================', 'color: #329195; font-size: 1rem');
    console.log(treeData);
    console.groupEnd();
    reactiveStore.setTreeData(treeData);
    tree.reload();

  });


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

  const footer = document.querySelector('#application-footer');
  reactiveStore.addWatcher('selectedNode', (data) => {
    compiler.compile(reactiveStore.getData());
    const yaml = compiler.getYaml();


    validator.validate(yaml).then(result => {
      if(result.valid) {
        footer.innerHTML = '<span>🎉 compose is valid</span>';
      }
      else {
        footer.innerHTML = '<span>💀 compose is invalid: </span><span>' + result.error + '</span>';
      }
    });



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

    const graphDescriptor = reactiveStore.toEchartsServicesGraph();
    // const graphDescriptor = reactiveStore.toEchartsNetworksGraph();
    const  myChart = echarts.init(document.querySelector('#compose-services-diagram'));
    //myChart.showLoading();

    const option = {
      legend: [
        {
          data: graphDescriptor.categories.map(function (a) {
            return a.name;
          })
        }
      ],
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: false,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 20
          },
          lineStyle: {
            width: 2,
            curveness: 0.2
          },
          roam: true,
          draggable: true,
          data: graphDescriptor.nodes,
          categories: graphDescriptor.categories,
          force: {
            edgeLength: 200,
            repulsion: 2000,
            gravity: 1
          },
          edges: graphDescriptor.links
        }
      ]
    };
    myChart.setOption(option);
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

  reactiveStore.setTreeData(treeData);
  tree.render();

  compiler.compile(reactiveStore.getData());
  const yaml = compiler.getYaml();
  codeEditor.session.setValue(yaml);







  const graphDescriptor = reactiveStore.toEchartsServicesGraph();
  // const graphDescriptor = reactiveStore.toEchartsNetworksGraph();
  const  myChart = echarts.init(document.querySelector('#compose-services-diagram'));
  //myChart.showLoading();

  const option = {
    legend: [
      {
        data: graphDescriptor.categories.map(function (a) {
          return a.name;
        })
      }
    ],
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        lineStyle: {
          width: 2,
          curveness: 0.2
        },
        roam: true,
        draggable: true,
        data: graphDescriptor.nodes,
        categories: graphDescriptor.categories,
        force: {
          edgeLength: 200,
          repulsion: 2000,
          gravity: 1
        },
        edges: graphDescriptor.links
      }
    ]
  };
  myChart.setOption(option);









  /* kept for future reference
  // <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  const graphDefinition = reactiveStore.toMermaidJs();
  document.querySelector('#compose-services-diagram').textContent = graphDefinition;
  mermaid.registerIconPacks([
    {
        name: 'logos',
        loader: () =>
        fetch('https://unpkg.com/@iconify-json/logos@1/icons.json').then((res) => res.json()),
    },
  ]);
  mermaid.initialize({
    startOnLoad: true,
  });

  await mermaid.run({
    nodes: [
      document.querySelector('#compose-services-diagram')
    ]
  });
  */

});

