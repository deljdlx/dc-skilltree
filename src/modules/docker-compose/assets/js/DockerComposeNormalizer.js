class DockerComposeNormalizer {
  constructor() {

  }

  normalizeNetworks(tree) {
    let services = tree[0].children.find(child => child.type === 'section-services').children;
    let networks = tree[0].children.find(child => child.type === 'section-networks').children;
    let disabledServices = tree[0].children.find(child => child.type === 'section-disabled-services').children;


    services.forEach(service => {
      let networksNames = service.getNetworksNames();
      networksNames.forEach(network => {
        let networkNode = networks.find(networkNode => networkNode.text === network);
        if (networkNode) {
          networkNode.addService(service);
        }
      });
    });



    disabledServices.forEach(service => {
      let networksNames = service.getNetworksNames();
      networksNames.forEach(network => {
        let networkNode = networks.find(networkNode => networkNode.text === network);
        if (networkNode) {
          networkNode.addService(service);
        }
      });
    });
  }

  normalizeServiceNode(serviceConfig) {
    if (serviceConfig.data.environment) {
      serviceConfig.data.environment = this.normalizeServiceEnvironment(serviceConfig.data.environment);
    }

    // if (serviceConfig.data.ports) {
    //   serviceConfig.ports = this.normalizeListToObject(serviceConfig.data.ports, ":");
    // }

    // if (serviceConfig.data.volumes) {
    //   serviceConfig.volumes = this.normalizeListToObject(serviceConfig.data.volumes, ":");
    // }


    if(serviceConfig.children && serviceConfig.children.find(child => child.type === 'service-networks')) {
      let networks = serviceConfig.children.find(child => child.type === 'service-networks');
      const normalizedNetworks = this.normalizeServiceNetworks(networks);
      if (normalizedNetworks) {
        serviceConfig.children = serviceConfig.children.filter(child => child.type !== 'service-networks');
        serviceConfig.children.push(normalizedNetworks);
      }
    }

    if(serviceConfig.data.depends_on) {
      const dependencies = this.normalizeServiceDependsOn(serviceConfig.data.depends_on);
      if (dependencies) {
        serviceConfig.data.depends_on = dependencies;
      }
    }

    if(serviceConfig.children && serviceConfig.children.find(child => child.type === 'service-build')) {
      let build = serviceConfig.children.find(child => child.type === 'service-build');
      const normalizedBuild = this.normalizeServiceBuild(build);
      if(normalizedBuild) {
        serviceConfig.children = serviceConfig.children.filter(child => child.type !== 'service-build');
        serviceConfig.children.push(normalizedBuild);
      }

    }

    return serviceConfig;
  }


  normalizeServiceNetworks(networks) {
    if (!networks) {
      return null;
    }

    let normalizedNetworks = JSON.parse(JSON.stringify(networks));

    normalizedNetworks.data.networks = networks.data.networks.map(network => {
      if (typeof network === 'object') {
        return network;
      }

      return {
        key: network,
        value: [],
      }
    });

    return normalizedNetworks;
  }

  normalizeServiceEnvironment(environment) {
    if (Array.isArray(environment)) {
      let normalizedEnv = [];
      environment.forEach(entry => {
        if (typeof entry === 'object') {
          normalizedEnv.push(entry.value);
          return;
        }

        let [key, value] = entry.split("=");
        normalizedEnv.push({
          key: key,
          value: value,
        });
      });
      return normalizedEnv;
    }
    return environment;
  }


  normalizeListToObject(list, separator) {
    if (Array.isArray(list)) {
      return list.map(item => {
        let [key, value] = item.split(separator);
        return value ? { key, value } : key; // Si pas de valeur après `:`, garder la clé seule
      });
    }
    return list;
  }


  normalizeServiceDependsOn(dependsOn) {

    if(!Array.isArray(dependsOn)) {
      return null;
    }

    const dependencies = dependsOn.map(item => {
      if(typeof item === 'object') {
        return item;
      }
      return {
        key: item,
        value: [],
      }
    });

    return dependencies;
  }

  normalizeServiceBuild(build) {

    if(!build) {
      return null;
    }

    let normalized = JSON.parse(JSON.stringify(build));
    normalized.data.build = build.data.build.map(item => {
      if (item.key === "args") {
        item.value = item.value.map(arg => {
            const parts = arg.split("=");
            return {
              key: parts[0],
              value: parts[1]
            }
        });
      }
      return item;
    });

    return normalized;
  }

  /**
   * Convertit l'objet YAML normalisé en YAML string.
   */
  toYaml() {
    return jsyaml.dump(this.yamlData);
  }
}
