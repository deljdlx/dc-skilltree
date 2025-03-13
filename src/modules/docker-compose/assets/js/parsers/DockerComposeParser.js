class DockerComposeParser {

  _normalizer = null;

  constructor(normalizer) {
    this._normalizer = normalizer;

  }

  async loadFromUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error loading YAML from URL " + url + " :", error);
      return null;
    }
  }

  async loadAndParseFromUrl(url) {
    const yaml = await this.loadFromUrl(url);
    return this.buildTree(yaml);
  }

  buildTree(yaml) {
    this.yamlData = jsyaml.load(yaml);

    const treeData = [{
      id: "root",
      text: "Docker Compose File",
      data: { code: "ROOT" },
      type: "root",
      children: []
    }];

    const servicesNode ={
      id: "section-services",
      text: "Services",
      data: { code: "section-services" },
      type: "section-services",
      children: [],
    };
    treeData[0].children.push(servicesNode);

    const disabledServicesNode = {
      id: "section-disabled-services",
      text: "Disabled Services",
      data: { code: "section-disabled-services" },
      type: "section-disabled-services",
      children: [],
    };
    treeData[0].children.push(disabledServicesNode);


    if (this.yamlData.services) {
      const serviceParser = new ServiceParser(this._normalizer);
      serviceParser.parse(
        this.yamlData,
        servicesNode,
        disabledServicesNode
      );

    }

    this.handleVolumes(treeData);
    this.handleNetworks(treeData);

    this._normalizer.normalizeNetworks(treeData);
    return treeData;
  }

  handleVolumes(treeData) {
    const volumesNode = {
      id: "section-volumes",
      text: "Volumes",
      data: { code: "section-volumes" },
      type: "section-volumes",
      children: []
    };
    treeData[0].children.push(volumesNode);

    if (this.yamlData.volumes) {
      Object.entries(this.yamlData.volumes).forEach(([volumeName, volumeConfig], index) => {
        const volumeNode = {
          id: `volume-${index}`,
          text: volumeName,
          data: {
            code: volumeName,
            ...(typeof volumeConfig === "object" ? volumeConfig : {})
          },
          type: "volume",
          children: []
        };

        volumesNode.children.push(volumeNode);
      });
    }
  }

  handleNetworks(treeData) {
    const networksNode = {
      id: "section-networks",
      text: "Networks",
      data: { code: "section-networks" },
      type: "section-networks",
      children: []
    };
    treeData[0].children.push(networksNode);

    if (this.yamlData.networks) {
      Object.entries(this.yamlData.networks).forEach(([networkName, networkConfig], index) => {
        const networkNode = new NetworkNode({
          id: `network-${index}`,
          text: networkName,
          data: {
            code: networkName,
            ...(typeof networkConfig === "object" ? networkConfig : {})
          },
          type: "network",
          children: []
        });
        networksNode.children.push(networkNode);
      });
    }
  }

  objectToKeyValueArray(object) {
    return Object.entries(object).map(([key, value]) => {
      if (typeof value === "object") {
        return { key: key, value: this.objectToKeyValueArray(value) };
      } else {
        return { key: key, value: value };
      }
    });
  }
}
