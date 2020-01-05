import './style.scss';
import * as React from 'react';
import { view } from 'react-easy-state';
import { boundMethod } from 'autobind-decorator';
import { eventSchedule, IConferenceEvent } from '../../state/schedule';
import { state } from '../../state';
import { differenceToPixel, HOUR, MINUTE } from '../timeline';

interface IConferenceDayProps {
  scrollElement: HTMLDivElement | null;
  room: string;
  roomNum: number;
}

interface IConferenceDayState {
  scrollTop: number;
}

@view
export class ConferenceRoom extends React.Component<IConferenceDayProps, IConferenceDayState> {
  el: HTMLDivElement | null = null;
  
  constructor(p, c) {
    super(p, c);
    this.state = { scrollTop: 0 };
  }

  componentDidMount() {
    this.setScrollEle(this.props.scrollElement);
  }

  componentDidUpdate() {
    this.setScrollEle(this.props.scrollElement);
  }

  setScrollEle(el: HTMLDivElement | null) {
    if (this.el == el) {
      return;
    }

    if (this.el) {
      this.el.removeEventListener('scroll', this.updateScroll);
    }

    this.el = el;
    if (el == null) {
      return;
    }

    this.el?.addEventListener('scroll', this.updateScroll);
    this.updateScroll();
  }

  @boundMethod
  updateScroll() {
    if (!this.el) {
      return;
    }

    this.setState({scrollTop: this.el.scrollTop});
  }

  render() {
    const day = eventSchedule.schedule.conference.days[state.selectedDay];
    const dayStart = +new Date(day.day_start);
    const dayEnd = +new Date(day.day_end);
    const room = eventSchedule.schedule.conference.days[state.selectedDay].rooms[this.props.room];

    const len = (+dayEnd - +dayStart);


    return (
      <section className="conference-room" style={{ 
        left: (this.props.roomNum * state.elementWidth) + 'px',
        height: (differenceToPixel(len) + 'px'),
        width: state.elementWidth + 'px',
      }}>
        <h3 className="conference-room-header" >{ this.props.room }</h3>
        <div className="conference-room-entries">
          { room.map(a => <Entry key={a.guid} event={a} dayStart={dayStart} />) }
        </div>
      </section>
    );
  }
}

const Entry = React.memo((function Entry(props: { event: IConferenceEvent, dayStart: number }) {
  const { event, dayStart: start } = props;
  const diff = +(new Date(event.date)) - start;

  const top = (differenceToPixel(diff) + 'px');

  const duration = event.duration.split(':');

  const height = ((differenceToPixel(+duration[0] * HOUR + +duration[1] * MINUTE) - 1) + 'px');
  return (
    <div className="conference-room-entry" style={{ top, height }}>
      <h4>{ event.title }</h4>
      <i>by { event.persons.map(a => a.public_name).join(', ') }</i><br />
      <div className="abstract">{ event.abstract }</div>
      <div className="conference-room-entry-track">{ event.track }</div>
    </div>
  );
}));