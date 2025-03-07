class WysiwygHandler extends FieldHandler {
  handle() {
    const wysiwygEditors = document.querySelectorAll('.wysiwyg');

    if(wysiwygEditors) {
      wysiwygEditors.forEach((editor) => {
        const quill = new Quill(editor, {
          theme: 'snow'
        });

        quill.root.innerHTML = editor.closest('.wysiwyg-container').querySelector('.wysiwyg-content').innerHTML;

        quill.on('text-change', () => {
          const model = editor.dataset.model;
          this.setModelValue(model, quill.root.innerHTML);
          console.log('%cWysiwygHandler.js :: 14 =============================', 'color: #f00; font-size: 1rem');
          console.log(quill.root.innerHTML);
        });
      });
    }
  }
}
