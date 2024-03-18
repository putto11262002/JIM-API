import express from "express";
import { prisma } from "../prisma";
import {
  Calendar,
  CalendarEvent,
  CalendarMode,
  EventType,
  JobStatus,
} from "@jimmodel/shared";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { validate } from "../lib/validation";
import { CalendarGetQuerySchema } from "@jimmodel/shared/src/schemas";

dayjs.extend(utc);

const dayjsutc = dayjs.utc;
function getDateRange(date: Dayjs, mode: CalendarMode) {
  switch (mode) {
    case CalendarMode.Day:
      return {
        startDate: date.startOf("day"),
        endDate: date.endOf("day"),
      };
    case CalendarMode.Week:
      return {
        startDate: date.startOf("week"),
        endDate: date.endOf("week"),
      };
    case CalendarMode.Month:
      return {
        startDate: date.startOf("month"),
        endDate: date.endOf("month"),
      };
  }
}

async function getBookingEvents(startDate: Dayjs, endDate: Dayjs) {
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        {
          end: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        {
          start: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
      ],
    },
    include: {
      job: {
        include: {
          models: true,
          createdBy: true,
        },
      },
    },
  });

  const calendarEvent = bookings.map((booking) => {
    return {
      id: `booking-${booking.id}`,
      type: EventType.Booking,
      details: booking,
    } as CalendarEvent;
  });

  return calendarEvent;
}

async function getBlockEvents(startDate: Dayjs, endDate: Dayjs) {
  const blocks = await prisma.block.findMany({
    where: {
      OR: [
        {
          end: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
        {
          start: {
            gte: startDate.toISOString(),
            lte: endDate.toISOString(),
          },
        },
      ],
    },
    include: {
      models: true
    },
  });

  const calendarEvent = blocks.map((block) => {
    return {
      id: `block-${block.id}`,
      type: EventType.Block,
      details: block,
    } as CalendarEvent;
  });

  return calendarEvent;
}


async function getCalendarEvents(startDate: Dayjs, endDate: Dayjs) {
  const calendarEvents = await Promise.all([
    getBookingEvents(startDate, endDate),
    getBlockEvents(startDate, endDate)
  ]);

  return calendarEvents.flat();
}

function getDateKeyMap(event: CalendarEvent) {
  switch (event.type) {
    case EventType.Booking:
      var dateKeys: string[] = [];
      var currenDate = dayjs(event.details.start);
      var endDate = dayjs(event.details.end);

      while (!currenDate.isSame(endDate, "date")) {
        dateKeys.push(currenDate.format("YYYY-MM-DD"));
        currenDate = currenDate.add(1, "day");
      }
      dateKeys.push(currenDate.format("YYYY-MM-DD"));
      return dateKeys;
    case EventType.Block:
     
        var dateKeys: string[] = [];
        var currenDate = dayjs(event.details.start);
        var endDate = dayjs(event.details.end);
  
        while (!currenDate.isSame(endDate, "date")) {
          dateKeys.push(currenDate.format("YYYY-MM-DD"));
          currenDate = currenDate.add(1, "day");
        }
        dateKeys.push(currenDate.format("YYYY-MM-DD"));
        return dateKeys;
     
  }
}



function getEventDateKeysMap(events: CalendarEvent[]) {
  const eventToDateKeys: Map<string, string[]> = new Map();

  for (const event of events) {
    const dateKeys = getDateKeyMap(event);
    eventToDateKeys.set(event.id, dateKeys);
  }

  return eventToDateKeys;
}

async function getCalendar(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let { mode, date } = validate(req.query, CalendarGetQuerySchema);
    date = date || new Date();
    mode = mode || CalendarMode.Month;

    const { startDate, endDate } = getDateRange(dayjsutc(date), mode);

    const calendarEvents = await getCalendarEvents(startDate, endDate);

    const dates: Calendar["dates"][0][] = [];

    const eventDateKeysMap = getEventDateKeysMap(calendarEvents);

    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      const keyDate = currentDate.format("YYYY-MM-DD");
      const events = calendarEvents
        .filter((event) => eventDateKeysMap.get(event.id)?.includes(keyDate))
        .map((event) => ({...event}))
        .sort((a, b) => {
          if (a.type === EventType.Block && b.type === EventType.Booking){
            return -1
          }
          if (a.type === EventType.Booking && b.type === EventType.Block){
            return 1
          }

          if (a.type === EventType.Booking && b.type === EventType.Booking){
            if (a.details.job.status === JobStatus.CONFIRMED && b.details.job.status === JobStatus.PENDING){
              return -1
            }
            if (a.details.job.status === JobStatus.PENDING && b.details.job.status === JobStatus.CONFIRMED){
              return 1
            }

          }

          return a.details.start.getTime() - b.details.start.getTime();
        })
      

      dates.push({ events, date: currentDate.toDate() });

      currentDate = currentDate.add(1, "day");
    }

    // console.log(dates)

    const calendar: Calendar = {
      mode,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      dates,
      // events: calendarEvents.reduce((acc, event) => {
      //   acc[event.id] = event;
      //   return acc;
      // }, {} as Record<string, CalendarEvent>),
    };

    res.json(calendar);
  } catch (err) {
    next(err);
  }
}

const cookingController = {
  getCalendar,
};

export default cookingController;
