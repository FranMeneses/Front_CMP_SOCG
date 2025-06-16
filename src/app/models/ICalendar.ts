export interface IEvent {
    title: string;
    valley: string;
    start: string;
    startDate: string;
    status: string;
    progress: string;
    taskId: string;
    faena: string;
    process: string;
}

export interface ICalendarInfo {
  end: Date;
  endStr: string;
  start: Date;
  startStr: string;
  timeZone: string;
  view: {
    type: string;
    dateEnv: any;
    getCurrentData: () => any;
  };
  event: IEvent;
}