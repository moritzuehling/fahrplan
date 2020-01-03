import { store } from 'react-easy-state';

export interface IEventSchedule {
  version: string;
  base_url: string;
  conference: IConference;
}

export interface IConference {
  acronym: string;
  title: string;
  start: string;
  end: string;
  daysCount: number;
  timeslot_duration: string;
  days: IConferenceDay[];
}

export interface IConferenceDay {
  index: number;
  date: string;
  day_start: string;
  day_end: string;
  rooms: IConferenceRoomCollection;
}

export interface IConferenceRoomCollection {
  [name: string]: IConferenceEvent[]
}

export interface IConferenceEvent {
  url: string;
  id: number;
  title: string;
  guid: string;
  start: string;
  duration: string;
  room: string;
  slug: string;
  track: string | null;
  type: string;
  language: string;
  abstract: string;
  description: string;
  recording_license: string;
  do_not_record: boolean;
  persons: IConferencePerson[];
  links: IConferenceLink[];
  attachments: IConferenceAttachment[];

}

export interface IConferencePerson {
  id: number;
  public_name: string;
}

export interface IConferenceLink {
  url: string;
  title: string;
}

export type IConferenceAttachment = IConferenceLink;

interface IEventScheduleContainer {
  schedule: IEventSchedule;
  lastUpdate: number;
}

const defaultSchedule: IEventScheduleContainer = {
  schedule: {
    base_url: '',
    version: '0.0',
    conference: {
      acronym: '',
      days: [],
      daysCount: 0,
      start: '2019-01-01',
      end: '2019-01-02',
      timeslot_duration: '01:00',
      title: 'Loading...',
    }
  },
  lastUpdate: 0,
}

function initializeSchedule(scheduleObject: IEventScheduleContainer, onlyTime: boolean) {
  const lu = window.localStorage.getItem('cached-schedule-update');
  if (lu) {
    scheduleObject.lastUpdate = +lu;
  }

  if (onlyTime) {
    return;
  }

  const cs = window.localStorage.getItem('cached-schedule');
  if (cs) {
    scheduleObject.schedule = JSON.parse(cs).schedule;
  }
}

initializeSchedule(defaultSchedule, false);
export const eventSchedule: IEventScheduleContainer = store(defaultSchedule);
window['eventSchedule'] = eventSchedule;

export async function updateSchedule() {
  const schedStr = await fetch('/assets/schedule.json').then(a => a.text());
  const cs = window.localStorage.getItem('cached-schedule');

  window.localStorage.setItem('last-update', (+Date.now()).toString());
  if (schedStr == cs) {
    console.log('schedule changes --> no changes detected, leaving the object alone!');
    initializeSchedule(eventSchedule, true);
  } else {
    window.localStorage.setItem('cached-schedule', schedStr);
    initializeSchedule(eventSchedule, false);
  }
}

updateSchedule();