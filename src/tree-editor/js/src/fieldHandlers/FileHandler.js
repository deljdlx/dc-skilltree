class FileHandler extends FieldHandler {
  handle() {
    const imageUploaders = document.querySelectorAll('input[type="file"]');


    if (imageUploaders) {
      imageUploaders.forEach(imageUploader => {
        imageUploader.value = '';
        if (!imageUploader.dataset.initialized) {
          imageUploader.dataset.initialized = 'true'
          imageUploader.addEventListener('click', async (e) => {
            e.target.value = '';
          });
          imageUploader.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.style.width = '100%';
              img.style.height = 'auto';
            }
            reader.readAsDataURL(file);
            let json = await this.uploadImage(file);
            const model = imageUploader.dataset.model;
            this.setModelValue(model, json['image_url']);
            imageUploader.value = '';
          });
        }
      });
    }
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