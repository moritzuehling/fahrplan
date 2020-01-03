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
}

@view
export class ConferenceRoom extends React.Component<IConferenceDayProps, {}> {
  el: HTMLDivElement | null = null;
  
  constructor(p, c) {
    super(p, c);
    this.state = { contentElement: null };
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
  }

  @boundMethod
  updateScroll() {
    if (!this.el) {
      return;
    }
    
    // todo!
  }

  @boundMethod
  updateContentElement(el: HTMLDivElement | null) {
    this.setState({ contentElement: el })
  }

  render() {
    const dayStart = +new Date(eventSchedule.schedule.conference.days[state.selectedDay].day_start);
    const room = eventSchedule.schedule.conference.days[state.selectedDay].rooms[this.props.room];

    return (
      <section className="conference-room">
        <h3 className="conference-room-header">{ this.props.room }</h3>
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
      <i>by { event.persons.map(a => a.public_name).join(', ') }</i>
    </div>
  );
}));