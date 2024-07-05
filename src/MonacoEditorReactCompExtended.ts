import {
  MonacoEditorProps,
  MonacoEditorReactComp,
} from "@typefox/monaco-editor-react";
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
    for (const otherFile of this.props.otherFiles) {
      const modelRef = await createModelReference(Uri.parse(otherFile.uri), otherFile.content)
      modelRef.object.setLanguageId(otherFile.languageId);
      this.modelRefRef.set(otherFile.uri, modelRef)
    }
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
    
    if (
     this.differs(prevProps)
    ) {
      const newUris = new Set(this.props.otherFiles.map(f => f.uri))
      
      for (const otherFile of this.modelRefRef.keys()) {
        if (!newUris.has(otherFile)) {
          this.modelRefRef.get(otherFile)?.dispose();
          this.modelRefRef.delete(otherFile);
        }
      }
      for (const otherFile of this.props.otherFiles) {
        
        if (this.modelRefRef.has(otherFile.uri)) {
          console.log("updating " + otherFile.uri)
          this.modelRefRef.get(otherFile.uri)?.object.textEditorModel?.setValue(otherFile.content)
        } else {
          console.log("activating " + otherFile.uri, otherFile.content)
            const modelRef = await createModelReference(Uri.parse(otherFile.uri), otherFile.content)
            modelRef.object.setLanguageId(otherFile.languageId);
            this.modelRefRef.set(otherFile.uri, modelRef)
        }
      }
    
    }
    await super.componentDidUpdate(prevProps);
  }
}

export type MonacoEditorPropsExtended = MonacoEditorProps & {
  otherFiles: Model[];
  
};

export type Model = { content: string; uri: string; languageId: string; }