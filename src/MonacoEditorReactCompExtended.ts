import {
  MonacoEditorProps,
  MonacoEditorReactComp,
} from "@typefox/monaco-editor-react";
// import { Component } from "react";
import { IReference, ITextFileEditorModel, createModelReference } from 'vscode/monaco';
import { Uri } from 'monaco-editor';
// TODO is subclassing the right idea?
// or should we just use composition/wrapping?
export default class MonacoEditorReactCompExtended extends MonacoEditorReactComp<MonacoEditorPropsExtended> {
  
  modelRefRef = new Map<string,IReference<ITextFileEditorModel>>
  /*implements Component<MonacoEditorPropsExtended>*/ constructor(
    props: MonacoEditorPropsExtended
  ) {
    super(props);
  }

  override async componentDidMount() {
    console.log("did mount");
    return await super.componentDidMount();
  }

  override componentWillUnmount(): void {
    for (const ref of this.modelRefRef.values()) {
      console.log("disssssssppppoooooosssse")
      ref.dispose();
    }
    this.modelRefRef.clear();
    super.componentWillUnmount()
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
    // console.log(JSON.stringify(this.props.otherFiles));

    for (const otherFile of this.props.otherFiles) {
      const modelRef = await createModelReference(Uri.parse(otherFile.uri), otherFile.content)
      modelRef.object.setLanguageId(this.props.userConfig.wrapperConfig.editorAppConfig.languageId);
      this.modelRefRef.set(otherFile.uri, modelRef)
    }
    
    // await lc?.sendNotification("textDocument/didOpen", {
    //   textDocument: {
    //     uri: this.props.otherFileUri,
    //     version: 1,
    //     text: this.props.otherFileContent,
    //     languageId: "hello",
    //   },
    // });
  }

  differs(prevProps: MonacoEditorPropsExtended) {
    if (prevProps.otherFiles.length !== this.props.otherFiles.length) {
      return true
    }
    for (let i = 0; i < this.props.otherFiles.length; i++) {
      if (
        prevProps.otherFiles[i].content !== this.props.otherFiles[i].content ||
        prevProps.otherFiles[i].uri !== this.props.otherFiles[i].uri
      )
      return true
    }
    return false
  }

  override async componentDidUpdate(prevProps: MonacoEditorPropsExtended) {
    console.log("componentDidUpdate ");
    console.log(this.props.userConfig.wrapperConfig.editorAppConfig.codeUri)
    
    if (
     this.differs(prevProps)
    ) {
      const lc = this.getEditorWrapper().getLanguageClient();
      console.log("lc2", lc !== undefined);
      //console.log(this.props.otherFileContent);
      // see https://github.com/cdietrich/hello-world-sem-tokens/blob/794c53b13763fe1f94d81c2d2d0e42133533cc82/src/language/main-browser.ts#L22
      const newUris = new Set(this.props.otherFiles.map(f => f.uri))
      
      for (const otherFile of this.modelRefRef.keys()) {
        if (!newUris.has(otherFile)) {
          this.modelRefRef.get(otherFile)?.dispose();
          this.modelRefRef.delete(otherFile);
        }
        // console.log("disssssssppppoooooosssse " + ref.object)
        // await ref.dispose();
        // console.log("client closing ", otherFile.uri)      
        // await lc?.sendNotification("textDocument/didClose", {
        // textDocument: {
        //   uri: "file:///"+otherFile.uri,
        // },
        //});
      }


      //   const result = await lc?.sendRequest("workspace/didDeleteFiles", {
      //     files: [{
      //       uri: prevProps.otherFileUri,
      //     }],
      //   });

      // currently close does not work on server side
      // await lc?.sendNotification("workspace/didChangeWatchedFiles", {
      //   changes: [
      //     {
      //       uri: prevProps.otherFileUri,
      //       type: 3, // deleted
      //     },
      //   ],
      // });
      // vscode.workspace.openTextDocument(this.props.otherFileUri, {
      //   content: this.props.otherFileContent,
      // })
      for (const otherFile of this.props.otherFiles) {
        
        if (this.modelRefRef.has(otherFile.uri)) {
          console.log("updating " + otherFile.uri)
          this.modelRefRef.get(otherFile.uri)?.object.textEditorModel?.setValue(otherFile.content)
        } else {
          console.log("activating " + otherFile.uri, otherFile.content)
            const modelRef = await createModelReference(Uri.parse(otherFile.uri), otherFile.content)
            modelRef.object.setLanguageId(this.props.userConfig.wrapperConfig.editorAppConfig.languageId);
            this.modelRefRef.set(otherFile.uri, modelRef)
        }
        // console.log(otherFile.content)
        // const modelRef = await createModelReference(Uri.parse(otherFile.uri), otherFile.content)
        // modelRef.object.setLanguageId("hello");
        // this.modelRefRef.push(modelRef)
        // await lc?.sendNotification("textDocument/didOpen", {
        //   textDocument: {
        //     uri: otherFile.uri,
        //     version: 1,
        //     text: otherFile.content,
        //     languageId: "hello",
        //   },
        // });
      }
    
    }
    await super.componentDidUpdate(prevProps);
  }
}

export type MonacoEditorPropsExtended = MonacoEditorProps & {
  otherFiles: Model[];
};

export type Model = { content: string; uri: string }