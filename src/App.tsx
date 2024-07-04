// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'
import { UserConfig, WrapperConfig } from 'monaco-editor-wrapper'
// import { buildWorkerDefinition } from 'monaco-editor-workers';
import { Uri } from 'vscode';
// import { useOpenEditorStub } from 'monaco-languageclient';
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
// import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
// import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import MonacoEditorReactCompExtended, { Model } from './MonacoEditorReactCompExtended';
import { useState } from 'react';
//buildWorkerDefinition('../../../../node_modules/monaco-editor-workers/dist/workers', import.meta.url, false);



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
  const fileExt = '.hello';
  const wrapperConfig: WrapperConfig = {
    serviceConfig,
    editorAppConfig: {
      $type: 'classic' as const,
      codeResources: {
        main: {
          fileExt,
          text: model?.content ?? 'No Model specified',
          uri: model?.uri ?? 'dummy.hello',
        }
      },
      useDiffEditor: false,
      editorOptions: {
        'semanticHighlighting.enabled': true,
      },
      languageDef: {
        languageExtensionConfig: {
          id: languageId,
          extensions: [fileExt],
        },
      },
    },
  };

  const userConfig: UserConfig = {
    wrapperConfig,
    languageClientConfig: {
      languageId,
      options: {
        $type: "WorkerDirect",
        worker: new Worker(workerUrl),
      },
    }
    
    
    
    // {
    //   options: {
    //     $type: 'WorkerConfig' as const,
    //     url: workerUrl,
    //     type: "classic" as const,
    //   },
    // },
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

  const workerURL = new URL('./hello-world-server-worker.js', window.location.origin);

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
