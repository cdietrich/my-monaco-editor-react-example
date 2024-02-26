// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'
import { UserConfig, WrapperConfig } from 'monaco-editor-wrapper'
import { buildWorkerDefinition } from 'monaco-editor-workers';
import { Uri } from 'vscode';
// import { useOpenEditorStub } from 'monaco-languageclient';
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
// import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
// import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import MonacoEditorReactCompExtended, { Model } from './MonacoEditorReactCompExtended';
import { useState } from 'react';
buildWorkerDefinition('../../../../node_modules/monaco-editor-workers/dist/workers', import.meta.url, false);

const getUserConfig = (workerUrl: URL, model: Model): UserConfig => {
  const serviceConfig = {
    workspaceConfig: {
      workspaceProvider: {
        trusted: true,
        workspace: {
          workspaceUri: Uri.file("/workspace"),
        },
        async open() {
          return false;
        },
      },
    },
    userServices: {
      ...getConfigurationServiceOverride(),
      //   ...getEditorServiceOverride(useOpenEditorStub),
    },
    debugLogging: true,
  };
  
  const languageId = 'hello';
  const wrapperConfig: WrapperConfig = {
    serviceConfig,
    editorAppConfig: {
      $type: 'classic' as const,
      languageId,
      code: model?.content ?? 'No Model specified',
      codeUri: model?.uri ?? 'dummy.hello',
      useDiffEditor: false,
      editorOptions: {
        'semanticHighlighting.enabled': true,
      },
      languageExtensionConfig: { id: languageId },
      //languageDef: monarchGrammar,
      // themeData: LangiumTheme,
      // theme: 'langium-theme',
      // userConfiguration: {
      //   //   // or configure the semantic highlighting like this:
      //   //   // `{ json: "editor.semanticHighlighting.enabled": true }`
      //   json: '{"editor.semanticHighlighting.enabled": true}',
      // },
    },
  };

  const userConfig: UserConfig = {
    wrapperConfig,
    languageClientConfig: {
      options: {
        $type: 'WorkerConfig' as const,
        url: workerUrl,
        type: "classic" as const,
      },
    },
  };
  return userConfig;
};



// const fileSystemProvider = new RegisteredFileSystemProvider(true);
// fileSystemProvider.registerFile(new RegisteredMemoryFile(Uri.file('/workspace/other.hello'), 'person Xxxxx person Yyyyyy'));
// registerFileSystemOverlay(1, fileSystemProvider); 

function App() {

  const [otherFiles, setOtherFiles] = useState<Model[]>([
    {uri:  "others-demo.hello", content: "person Person1 person Person2"},
    {uri:  "another-demo.hello", content: "person Person5"}
   ]);
  const [isOtherFiles1, setOtherFiles1] = useState(true);

  // const workerRef = useRef<Worker>();
  // if (workerRef.current) {
  //   console.log("terminate");
  //   workerRef.current.terminate();
  // }
  const workerURL = new URL('./hello-world-server-worker.js', window.location.origin);
  // workerRef.current = new Worker(workerURL.href, {
  //   type: 'classic' as const,
  //   name: 'hello-world-language-server-worker'
  // });

  const userConfig = getUserConfig(workerURL, {
    content: "person A Hello A! Hello Person1!",
    uri: "demo.hello"
  } )

  const onLoad = () => {
    console.log("mimiimi onLoad");
  }

  function handleOnClick() {
    console.log("handleOnClick");
    if (isOtherFiles1) {
      setOtherFiles([
        {uri:  "others-demo2.hello", content: "person Person3 person Person4"},
        {uri:  "another-demo.hello", content: "person Person5"}
       ])
    } else {
      setOtherFiles([
        {uri:  "others-demo.hello", content: "person Person1 person Person2"},
        {uri:  "another-demo.hello", content: "person Person5"}
       ])
    }
    setOtherFiles1(!isOtherFiles1);
  }
  // 
  return (
    <div className="lulu">
      <button onClick={handleOnClick}>Click Me!</button>
      <MonacoEditorReactCompExtended
    // key={new Date().toISOString() /* without this the updated monaco seems to not usable at all */}  
    userConfig={userConfig}
    onLoad={onLoad}
    otherFiles={otherFiles}
    style={{
      paddingTop: '5px',
      height: '40vh',
      width: '100%',
    }}
    
        />
    </div>
  )
}

export default App
