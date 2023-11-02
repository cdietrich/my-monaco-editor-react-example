// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'
import { UserConfig, WrapperConfig } from 'monaco-editor-wrapper'
import { buildWorkerDefinition } from 'monaco-editor-workers';
import { Uri } from 'vscode';
// import { useOpenEditorStub } from 'monaco-languageclient';
import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
// import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import { RegisteredFileSystemProvider, registerFileSystemOverlay, RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import MonacoEditorReactCompExtended from './MonacoEditorReactCompExtended';
import { useState } from 'react';
buildWorkerDefinition('../../../../node_modules/monaco-editor-workers/dist/workers', import.meta.url, false);

const getUserConfig = (lsWorker: Worker, model: {code?:string, uri?: string}) => {
  const serviceConfig = {
    userServices: {
      ...getConfigurationServiceOverride(Uri.file('/workspace')),
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
      code: model?.code ?? 'No Model specified',
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
        $type: 'WorkerDirect' as const,
        worker: lsWorker,
      },
    },
  };
  return userConfig;
};



// const fileSystemProvider = new RegisteredFileSystemProvider(true);
// fileSystemProvider.registerFile(new RegisteredMemoryFile(Uri.file('/workspace/other.hello'), 'person Xxxxx person Yyyyyy'));
// registerFileSystemOverlay(1, fileSystemProvider); 

function App() {

  const [otherFileUri, setOtherFileUri] = useState<string>("memory://others-demo.hello");
  const [otherFileContent, setOtherFileContent] = useState<string>("person Person1 person Person2");

  const workerURL = new URL('./hello-world-server-worker.js', window.location.origin);
  // TODO find out why the component wiredly recycles the old worker otherwise
  workerURL.searchParams.set('xxxx', otherFileUri);
  const lsWorker = new Worker(workerURL.href, {
    type: 'classic' as const,
    name: 'hello-world-language-server-worker'
  });

  const userConfig = getUserConfig(lsWorker, {
    code: "person A Hello A!",
    uri: "demo.hello"
  } )

  const onLoad = () => {
    console.log("mimiimi onLoad");
  }

  function handleOnClick() {
    console.log("handleOnClick");
    setOtherFileUri("memory://others-demo2.hello");
    setOtherFileContent("person Person3 person Person4");
  }
  // 
  return (
    <div>
      <button onClick={handleOnClick}>Click Me!</button>
      <MonacoEditorReactCompExtended
    key={new Date().toISOString() /* without this the updated monaco seems to not usable at all */}  
    userConfig={userConfig}
    onLoad={onLoad}
    otherFileUri={otherFileUri}
    otherFileContent={otherFileContent}
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
