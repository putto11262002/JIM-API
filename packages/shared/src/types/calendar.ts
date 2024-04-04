import { Block } from "./block.js";
import { BookingWithJob } from "./job.js";

export enum CalendarMode {
  // Day = "day",
  Week = "week",
  Month = "month",
}

export type CalendarGetQuery = {
  mode?: CalendarMode;
  date?: Date;
};
export type Calendar = {
  mode: CalendarMode;
  startDate: Date;
  endDate: Date;
  dates: { date: Date; events: CalendarEvent[] }[];
  // events: Record<string, CalendarEvent>;
};

export enum EventType {
  Booking = "booking",
  Block = "block",
}

type HasStartEnd<T> = T extends { start: Date; end: Date } ? T : never;


export type CalendarEvent =
  | {
      id: string;
      type: EventType.Booking;
      details: HasStartEnd<BookingWithJob>;
    }
 
  | { id: string; type: EventType.Block; details: HasStartEnd<Block> };
