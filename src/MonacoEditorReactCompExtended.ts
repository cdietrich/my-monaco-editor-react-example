import { MonacoEditorProps, MonacoEditorReactComp } from "@typefox/monaco-editor-react";
// import { Component } from "react";

// TODO is subclassing the right idea? 
// or should we just use composition/wrapping?
export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp<MonacoEditorPropsExtended>
/*implements Component<MonacoEditorPropsExtended>*/ {
    constructor(propsExt: MonacoEditorPropsExtended) {
        super(propsExt);
    }
    // override async componentDidMount() {
    //     console.log("didMount")
    //     await super.componentDidMount();
    //     const lc = this.getEditorWrapper().getLanguageClient();
    //     console.log("lc", lc !== undefined);
    //     await lc?.sendNotification("textDocument/didOpen", {
    //         textDocument: {
    //             uri: this.propsExt.otherFileUri,
    //             version: 1,
    //             text: this.propsExt.otherFileContent,
    //             languageId: "hello"
    //         }
    //     });
    // }

    // override async componentDidUpdate(prevProps: MonacoEditorPropsExtended) {
    //     console.log("argggggg ", prevProps.otherFileUri)
    //     return super.componentDidUpdate(prevProps);
    // }
}

export type MonacoEditorPropsExtended = MonacoEditorProps & {
    otherFileContent: string;
    otherFileUri: string;
};