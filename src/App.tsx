import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override"
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override"
import { useWorkerFactory } from "monaco-editor-wrapper/workerFactory"
import type { languages } from "monaco-editor"
import { WrapperConfig } from 'monaco-editor-wrapper'
import { Uri } from 'vscode';
import MonacoEditorReactCompExtended, { Model } from './MonacoEditorReactCompExtended';
import { useState } from 'react';
import type { Logger } from "monaco-languageclient/tools"
const languageId = 'hello';


const getUserConfig = (
  workerUrl: string,
  fileExt: string,
  htmlElement: HTMLElement,
  model: Model,
  monarch?: languages.IMonarchLanguage,)
  
  
  
   : WrapperConfig => {
  //const fileExt = model.uri.split('.').pop() ?? 'hello';
  const loadLangiumWorker = () => {
    console.log(`Langium worker URL: ${workerUrl}`)
    const workerURL = new URL('./hello-world-server-worker.js', window.location.origin)
    return new Worker(workerURL, {
      type: "module",
      name: "Lotse Language Server Worker",
    })
  }
  const langiumWorker = loadLangiumWorker()
  return {
    $type: "classic",
    htmlContainer: htmlElement,
    vscodeApiConfig: {
      serviceOverrides: {
        ...getConfigurationServiceOverride(),
        //...getEditorServiceOverride(useOpenEditorStub),
        ...getKeybindingsServiceOverride(),
      },
    },
    editorAppConfig: {
      codeResources: {
        modified: {
          text: model.content,
          fileExt,
          enforceLanguageId: model.languageId,
        },
      },
      useDiffEditor: false,
      languageDef: {
        monarchLanguage: monarch,
        languageExtensionConfig: {
          id: model.languageId,
          extensions: [`.${fileExt}`],
        },
      },
      editorOptions: {
        "semanticHighlighting.enabled": true,
        theme: "vs-dark",
      },
      monacoWorkerFactory: (logger?: Logger) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWorkerFactory({
          logger,
          workerOverrides: {
            ignoreMapping: true,
            workerLoaders: {
              TextEditorWorker: () => {
                return new Worker(new URL("../libs/monaco-editor-workers/editorWorker-es.js", import.meta.url), {
                  type: "module",
                })
              },
            },
          },
        })
      },
    },
    languageClientConfigs: {
      lotse: {
        connection: {
          options: {
            $type: "WorkerDirect",
            worker: langiumWorker,
          },
        },
        clientOptions: {
          documentSelector: [languageId],
        },
      },
    },
  }



};

function App() {

  const [otherFiles, setOtherFiles] = useState<Model[]>([
    {uri:  "others-demo.hello", content: "person Person1 person Person2", languageId: 'hello'},
    {uri:  "another-demo.hello", content: "person Person5", languageId: 'hello'}
   ]);
  const [isOtherFiles1, setOtherFiles1] = useState(true);

  const initialModel = "person A Hello A! Hello Person1!";
  const [modelContent, setModelContent] = useState(initialModel)
  const [modelContent2, setModelContent2] = useState(initialModel)

  //const workerURL = new URL('./hello-world-server-worker.js', window.location.origin);

  const wrapperConfig = getUserConfig(
    
    './hello-world-server-worker.js', "hello", document.getElementById('root')!, {
    content: modelContent,
    uri: "demo.hello",
    languageId: "hello",
  } )

  const onLoad = () => {
    console.log("mimimi onLoad");
  }

  function handleOnClick() {
    if (isOtherFiles1) {
      setOtherFiles([
        {uri:  "others-demo2.hello", content: "person Person3 person Person4",languageId: "hello"},
        {uri:  "another-demo.hello", content: "person Person5",languageId: "hello"}
       ])
    } else {
      setOtherFiles([
        {uri:  "others-demo.hello", content: "person Person1 person Person2",languageId: "hello"},
        {uri:  "another-demo.hello", content: "person Person5",languageId: "hello"}
       ])
    }
    setOtherFiles1(!isOtherFiles1);
  }
  // 
  return (
    <div className="lulu">
      <button onClick={handleOnClick}>Click Me!</button>
      <MonacoEditorReactCompExtended
      otherFiles={otherFiles}
      wrapperConfig={wrapperConfig}
    onLoad={onLoad}
    // onTextChanged={(text) => { setModelContent2(text.main) }}
    style={{
      paddingTop: '5px',
      height: '40vh',
      width: '90%',
    }}
    
        />

   
        {/* <textarea
        value={modelContent2}
        style={{width: '90%', height: '40vh'}}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue !== modelContent) { // Only update if the value has changed
            setModelContent(newValue);
          }
        }}/>  */}
    </div>
  )
}

export default App
