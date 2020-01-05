/// <reference path="./window.d.ts"/>
import * as React from 'react';
import * as ReactDom from 'react-dom';
import './style/index.scss';
import { Main } from './react/main';

let MyMainEle = Main;
let MainVersion = 0;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

function render() {
  ReactDom.render(<MyMainEle key={MainVersion} />, document.getElementById('react-root'));
}
render();

if (module && (module as any).hot) {
  (module as any).hot.accept('./react/main', async function() {
    MyMainEle = (await import('./react/main')).Main;
    MainVersion++;
    render();
  });
}

