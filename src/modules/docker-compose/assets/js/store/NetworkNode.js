class NetworkNode extends Node
{


  addService(serviceName) {
    const serviceNode = new ServiceNode({
      id: 'network-service-' + this.id + '-' + serviceName.id,
      text: serviceName.text,
      data: {
      },
      type: 'network-service'
    });

    this.children.push(serviceNode);
  }
}
