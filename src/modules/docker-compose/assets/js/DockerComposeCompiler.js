class DockerComposeCompiler {
  constructor() {
  }

  compile(jsonData) {
    if (!jsonData.treeData) return null;

    // create a deep copy of the object because we will modify it
    jsonData = JSON.parse(JSON.stringify(jsonData));

    this.dockerCompose = {
      services: {},
      // commented, to not pollute the output with empty sections
      // volumes: null,
      // networks: null
    };

    const rootChildren = jsonData.treeData[0].children;

    this.processServices(rootChildren.find(child => child.id === "section-services"));
    this.processVolumes(rootChildren.find(child => child.id === "section-volumes"));
    this.processNetworks(rootChildren.find(child => child.id === "section-networks"));
    this.processServices(rootChildren.find(child => child.id === "section-disabled-services"));

    return this.dockerCompose;
  }

  processServices(serviceSection) {
    if (!serviceSection) return;

    for (const service of serviceSection.children) {
      const serviceName = service.text;
      const serviceData = service.data;
      let serviceConfig = {};

      ["container_name", "profiles", "image", "restart", "working_dir", "command"].forEach(key => {
        if (key in serviceData) serviceConfig[key] = serviceData[key];
      });

      if ("build" in serviceData) {
        let build = this.processBuild(serviceData.build);
        if (build) {
          serviceConfig["build"] = build;
        }
      }

      if ("ports" in serviceData) {
        let ports = this.processArrayMapping(serviceData.ports);
        if (ports) {
          serviceConfig["ports"] = ports;
        }
      }

      if ("depends_on" in serviceData) {
        let dependsOn = this.processDependsOn(serviceData.depends_on);
        if (dependsOn) {
          serviceConfig["depends_on"] = dependsOn;
        }
      }

      if ("environment" in serviceData) {
        let environment = this.processServiceEnvironment(serviceData.environment);
        if (environment) {
          serviceConfig["environment"] = environment;
        }
      }

      if ("labels" in serviceData) {
        let labels = this.processKeyValuePairs(serviceData.labels);
        if (labels) {
          serviceConfig["labels"] = labels;
        }
      }

      const networks = this.processNetworksList(service);
      if (networks) {
        serviceConfig["networks"] = networks;
      }

      const build =  this.processBuild(service);
      if (build) {
        serviceConfig["build"] = build;
      }

      let volumes = this.processServiceVolumesList(service);
      if (volumes) {
        serviceConfig["volumes"] = volumes;
      }



      this.dockerCompose.services[serviceName] = serviceConfig;
    }
  }


  processServiceEnvironment(environment) {
    console.group('%cDockerComposeCompiler.js :: 98 =============================', 'color: #094797; font-size: 1rem');
    console.log(environment);
    console.groupEnd();
    if (!Array.isArray(environment)) {
      return null;
    }

    if (environment.length === 0) {
      return null;
    }

    return environment.map(item => {
      if (typeof item === "string") {
        return item;
      }
      if(item.key && item.value) {
        return `${item.key}=${item.value}`;
      }
      return null;
    }).filter(item => item !== null);



    /*
    if (typeof environment[0] === "string") {
      return environment;
    }

    if(Array.isArray(environment)) {
      return Object.fromEntries(environment.map(item => [item.key, item.value]));
    }
    */

  }

  processServiceVolumesList(service) {

    if(!Array.isArray(service.children)) {
      return null;
    }


    let node = service.children.find(child => child.type === 'service-volumes');
    if(node) {
      let volumesConfiguration = this.processArrayMapping(node.data.volumes);
      if (volumesConfiguration) {
        return volumesConfiguration;
      }
    }


    return null;
  }

  processNetworksList(service) {
    if(Array.isArray(service.children)) {
      let networksNode = service.children.find(child => child.type === 'service-networks');
      if(networksNode) {
        let networksConfiguration = this.processArrayOfStringsOrObjects(networksNode.data.networks);
        if (networksConfiguration) {
          return networksConfiguration;
        }
      }
    }

    return null;
  }

  processBuild(service) {

    if(!Array.isArray(service.children)) {
      return null;
    }

    let buildNode = service.children.find(child => child.type === 'service-build');
    if(!buildNode) {
      return null;
    }


    let buildConfig = {};
    let buildData = buildNode.data.build;
    let isEmpty = true;


    for (const item of buildData) {
      const key = item.key;
      const value = item.value;

      if(value === null || value === "") {
        continue;
      }

      if (Array.isArray(value) && value.length === 0) {
        continue;
      }

      if(key === "args") {

        const args = item.value.map(arg => {
          if (arg.key && arg.value) {
            return `${arg.key}=${arg.value}`;
          }
          return null;
        }).filter(arg=> arg !== null);

        buildConfig[key] = args;

      } else if (Array.isArray(value)) {
        let list = value.map(subItem => {
          if(subItem.key) {
            if (Array.isArray(subItem.value) && subItem.value.length > 0) {
              return { [subItem.key]: subItem.value };
            }
          }

          return subItem;
        });
        buildConfig[key] = list;
      } else {
        isEmpty = false;

        if(value !== null) {
          buildConfig[key] = value;
        }
      }
    }

    if (isEmpty) {
      return null;
    }

    return buildConfig;
  }

  processArrayMapping(dataArray) {
    if(!Array.isArray(dataArray)){
      return null;
    }
    if (dataArray.length === 0) {
      return null;
    }

    return dataArray.map(item => {
      if(item.key && item.value) {
        return `${item.key}:${item.value}`;
      }
      return null;
      // item.key ? `${item.key}:${item.value}` : item
    }).filter(item => item !== null);
  }

  processDependsOn(dependsOnData) {
    return this.processArrayOfStringsOrObjects(dependsOnData);
  }

  processArrayOfStringsOrObjects(dataArray) {

    if (!Array.isArray(dataArray) ) {
      return null;
    }

    if (dataArray.every(item => typeof item === "string")) {
      return dataArray;
    }

    if (dataArray.every(item => !item.value || (Array.isArray(item.value) && item.value.length === 0))) {
      return dataArray.map(item => item.key);
    }


    const dependsOnConfig = {};
    Object.entries(dataArray).forEach(([key, value]) => {
      const entryName = value.key;

      const subValues = {};
      for (const entry of value.value) {
        subValues[entry.key] = entry.value;
      }

      dependsOnConfig[entryName] = subValues;
    });

    return dependsOnConfig;
  }



  processKeyValuePairs(envData) {
    if (!Array.isArray(envData)) {
      return null;
    }

    if (envData.length === 0) {
      return null;
    }

    if (typeof envData[0] === "string") {
      return envData;
    }

    if (Array.isArray(envData)) {
      return Object.fromEntries(envData.map(item => [item.key, item.value]));
    }

    return envData;
  }

  processVolumes(volumeSection) {
    if (!volumeSection) return;

    if (!this.dockerCompose.volumes && volumeSection.children.length > 0) {
      this.dockerCompose.volumes = {};
    }

    for (const volume of volumeSection.children) {
      this.dockerCompose.volumes[volume.text] = { driver: volume.data.driver || "local" };
    }
  }

  processNetworks(networkSection) {
    if (!networkSection) return;

    if (!this.dockerCompose.networks && networkSection.children.length > 0) {
      this.dockerCompose.networks = {};
    }

    for (const network of networkSection.children) {
      this.dockerCompose.networks[network.text] = {
        driver: network.data.driver || "bridge",
        name: network.data.name || network.text
      };
    }
  }

  getYaml() {
    return jsyaml.dump(this.dockerCompose, { noRefs: true });
  }
}
