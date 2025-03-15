class DockerComposeStore extends Store
{

  getServiceNames() {
    const services = this.getNodeById('section-services');
    const names = [];
    services.children.forEach(service => {
      names.push(service.text);
    });

    return names;
  }

  getDependentServices(serviceName) {
    const services = this.getNodeById('section-services');
    const dependents = [];
    services.children.forEach(service => {
      if (service.data.depends_on && service.data.depends_on.includes(serviceName)) {
        dependents.push(service.text);
      }
    });

    return dependents;
  }


  toEchartsNetworksGraph() {
    const services = this.getNodeById('section-services');
    const disabledServices = this.getNodeById('section-disabled-services');
    const networks = this.getNodeById('section-networks');

    const nodes = [];
    const links = [];
    const categories = [];


    categories.push({
      name: 'Services'
    });


    if(networks) {
      networks.children.forEach(network => {
        categories.push({
          id: network.text,
          name: network.text
        });

        nodes.push({
          id: network.text,
          name: network.text,
          value: 1,
          symbolSize: 80,
          category: network.text,
          draggable: true
        });
      });
    }



    if (services) {
      services.children.forEach(service => {
        nodes.push({
          id: service.text,
          name: service.text,
          value: 1,
          symbolSize: 60,
          category: 'Services',
          draggable: true
        });

        if(service.children) {
          let networks = service.children.find(child => child.type === 'service-networks');
          if(networks) {
            networks.data.networks.forEach(network => {
              links.push({
                source: service.text,
                target: network,
              });
            });
          }
        }
      });
    }

    if (disabledServices) {
      disabledServices.children.forEach(service => {
        nodes.push({
          id: service.text,
          name: service.text,
          value: 1,
          symbolSize: 60,
          category: 'Services',
          draggable: true
        });
        if(service.children) {
          let networks = service.children.find(child => child.type === 'service-networks');
          if(networks) {
            networks.data.networks.forEach(network => {
              links.push({
                source: service.text,
                target: network,
              });
            });
          }
        }
      });
    }

    return {
      nodes: nodes,
      links: links,
      categories: categories
    };
  }

  toEchartsServicesGraph() {
    const services = this.getNodeById('section-services');
    const disabledServices = this.getNodeById('section-disabled-services');
    const networks = this.getNodeById('section-networks');

    const nodes = [];
    const links = [];
    const categories = [];


    categories.push({
      name: 'Services'
    });

    if (services) {
      services.children.forEach(service => {
        nodes.push({
          id: service.text,
          name: service.text,
          value: 1,
          symbolSize: 30,
          category: 'Services',
          draggable: true
        });
      });
    }

    if (disabledServices) {
      disabledServices.children.forEach(service => {
        nodes.push({
          id: service.text,
          name: service.text,
          value: 1,
          symbolSize: 30,
          category: 'Services',
          draggable: true
        });
      });
    }

    if(services) {
      services.children.forEach(service => {
        if (service.data.depends_on) {
          service.data.depends_on.forEach(dependency => {
            let target = '';
            if(typeof dependency === 'string') {
              target = dependency;
            } else {
              target = dependency.key;
            }

            links.push({
              source: service.text,
              target: target,
            });
          });
        }
      });
    }

    if(disabledServices) {
      disabledServices.children.forEach(service => {
        if (service.data.depends_on) {
          service.data.depends_on.forEach(dependency => {
            let target = '';
            if(typeof dependency === 'string') {
              target = dependency;
            } else {
              target = dependency.key;
            }
            links.push({
              source: service.text,
              target: target,
            });
          });
        }
      });
    }

    return {
      nodes: nodes,
      links: links,
      categories: categories
    };
  }

  toMermaidJs() {

    let diagram = 'architecture-beta\n';
    diagram += `  group services(cloud)[Services]\n`;
    const services = this.getNodeById('section-services');
    if (services) {
      services.children.forEach(service => {
        diagram += `  service ${service.text}(server)[${service.text}] in services\n`;
        if (service.data.depends_on) {
          service.data.depends_on.forEach(dependency => {
            // diagram += `service ${service.text} -- ${dependency}\n`;
          });
        }
      });
    }

    const disabledServices = this.getNodeById('section-disabled-services');
    if (disabledServices) {
      diagram += `  group disabledServices(cloud)[Disabled Services]\n`;
      disabledServices.children.forEach(service => {
        diagram += `  service ${service.text}(logos:aws-lambda)[${service.text}] in disabledServices\n`;
        if (service.data.depends_on) {
          service.data.depends_on.forEach(dependency => {
            // diagram += `service ${service.text} -- ${dependency}\n`;
          });
        }
      });
    }


    // diagram += `  php:R --> L:db\n`;
    // diagram += `  node:R --> L:db\n`;

    return diagram;
  }
}

