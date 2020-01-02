import './style.scss';
import * as React from 'react';
import { view } from 'react-easy-state';
import { state } from '../../state';


@view
export class Main extends React.Component {
  render() {
    return (
      <div className='main' onClick={() => state.name += '_'}>
        Hello, { state.name }
      </div>
    );
  }
}