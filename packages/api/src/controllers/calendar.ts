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
import { CalendarGetQuerySchema } from "@jimmodel/shared";
import _ from "lodash";
dayjs.extend(utc);

const dayjsutc = dayjs.utc;

/**
 * Get the date range for the given date and mode
 */
function getDateRange(date: Dayjs, mode: CalendarMode) {
  switch (mode) {
    // case CalendarMode.Day:
    //   return {
    //     startDate: date.startOf("day"),
    //     endDate: date.endOf("day"),
    //   };
    case CalendarMode.Week:
      return {
        startDate: date.startOf("week"),
        endDate: date.endOf("week"),
      };
    case CalendarMode.Month:
      const startOfMonth = date.startOf("month");
      const endOfMonth = date.endOf("month");
      return {
        startDate: startOfMonth.startOf("week"),
        endDate: endOfMonth.endOf("week"),
      };
  }
}

/**
 * Get all booking events that are active between the given date range
 * @param startDate 
 * @param endDate 
 * @returns 
 */
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
      job: {
        status: {not: JobStatus.ARCHIVED}
      }
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

/**
 * Get all block events that are active between the given date range
 * @param startDate 
 * @param endDate 
 * @returns 
 */
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
      models: true,
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

/**
 * Get all calendar events (booking and block) that are active between the given date range
 * @param startDate 
 * @param endDate 
 * @returns 
 */
async function getCalendarEvents(startDate: Dayjs, endDate: Dayjs) {
  const calendarEvents = await Promise.all([
    getBookingEvents(startDate, endDate),
    getBlockEvents(startDate, endDate),
  ]);

  return calendarEvents.flat();
}

/**
 * Get the date keys for the given event. Date keys are the dates that the event spans. 
 * @param event 
 * @returns 
 */
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

/**
 * Get a map of event ids to the date keys that the event spans
 * @param events 
 * @returns 
 */
function getEventDateKeysMap(events: CalendarEvent[]) {
  const eventToDateKeys: Map<string, string[]> = new Map();

  for (const event of events) {
    const dateKeys = getDateKeyMap(event);
    eventToDateKeys.set(event.id, dateKeys);
  }

  return eventToDateKeys;
}

/**
 * Sort events in the order they should be displayed
 * @param a 
 * @param b 
 * @returns 
 */
function eventSortFn(a: CalendarEvent, b: CalendarEvent) {
  if (a.type === EventType.Block && b.type === EventType.Booking) {
    return -1;
  }
  if (a.type === EventType.Booking && b.type === EventType.Block) {
    return 1;
  }

  if (a.type === EventType.Booking && b.type === EventType.Booking) {
    if (
      a.details.job.status === JobStatus.CONFIRMED &&
      b.details.job.status === JobStatus.PENDING
    ) {
      return -1;
    }
    if (
      a.details.job.status === JobStatus.PENDING &&
      b.details.job.status === JobStatus.CONFIRMED
    ) {
      return 1;
    }
  }

  return a.details.start.getTime() - b.details.start.getTime();
}

/**
 * Sort models in place by the number of appointments they have in the day
 */
function sortModel(dates: Calendar['dates']){
  dates.forEach((date) => {
    const modelAppointmentsCount = new Map<string, number>();

    date.events.forEach((event) => {
      if (event.type === EventType.Booking) {
        event.details.job.models.forEach((model) => {
          modelAppointmentsCount.set(
            model.id,
            (modelAppointmentsCount.get(model.id) ?? 0) + 1
          );
        });
      }
    });

    date.events.forEach((event) => {
      if (event.type === EventType.Booking) {
        event.details.job.models.sort(
          (a, b) =>
            (modelAppointmentsCount.get(b.id) ?? 0) -
            (modelAppointmentsCount.get(a.id) ?? 0)
        );
      }
    });
  });
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
        .map((event) => _.cloneDeep(event))
        .sort(eventSortFn);

      dates.push({ events, date: currentDate.toDate() });

      currentDate = currentDate.add(1, "day");
    }

    sortModel(dates)

    const calendar: Calendar = {
      mode,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      dates
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
