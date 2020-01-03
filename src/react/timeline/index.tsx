import * as React from 'react';
import { view } from 'react-easy-state';
import './style.scss';
import { eventSchedule } from '../../state/schedule';
import { state } from '../../state';
import { boundMethod } from 'autobind-decorator';

const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;
const PIXELS_PER_HOUR = 300;

export function differenceToPixel(differenceInMs: number) {
  return (PIXELS_PER_HOUR * differenceInMs / HOUR);
}

export function pixelToDifference(pixels: number) {
  return (pixels * HOUR) / PIXELS_PER_HOUR;
}

interface ITimelineProps {
  scrollElement: HTMLDivElement | null;
}

interface ITimelineState {
  scrollTop: number;
}

@view
export class Timeline extends React.Component<ITimelineProps, ITimelineState> {
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
    this.el!.addEventListener('scroll', this.updateScroll);
    this.setState({ scrollTop: el.scrollTop })
  }

  componentWillUnmount() {
    this.setScrollEle(null);
  }

  @boundMethod
  updateScroll() {
    if (!this.el) {
      return;
    }

    this.setState({
      scrollTop: this.el.scrollTop
    });
  }

  render() {
    const { scrollTop } = this.state;
    const { conference } = eventSchedule.schedule;
    const day = conference.days[state.selectedDay];

    if (!day) {
      return null;
    }

    const slots: JSX.Element[] = [];

    const start = +(new Date(day.day_start));
    const end = +(new Date(day.day_end));
    const slot = conference.timeslot_duration.split(':');
    const timeslotInterval = ((+slot[0] * HOUR) + (+slot[1] * MINUTE));

    const skipBeginng = pixelToDifference(scrollTop - 150);
    const skipEnd = pixelToDifference(scrollTop + window.innerHeight + 100);

    let r = 0;
    let s = 0;

    // We're assuming no funky stuff is happening here in regards to timing.
    for (let time = start; time < end; time += timeslotInterval) {
      if (time - start < skipBeginng || time - start > skipEnd) {
        s++;
        continue;
      }
      r++;
      slots.push(<TimelineSlot start={start} time={time} key={time} />)
    }
    return (
      <div className='timeline' aria-hidden='true' style={{ height: differenceToPixel(end - start) + 'px' }}>
        { slots }
      </div>
    )
  }
}

const TimelineSlot = React.memo((function TimelineSlot(props: { start: number, time: number }) {
  const date = new Date(props.time);
  const format = date.toLocaleTimeString(undefined, {
    timeStyle: 'short'
  } as any);
  return (
    <div className="timeline-slot" style={{ top: differenceToPixel(props.time - props.start) }} key={props.time}>
      { format }
    </div>
  );
}));