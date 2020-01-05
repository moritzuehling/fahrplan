import * as React from 'react';
import { view, store } from 'react-easy-state';
import './style.scss';
import { eventSchedule, IConferenceDay } from '../../state/schedule';
import { state } from '../../state';

function selectDay(ev: React.ChangeEvent<HTMLSelectElement>) {
  state.selectedDay = +ev.currentTarget.value;
}

function getDate(day: IConferenceDay) {
  const sp = day.date.split('-');
  const date = new Date(+sp[0], +sp[1] - 1, +sp[2]);
  return date.toLocaleDateString();
}

@view
export class ScheduleHeader extends React.Component {
  render() {
    const days = eventSchedule.schedule.conference.days;

    return (
      <header>
        <select className='select-day' value={state.selectedDay} onChange={selectDay}>
          { days.map((a, i) => <option value={i} key={i}>Day {i + 1} - {getDate(a)}</option>) }
        </select>
    <button className='fullscreen' style={{ position: 'absolute', right: '80px', height: '30px', top: '10px' }} onClick={() => (document.body.requestFullscreen || document.body['webkitRequestFullscreen'])()}>fullscreen: { document.fullscreenEnabled ? 'true' : 'false' }</button>
      </header>
    )
  }
}