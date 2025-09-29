import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

const container = document.getElementById('root');
const root = createRoot(container!);
//try {
//	navigator.serviceWorker.register('/service-worker.js')
//	.then(() => console.log("Service worker registered"))
//	.catch((error) => console.log(error));
//} catch (e) {
//	console.log(e)
//	console.log("service workers are not supported")
//}
defineCustomElements(window)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
