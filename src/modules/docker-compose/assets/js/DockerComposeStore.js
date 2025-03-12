class DockerComposeStore extends Store
{

  getServiceNames() {
    const services = this.getNodeById('section-services');
    const names = [];
    services.children.forEach(service => {
      names.push(service.data.code);
    });

    return names;
  }
}

