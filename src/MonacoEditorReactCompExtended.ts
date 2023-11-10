import {
  MonacoEditorProps,
  MonacoEditorReactComp,
} from "@typefox/monaco-editor-react";
// import { Component } from "react";

// TODO is subclassing the right idea?
// or should we just use composition/wrapping?
export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp<MonacoEditorPropsExtended> {
  /*implements Component<MonacoEditorPropsExtended>*/ constructor(
    props: MonacoEditorPropsExtended
  ) {
    super(props);
  }

  override async componentDidMount() {
    console.log("did mount");
    return await super.componentDidMount();
  }

  override isReInitRequired(prevProps: MonacoEditorPropsExtended): boolean {
    const result = super.isReInitRequired(prevProps);
    console.log("isReInitRequired", result);
    return result;
  }

  override async initMonaco() {
    console.log("initMonaco");
    return super.initMonaco();
  }

  override async startMonaco() {
    console.log("startMonaco");
    await super.startMonaco();
    const lc = this.getEditorWrapper().getLanguageClient();
    console.log("lc", lc !== undefined);
    console.log(this.props.otherFileContent);
    await lc?.sendNotification("textDocument/didOpen", {
      textDocument: {
        uri: this.props.otherFileUri,
        version: 1,
        text: this.props.otherFileContent,
        languageId: "hello",
      },
    });
  }

  override async componentDidUpdate(prevProps: MonacoEditorPropsExtended) {
    console.log("componentDidUpdate ", prevProps.otherFileUri);
    await super.componentDidUpdate(prevProps);
    if (
      prevProps.otherFileContent !== this.props.otherFileContent ||
      prevProps.otherFileUri !== this.props.otherFileUri
    ) {
      const lc = this.getEditorWrapper().getLanguageClient();
      console.log("lc2", lc !== undefined);
      console.log(this.props.otherFileContent);
      //   await lc?.sendNotification("textDocument/didClose", {
      //     textDocument: {
      //       uri: prevProps.otherFileUri,
      //     },
      //   });

      //   const result = await lc?.sendRequest("workspace/didDeleteFiles", {
      //     files: [{
      //       uri: prevProps.otherFileUri,
      //     }],
      //   });

      // currently close does not work on server side
      await lc?.sendNotification("workspace/didChangeWatchedFiles", {
        changes: [
          {
            uri: prevProps.otherFileUri,
            type: 3, // deleted
          },
        ],
      });

      await lc?.sendNotification("textDocument/didOpen", {
        textDocument: {
          uri: this.props.otherFileUri,
          version: 1,
          text: this.props.otherFileContent,
          languageId: "hello",
        },
      });
    }
  }
}

export type MonacoEditorPropsExtended = MonacoEditorProps & {
  otherFileContent: string;
  otherFileUri: string;
};
