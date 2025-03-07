class ImagePasteHandler extends FieldHandler
{


  async handle() {
    document.addEventListener('paste', async (e) => {
      const items = e.clipboardData.items;
      if (items.length === 0) {
        return;
      }

      const file = items[0].getAsFile();
      if (!file) {
        return;
      }

      const previewElement = document.querySelector('#imagePreview');
      if (previewElement) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewElement.innerHTML = '';
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.width = '100%';
          img.style.height = 'auto';
          previewElement.appendChild(img);
        }
        reader.readAsDataURL(file);

        let json = await this.uploadImage(file);
        const model = previewElement.dataset.model;
        this.setModelValue(model, json['image_url']);
      }
    });
  }


  async uploadImage(file) {
    if (!this._options.uploadUrl) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      body: formData
    }
    const response = await fetch(this._options.uploadUrl, options);
    const json = await response.json();
    return json;
  }
}