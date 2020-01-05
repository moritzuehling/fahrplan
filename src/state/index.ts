import { store } from 'react-easy-state';

interface IState {
  selectedDay: number;
  elementWidth: number,
};

const defaultState: IState = {
  selectedDay: 0,
  elementWidth: 300,
};

calcElementWidth(defaultState);

export const state = store({ ...defaultState });

function calcElementWidth(target: IState) {
  const content = document.querySelector('main.content');
  const width = content ? content.clientWidth : window.innerWidth;

  const parts = Math.max(1, (width - 40) / 250 | 0);
  target.elementWidth = (width - 40) / parts | 0;
}

export const reCalculateElementWidth = calcElementWidth.bind(window, state);
window.addEventListener('resize', reCalculateElementWidth);