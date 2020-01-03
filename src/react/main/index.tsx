import './style.scss';
import * as React from 'react';
import { view } from 'react-easy-state';
import { state } from '../../state';
import { eventSchedule } from '../../state/schedule';
import { ScheduleHeader } from '../header';
import { Timeline } from '../timeline';
import { boundMethod } from 'autobind-decorator';

@view
export class Main extends React.Component<{}, { contentElement: HTMLDivElement | null }> {
  constructor(p, c) {
    super(p, c);
    this.state = { contentElement: null };
  }

  @boundMethod
  updateContentElement(el: HTMLDivElement | null) {
    this.setState({ contentElement: el })
  }

  render() {
    return (
      <div>
        <ScheduleHeader />
        <main className='content' ref={this.updateContentElement}>
          <Timeline scrollElement={this.state.contentElement} />
        </main>
      </div>
    );
  }
}
