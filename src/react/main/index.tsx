import './style.scss';
import * as React from 'react';
import { view } from 'react-easy-state';
import { state, reCalculateElementWidth } from '../../state';
import { eventSchedule } from '../../state/schedule';
import { ScheduleHeader } from '../header';
import { Timeline, differenceToPixel } from '../timeline';
import { boundMethod } from 'autobind-decorator';
import { ConferenceRoom } from '../conferenceroom';

interface IMainState {
  contentElement: HTMLDivElement | null;
  roomElement: HTMLDivElement | null;
}

@view
export class Main extends React.Component<{}, IMainState> {
  width: number = 300;
  timeout: number | null = null;

  constructor(p, c) {
    super(p, c);
    this.state = {
      contentElement: null,
      roomElement: null,
    };
  }

  @boundMethod
  updateContentElement(el: HTMLDivElement | null) {
    this.setState({ contentElement: el });
  }

  @boundMethod
  updateRoomElement(el: HTMLDivElement | null) {
    this.setState({ roomElement: el });
  }

  componentDidMount() {
    reCalculateElementWidth();
  }

  @boundMethod
  scroll(ev: React.UIEvent<HTMLDivElement>) {
    console.log('scroll');
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(this.scrollEnd, 50);
  }

  @boundMethod
  scrollEnd() {
    console.log('scrollEnd');
    const el = this.state.roomElement;
    if (!el) {
      return;
    }

    const overScroll = (el.scrollLeft | 0) % state.elementWidth;
    const underScroll = state.elementWidth - overScroll;

    if (overScroll < 2 || underScroll < 2) {
      return;
    }

    console.log(state.elementWidth);
    console.log('scrolling ended at', el.scrollLeft, overScroll, underScroll);

    if (underScroll < overScroll) {
      el.scrollBy(underScroll, 0);
    } else {
      el.scrollBy(-overScroll, 0);
    }

  }

  render() {
    if (eventSchedule.schedule.conference.daysCount == 0) {
      return null;
    }

    const day = eventSchedule.schedule.conference.days[state.selectedDay];
    if (!day) {
      return null;
    }

    const dayStart = +new Date(day.day_start);
    const dayEnd = +new Date(day.day_end);
    const len = (+dayEnd - +dayStart);
  
    return (
      <div>
        <ScheduleHeader />
        <main className='content' ref={this.updateContentElement}> 
          <Timeline scrollElement={this.state.contentElement} />
          <div className='room-content' style={{ height: (differenceToPixel(len) + 'px') }} onScroll={this.scroll} ref={this.updateRoomElement}>
            { Object.keys(day.rooms).map((a, i) => <ConferenceRoom room={a} roomNum={i} scrollElement={this.state.contentElement} key={a} />) }
          </div>
        </main>
      </div>
    );
  }
}
