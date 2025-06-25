export interface IEvent {
  title: string;
  valley: string;
  start: string;
  startDate: string;
  status: string;
  progress: number; 
  taskId: string;
  faena: string;
  process: string;
}

export interface IDateEnv {
    timeZone: string;
    locale: {
        weekText: string;
        weekTextLong: string;
        code: string;
        [key: string]: string | object;
    };
    [key: string]: unknown;
}

export interface ICalendarData {
    viewTitle: string;
    dateProfile: {
        activeRange: {
            start: Date;
            end: Date;
        };
        currentRange: {
            start: Date;
            end: Date;
        };
        validRange: {
            start: Date | null;
            end: Date | null;
        };
    };
    [key: string]: unknown;
}

export interface ICalendarInfo {
    end: Date;
    endStr: string;
    start: Date;
    startStr: string;
    timeZone: string;
    view: {
        type: string;
        dateEnv: IDateEnv;
        getCurrentData: () => ICalendarData;
    };
    event: IEvent;
}