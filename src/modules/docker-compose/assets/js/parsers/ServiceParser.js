class ServiceParser {
  constructor(normalizer) {
    this._normalizer = normalizer;
  }

  parse(yamlData, servicesNode, disabledServicesNode) {
    if (!yamlData.services) {
      return;
    }

    Object.entries(yamlData.services).forEach(([serviceName, serviceConfig], index) => {

      let serviceNode = new ServiceNode({
        id: `service-${serviceName}`,
        text: serviceName,
        data: {
          code: serviceName,
        },
        type: "service",
        children: []
      });

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

      const normalizedServiceNode = this._normalizer.normalizeServiceNode(serviceNode);

      if (
        Array.isArray(serviceNode.data['profiles'])
        && serviceNode.data['profiles'].includes('disabled')
      ) {
        disabledServicesNode.children.push(normalizedServiceNode);
        return;
      }

      servicesNode.children.push(normalizedServiceNode);
      return serviceNode;
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
        buildNode.data.build.push({ key: entryKey, value: subEntries });
      } else {
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
