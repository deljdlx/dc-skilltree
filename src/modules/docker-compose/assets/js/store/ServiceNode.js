class ServiceNode extends Node
{
  getNetworksNames() {
    const networks = this.children.filter(child => child.type === 'service-networks');
    if(networks.length === 0) {
      return [];
    }
    return networks[0].data.networks.map(network => network.key);
  }
}
