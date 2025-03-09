class ContentTemplateHandler extends FieldHandler {
  handle() {
    const containers = document.querySelectorAll('.content-template');
    containers.forEach(async (container) => {
      const url = container.getAttribute('data-url');
      await fetch(url)
        .then(response => response.text())
        .then(html => {
          container.innerHTML = html;
        })
    });
  }
}
