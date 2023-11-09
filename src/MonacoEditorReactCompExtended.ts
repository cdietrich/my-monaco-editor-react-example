import { MonacoEditorProps, MonacoEditorReactComp } from "@typefox/monaco-editor-react";
// import { Component } from "react";

// TODO is subclassing the right idea? 
// or should we just use composition/wrapping?
export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp<MonacoEditorPropsExtended>
/*implements Component<MonacoEditorPropsExtended>*/ {
    constructor(props: MonacoEditorPropsExtended) {
        super(props);
    }

    override async componentDidMount() {
        console.log("did mount")
        return await super.componentDidMount();
    }

    protected isReInitRequired(prevProps: MonacoEditorPropsExtended): boolean {
        const result = super.isReInitRequired(prevProps)
            || prevProps.otherFileContent !== this.props.otherFileContent
            || prevProps.otherFileUri !== this.props.otherFileUri
        console.log("isReInitRequired", result)
        return result
    }

    override async startMonaco() {
        console.log("startMonaco")
        await super.startMonaco();
        const lc = this.getEditorWrapper().getLanguageClient();
        console.log("lc", lc !== undefined);
        console.log(this.props.otherFileContent)
        await lc?.sendNotification("textDocument/didOpen", {
            textDocument: {
                uri: this.props.otherFileUri,
                version: 1,
                text: this.props.otherFileContent,
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