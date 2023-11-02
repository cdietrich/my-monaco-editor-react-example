import { MonacoEditorProps, MonacoEditorReactComp } from "@typefox/monaco-editor-react";

export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp {
    constructor(private propsExt: MonacoEditorPropsExtended) {
        super(propsExt);
    }
    override async componentDidMount() {
        await super.componentDidMount();
        const lc = this.getEditorWrapper().getLanguageClient();
        await lc?.sendNotification("textDocument/didOpen", {
            textDocument: {
                uri: this.propsExt.otherFileUri,
                version: 1,
                text: this.propsExt.otherFileContent,
                languageId: "hello"
            }
        });
    }
}

export type MonacoEditorPropsExtended = MonacoEditorProps & {
    otherFileContent: string;
    otherFileUri: string;
};