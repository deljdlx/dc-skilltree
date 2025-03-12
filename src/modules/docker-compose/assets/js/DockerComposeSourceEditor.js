class DockerComposeSourceEditor {

  session;

  constructor(editorContainerId) {
    this.editorContainer = document.querySelector(editorContainerId);
    this.editor = ace.edit();
    this.initEditor();
    this.session = this.editor.session;
  }

  initEditor() {
    this.editor.setOptions({
      theme: "ace/theme/dracula",
      mode: "ace/mode/yaml",
      maxLines: Infinity,
      minLines: 50,
      autoScrollEditorIntoView: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });

    this.editorContainer.appendChild(this.editor.container);

    this.editor.session.on("change", async () => {
      let yaml = this.editor.session.getValue();
      // console.log("YAML Updated:", yaml);
    });
  }

  getServiceNameForLine(lineNumber) {
    let yamlLines = this.editor.getValue().split("\n");
    let currentIndentation = yamlLines[lineNumber].search(/\S|$/);

    for (let i = lineNumber; i >= 0; i--) {
      let line = yamlLines[i];
      let match = line.match(/^\s*([a-zA-Z0-9_-]+):\s*$/);
      let indentation = line.search(/\S|$/);

      if (match && indentation === 2) {
        return match[1];
      }
    }

    return null;
  }

  getServiceLines(serviceName) {
    let yamlLines = this.editor.getValue().split("\n");
    let startLine = -1, endLine = yamlLines.length - 1;

    for (let i = 0; i < yamlLines.length; i++) {
      let line = yamlLines[i];

      if (line.match(new RegExp(`^\\s*${serviceName}:\\s*$`))) {
        startLine = i;
      }

      if (startLine !== -1 && i > startLine) {
        let nextServiceMatch = line.match(/^\s*[a-zA-Z0-9_-]+:\s*$/);
        let indentation = line.search(/\S|$/);

        if (nextServiceMatch && indentation === 2) {
          endLine = i - 1;
          break;
        }
      }
    }

    return { start: startLine, end: endLine, yamlLines };
  }

  selectServiceInEditor(serviceName) {
    let { start, end, yamlLines } = this.getServiceLines(serviceName);

    if (start !== -1) {
      this.editor.selection.setRange(new ace.Range(start, 0, end, yamlLines[end]?.length || 0));
      this.editor.scrollToLine(start, true, true, function () { });
    }
  }
}
