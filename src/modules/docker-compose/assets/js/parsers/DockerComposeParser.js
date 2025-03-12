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
    return this.generateTreeData(yaml);
  }

  generateTreeData(yaml) {
    this.yamlData = jsyaml.load(yaml);
    
    const treeData = [{
      id: "root",
      text: "Docker Compose File",
      data: { code: "ROOT" },
      type: "root",
      children: []
    }];

    const servicesNode = {
      id: "section-services",
      text: "Services",
      data: { code: "section-services" },
      type: "section-services",
      children: []
    };
    treeData[0].children.push(servicesNode);

    const disabledServicesNode = {
      id: "section-disabled-services",
      text: "Disabled Services",
      data: { code: "section-disabled-services" },
      type: "section-disabled-services",
      children: []
    };
    treeData[0].children.push(disabledServicesNode);


    if (this.yamlData.services) {

      Object.entries(this.yamlData.services).forEach(([serviceName, serviceConfig], index) => {

        let serviceNode = {
          id: `service-${serviceName}`,
          text: serviceName,
          data: {
            code: serviceName,
          },
          type: "service",
          children: []
        };


        let newServiceConfig = {};

        Object.entries(serviceConfig).forEach(([configName, configValue]) => {
          newServiceConfig[configName] = [];

          if (configName === "depends_on") {
            this.handleServiceDependsOn(newServiceConfig, configName, configValue);
            return;
          }

          if (configName === "ports") {
            this.handleServicePorts(newServiceConfig, configName, configValue);
            return;
          }

          if (configName === "build") {
            let build = this.handleServiceBuild(serviceName, configValue);
            if (build) {
              serviceNode.children.push(build);
            }

            return;
          }


          if (configName === "volumes") {
            let volumes = this.handleServiceVolumes(serviceName, configValue);
            if (volumes) {
              serviceNode.children.push(volumes);
            }

            return;
          }

          if (configName === "networks") {
              let serviceNetworks = this.handleServiceNetworks(serviceName, configValue);
              if (serviceNetworks) {
                serviceNode.children.push(serviceNetworks);
              }
            return;
          }


          if (typeof configValue === "object") {
            Object.entries(configValue).forEach(([entryKey, value]) => {
              if (entryKey.match(/^[0-9]+$/)) {
                newServiceConfig[configName].push(value);
              } else {
                newServiceConfig[configName].push({ key: entryKey, value: value });
              }
            });
            return;
          }

          newServiceConfig[configName] = configValue;
        });

        serviceNode.data = {
          ...newServiceConfig
        }

        const normalizedServiceNode = this._normalizer.normalize(serviceNode);

        if (
          Array.isArray(serviceNode.data['profiles'])
          && serviceNode.data['profiles'].includes('disabled')
        ) {
          disabledServicesNode.children.push(normalizedServiceNode);
          return;
        }

        servicesNode.children.push(normalizedServiceNode);
      });
    }

    this.handleVolumes(treeData);
    this.handleNetworks(treeData);
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
        const networkNode = {
          id: `network-${index}`,
          text: networkName,
          data: {
            code: networkName,
            ...(typeof networkConfig === "object" ? networkConfig : {}) // Garde les attributs du network s'il y en a
          },
          type: "network",
          children: []
        };
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


  handleServiceNetworks(serviceName, networkConfiguration) {

    const networkNode = {
      id: `${serviceName}-networks`,
      text: 'Networks',
      data: {
      },
      type: "service-networks",
    };

    if (Array.isArray(networkConfiguration)) {
      networkNode.data['networks'] = networkConfiguration;
      return networkNode;
    }

    return networkNode;
  }


  handleServiceBuild(serviceName, configValue) {

    if(!configValue) {
      return null;
    }

    const buildNode = {
      id: `${serviceName}-build`,
      text: 'Build',
      data: {
        build: [],
      },
      type: "service-build",
    };

    Object.entries(configValue).forEach(([entryKey, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        const subEntries = [];
        Object.entries(value).forEach(([subKey, subValue]) => {
          subEntries.push({ key: subKey, value: subValue });
        });
        // newServiceConfig[configName].push({ key: entryKey, value: subEntries });
        buildNode.data.build.push({ key: entryKey, value: subEntries });
      } else {
        // newServiceConfig[configName].push({ key: entryKey, value: value });
        buildNode.data.build.push({ key: entryKey, value: value });
      }
    });

    return buildNode;
  }

  handleServiceVolumes(serviceName, configValue) {

    if(!configValue) {
      return null;
    }

    if (!Array.isArray(configValue)) {
      return null;
    }

    const volumesNode = {
      id: `${serviceName}-volumes`,
      text: 'Volumes',
      data: {
        volumes: [],
      },
      type: "service-volumes",
    };

    configValue.forEach((volume) => {
      const volumeData = volume.split(":");
      volumesNode.data.volumes.push({ key: volumeData[0], value: volumeData[1] });
    });

    return volumesNode;
  }

  handleServicePorts(newServiceConfig, configName, configValue) {
    if (Array.isArray(configValue)) {
      configValue.forEach((volume) => {
        const volumeData = volume.split(":");
        newServiceConfig[configName].push({ key: volumeData[0], value: volumeData[1] });
      });
      return;
    }
  }



  handleServiceDependsOn(newServiceConfig, configName, configValue) {
    if (Array.isArray(configValue) && typeof configValue[0] === "string") {
      newServiceConfig[configName] = configValue;
      return
    }

    newServiceConfig[configName] = [];
    Object.entries(configValue).forEach(([dependsOnName, descriptor]) => {
      const subValues = [];
      Object.entries(descriptor).forEach(([key, value]) => {
        subValues.push({ key: key, value: value });
      });

      newServiceConfig[configName].push({
        key: dependsOnName,
        value: subValues
      });
    });
    return;
  }
}
