import { store } from 'react-easy-state';

interface IState {
  name: string;
};

const defaultState: IState = {
  name: '',
};

export const state = store({ ...defaultState });