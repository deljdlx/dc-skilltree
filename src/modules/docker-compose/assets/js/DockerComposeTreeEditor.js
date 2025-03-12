class DockerComposeTreeEditor extends TreeEditor {

  _compiler = null;
  _codeEditor = null;

  constructor(store, tree, options, compiler, codeEditor) {
      super(store, tree, options);
      this._compiler = compiler;
      this._codeEditor = codeEditor;

      this.setupEventListeners();
      this.setupContextMenu();
  }

  setupEventListeners() {
      this._tree.addEventListener('move', (event, data) => {
          const node = this._store.getNodeById(data.node.id);

          if (data.parent === 'section-services') {
              node.data.profiles = node.data.profiles?.filter(p => p !== 'disabled') || [];
          }
          else if (data.parent === 'section-disabled-services') {
              if (!node.data.profiles) node.data.profiles = [];
              if (!node.data.profiles.includes('disabled')) node.data.profiles.push('disabled');
          }

          this._tree.selectNodeById(data.parent);
      });
  }

  setupContextMenu() {
      this.addServiceContextMenu("volumes", "Volumes", {
          volumes: [{ key: '/HOST/PATH', value: '/CONTAINER/PATH' }]
      });

      this.addServiceContextMenu("build", "Build", {
          build: [
              { key: 'context', value: '/PATH/TO/CONTEXT' },
              { key: 'dockerfile', value: 'Dockerfile' }
          ]
      });
  }

  addServiceContextMenu(type, label, dataTemplate) {
      this._tree.addContextMenuItem(
          `add-${type}`,
          `Add ${label}`,
          (node, jsTree) => {
              this.addChildNode(node, type, label, dataTemplate);
          },
          (node) => {
              const nodeInStore = this._store.getNodeById(node.id);
              return nodeInStore.type === 'service' && !nodeInStore.children.find(child => child.type === `service-${type}`);
          }
      );
  }

  addChildNode(node, type, text, data) {
      const nodeInStore = this._store.getNodeById(node.id);
      if (!nodeInStore) return false;

      if (!nodeInStore.children) {
          nodeInStore.children = [];
      }

      let newNode = {
          id: `${nodeInStore.id}-${type}`,
          text: text,
          data: data,
          type: `service-${type}`,
      };

      nodeInStore.children.push(newNode);
      this._compiler.compile(this._store.getData());
      const yaml = this._compiler.getYaml();
      this._codeEditor.session.setValue(yaml);
      this._tree.reload();

      setTimeout(() => {
          this._tree.selectNodeById(newNode.id);
      }, 50);
  }
}
