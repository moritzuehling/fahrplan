import './style.scss';
import * as React from 'react';
import { view } from 'react-easy-state';
import { state } from '../../state';
import { eventSchedule } from '../../state/schedule';
import { ScheduleHeader } from '../header';
import { Timeline } from '../timeline';
import { boundMethod } from 'autobind-decorator';
import { ConferenceRoom } from '../conferenceroom';

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
    const rooms = eventSchedule.schedule.conference.days[state.selectedDay] ? Object.keys(eventSchedule.schedule.conference.days[state.selectedDay].rooms) : [];

    return (
      <div>
        <ScheduleHeader />
        <main className='content' ref={this.updateContentElement} style={{ minWidth: 300 * rooms.length + 60 + 'px' }} >
          <Timeline scrollElement={this.state.contentElement} />
          { rooms.map(a => <ConferenceRoom room={a} scrollElement={this.state.contentElement} key={a} />) }
        </main>
      </div>
    );
  }
}
