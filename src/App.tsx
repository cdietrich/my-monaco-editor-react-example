// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'
import { UserConfig, WrapperConfig } from 'monaco-editor-wrapper'
import { buildWorkerDefinition } from 'monaco-editor-workers';
// import { Uri } from 'vscode';
// import { useOpenEditorStub } from 'monaco-languageclient';
// import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
// import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';

buildWorkerDefinition('../../../../node_modules/monaco-editor-workers/dist/workers', import.meta.url, false);

const getUserConfig = (lsWorker: Worker, model: {code?:string, uri?: string}) => {
  const serviceConfig = {
    // userServices: {
    //   ...getConfigurationServiceOverride(Uri.file('/workspace')),
    //   ...getEditorServiceOverride(useOpenEditorStub),
    // },
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

const workerURL = new URL('./hello-world-server-worker.js', window.location.origin);
const lsWorker = new Worker(workerURL.href, {
  type: 'classic' as const,
  name: 'hello-world-language-server-worker'
});

function App() {

  const userConfig = getUserConfig(lsWorker, {
    code: "person A Hello A!",
    uri: "demo.hello"
  } )

  return (
    <div>
      <MonacoEditorReactComp
      key={new Date().toISOString()}
    userConfig={userConfig}
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
