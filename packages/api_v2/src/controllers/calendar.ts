import express from "express";
import { prisma } from "../prisma";
import {
  Calendar,
  CalendarEvent,
  CalendarMode,
  EventType,
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

async function getCalendarEvents(startDate: Dayjs, endDate: Dayjs) {
  const calendarEvents = await Promise.all([
    getBookingEvents(startDate, endDate),
  ]);

  return calendarEvents.flat();
}

function getDateKeyMap(event: CalendarEvent) {
  switch (event.type) {
    case EventType.Booking:
      const dateKeys: string[] = [];
      let currenDate = dayjs(event.details.start);
      const endDate = dayjs(event.details.end);

      while (!currenDate.isSame(endDate, "date")) {
        dateKeys.push(currenDate.format("YYYY-MM-DD"));
        currenDate = currenDate.add(1, "day");
      }
      dateKeys.push(currenDate.format("YYYY-MM-DD"));
      return dateKeys;
    case EventType.Reminder:
      return [dayjs(event.details.date).format("YYYY-MM-DD")];
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
      const eventIds = calendarEvents
        .filter((event) => eventDateKeysMap.get(event.id)?.includes(keyDate))
        .map((event) => event.id);

      dates.push({ events: eventIds, date: currentDate.toDate() });

      currentDate = currentDate.add(1, "day");
    }

    const calendar: Calendar = {
      mode,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      dates,
      events: calendarEvents.reduce((acc, event) => {
        acc[event.id] = event;
        return acc;
      }, {} as Record<string, CalendarEvent>),
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
