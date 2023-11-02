import { MonacoEditorProps, MonacoEditorReactComp } from "@typefox/monaco-editor-react";

export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp {
    constructor(private propsExt: MonacoEditorPropsExtended) {
        super(propsExt);
    }
    override async componentDidMount() {
        console.log("didMount")
        await super.componentDidMount();
        const lc = this.getEditorWrapper().getLanguageClient();
        console.log("lc", lc !== undefined);
        await lc?.sendNotification("textDocument/didOpen", {
            textDocument: {
                uri: this.propsExt.otherFileUri,
                version: 1,
                text: this.propsExt.otherFileContent,
                languageId: "hello"
            }
        });
    }

    override async componentDidUpdate(prevProps: MonacoEditorPropsExtended) {
        console.log("argggggg ", prevProps.otherFileUri)
        return super.componentDidUpdate(prevProps);
    }
}

export type MonacoEditorPropsExtended = MonacoEditorProps & {
    otherFileContent: string;
    otherFileUri: string;
};