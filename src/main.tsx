// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
//import './index.css'

//import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';

// const configureMonacoWorkers = () => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useWorkerFactory({
//         ignoreMapping: true,
//         workerLoaders: {
//             editorWorkerService: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
//         }
//     });
//   };
// configureMonacoWorkers();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />,
)
