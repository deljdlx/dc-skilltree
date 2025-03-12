class TreeNodeFieldRenderer
{
  renderField(fieldName, descriptor, node) {
    let renderer = null;

    switch (descriptor.type) {
      case 'text': {
        renderer = new TextRenderer(fieldName, descriptor, node);
        break;
      }
      case 'file': {
        renderer = new FileRenderer(fieldName, descriptor, node);
        break;
      }
      case 'image': {
        renderer = new ImageRenderer(fieldName, descriptor, node);
        break;
      }
      case 'textarea': {
        renderer = new TextareaRenderer(fieldName, descriptor, node);
        break;
      }
      case 'code': {
        renderer = new CodeRenderer(fieldName, descriptor, node);
        break;
      }
      case 'wysiwyg': {
        renderer = new WysiwygRenderer(fieldName, descriptor, node);
        break;
      }
      case 'content': {
        renderer = new ContentRenderer(fieldName, descriptor, node);
        break;
      }
      case 'content-template': {
        renderer = new ContentTemplateRenderer(fieldName, descriptor, node);
        break;
      }
      case 'auto-list': {
        if(Array.isArray(node.data[fieldName]) && typeof node.data[fieldName][0] === 'object') {
          renderer = new KeyValueListRenderer(fieldName, descriptor, node);
        } else {
          renderer = new ListRenderer(fieldName, descriptor, node);
        }
        break;
      }
      case 'list': {
        renderer = new ListRenderer(fieldName, descriptor, node);
        break;
      }
      case 'key-value-list': {
        renderer = new KeyValueListRenderer(fieldName, descriptor, node);
        break;
      }
    }

    if(!renderer) {
      console.error('Can not find renderer for field type: ' + descriptor.type);
      return '';
    }

    return renderer.render();
  }
}

