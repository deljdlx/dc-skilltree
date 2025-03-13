class Node
{
  id;
  text;
  data;

  children = [];

  type = 'node';

  constructor(descriptor)
  {
    if(descriptor) {
      if(descriptor.id) {
        this.id = descriptor.id;
      }
      if(descriptor.text) {
        this.text = descriptor.text;
      }
      if(descriptor.data) {
        this.data = descriptor.data;
      }
      if(descriptor.children) {
        this.children = descriptor.children;
      }
      if(descriptor.type) {
        this.type = descriptor.type;
      }
    }
  }

  getChildren()
  {
    return this.children;
  }
}
