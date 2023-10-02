// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { MonacoEditorReactComp } from '@typefox/monaco-editor-react'


const getUserConfig = (lsWorker: Worker, model: {code?:string, uri?: string}) => {
  const serviceConfig = {
    enableModelService: true,
    configureEditorOrViewsService: {},
    configureConfigurationService: {
      defaultWorkspaceUri: '/tmp/',
    },
    enableLanguagesService: true,
    enableKeybindingsService: true,
    debugLogging: true,
  };
  const languageId = 'hello';
  const wrapperConfig = {
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
      userConfiguration: {
        //   // or configure the semantic highlighting like this:
        //   // `{ json: "editor.semanticHighlighting.enabled": true }`
        json: '{"editor.semanticHighlighting.enabled": true}',
      },
    },
    // languageExtensionConfig: {
    //   id: languageId,
    // },
  };

  const userConfig = {
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
