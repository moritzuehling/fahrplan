import { store } from 'react-easy-state';

interface IState {
  selectedDay: number;
};

const defaultState: IState = {
  selectedDay: 0,
};

export const state = store({ ...defaultState });