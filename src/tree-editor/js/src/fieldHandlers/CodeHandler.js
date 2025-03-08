class CodeHandler extends FieldHandler {
  _theme = "ace/theme/dracula";
  _mode = "ace/mode/taverne";



  handle() {
    const codeContainers = document.querySelectorAll('.code');

    codeContainers.forEach(async (container) => {
      const selectedNode = this._tree.getData().selectedNode;

      // destroy previous ace editor
      if (container.querySelector('.ace_editor')) {
        container.querySelector('.ace_editor').remove();
      }

      const langTools = ace.require("ace/ext/language_tools");
      const editor = ace.edit();

      editor.setOptions({
        theme: this._theme,
        mode: this._mode,
        maxLines: 30,
        minLines: container.dataset.lines,
        autoScrollEditorIntoView: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
      });


      var taverneCompleter = {
        getCompletions: (editor, session, pos, prefix, callback) => {
          this.getCompletion(editor, session, pos, prefix, callback);
        }
      }
      langTools.addCompleter(taverneCompleter);
      const keys = container.dataset.model.split('.');

      let value = selectedNode;
      keys.forEach((key) => {
        value = value[key];
      });

      editor.session.setValue(value ?? '');

      editor.on('change', (e) => {
        const model = container.dataset.model;
        this.setModelValue(model, editor.getValue());
      });

      // JDLX_TODO tooltips
      // editor.on("mousemove", function (e) {
      //     const renderer = editor.renderer;
      //     const session = editor.getSession();
      //     const docPos = renderer.screenToTextCoordinates(e.clientX, e.clientY);
      //     const token = session.getTokenAt(docPos.row, docPos.column);

      //     console.log(token);

      //     if (token && token.type === "variable.language") {
      //         tooltip.textContent = `Information sur : ${token.value}`; // Ton contenu d'aide
      //         tooltip.style.left = e.clientX + 10 + "px";
      //         tooltip.style.top = e.clientY + 10 + "px";
      //         tooltip.style.display = "block";
      //     } else {
      //         tooltip.style.display = "none";
      //     }
      // });

      container.appendChild(editor.container);
    });
  }

  getCompletion(editor, session, pos, prefix, callback) {
    if (prefix.length === 0) { callback(null, []); return }


    const autocompletions = [];
    const nodes = this._tree.getNodes();
    nodes.forEach((node) => {
      if (node.data.code) {
        autocompletions.push({
          name: node.text,
          value: '${' + node.data.code + '}',
          score: 1,
          meta: node.data.code
        });
      }
    });

    callback(null, autocompletions);

    // harcoded autocompletions, kept for exemple
    // callback(null, [
    //     {name: "test", value: "test", score: 1, meta: "test"},
    //     {name: "foo", value: "foo", score: 1, meta: "test"},
    // ]);
  }
}
