/// <reference path="./window.d.ts"/>
import * as React from 'react';
import * as ReactDom from 'react-dom';
import './style/index.scss';
import { Main } from './react/main';

let MyMainEle = Main;
let MainVersion = 0;

function render() {
  ReactDom.render(<MyMainEle key={MainVersion} />, document.getElementById('react-root'));
}
render();
if (module && module.hot) {
  module.hot.accept('./react/main', async function() {
    MyMainEle = (await import('./react/main')).Main;
    MainVersion++;
    render();
  });
}

