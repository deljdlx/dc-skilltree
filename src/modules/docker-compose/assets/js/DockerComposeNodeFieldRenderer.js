class DockerComposeNodeFieldRenderer extends TreeNodeFieldRenderer
{
  renderField(fieldName, descriptor, node) {
    let renderer = null;
    switch (descriptor.type) {
      case 'docker-compose-depends-on': {
        renderer = new DockerComposeDependsOnRenderer(fieldName, descriptor, node);
        return renderer.render();
      }
      case 'docker-compose-build': {
        renderer = new DockerComposeBuildRenderer(fieldName, descriptor, node);
        return renderer.render();
      }
      case 'docker-compose-command': {
        renderer = new DockerComposeCommandRenderer(fieldName, descriptor, node);
        return renderer.render();
      }
      case 'docker-compose-networks': {
        renderer = new DockerComposeNetworksRenderer(fieldName, descriptor, node);
        return renderer.render();
      }
    }

    return super.renderField(fieldName, descriptor, node);
  }
}