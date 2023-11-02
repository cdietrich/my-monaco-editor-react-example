import { MonacoEditorProps, MonacoEditorReactComp } from "@typefox/monaco-editor-react";

export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp {
    constructor(props: MonacoEditorProps) {
        super(props);
    }
    override async componentDidMount() {
        await super.componentDidMount();
        const lc = this.getEditorWrapper().getLanguageClient();
        await lc?.sendNotification("textDocument/didOpen", {
            textDocument: {
                uri: "memory://others-demo.hello",
                version: 1,
                text: "person Person1 person Person2",
                languageId: "hello"
            }
        });
    }
}