import { BookingWithJob } from "./job";

export enum CalendarMode {
  Day = "day",
  Week = "week",
  Month = "month",
}


export type CalendarGetQuery = {
  mode?: CalendarMode;
  date?: Date;
};
export type Calendar = {
  mode: CalendarMode
  startDate: Date;
  endDate: Date;
  dates: {date: Date, events: string[]}[];
  events: Record<string, CalendarEvent>;
};

export enum EventType  {
  Booking = "booking",
  Reminder = "reminder"

}

export type CalendarEvent = {
  id: string;
  type: EventType.Booking;
  details: BookingWithJob;
} | {id: string, type: EventType.Reminder; details: {date: Date; message: string}};

