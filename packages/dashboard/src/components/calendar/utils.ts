import { Calendar, CalendarEvent, EventType, JobStatus } from "@jimmodel/shared";
import dayjs from "dayjs"


export function padDates(dates: Calendar['dates']) {

  if (dates.length < 1) return dates 

  const paddedDates = [...dates];

  const startDate = dayjs(dates[0].date);
  const padBegin = startDate.startOf("week");

  let diff = startDate.diff(padBegin, "day");

  for (let i = diff - 1; i >= 0; i--) {
    paddedDates.unshift({ date: padBegin.add(i, "day").toDate(), events: [] });
  }

  const endDate = dayjs(dates[dates.length - 1].date);

  const padEnd = endDate.endOf("week");

  diff = padEnd.diff(endDate, "day");
  for (let i = 1; i <= diff; i++) {
    paddedDates.push({ date: endDate.add(i, "day").toDate(), events: [] });
  }
  return paddedDates;
}


export function isLastRow(index: number, totalLength: number, columns: number = 7) {
  return index >= totalLength - columns;
}

export function isLastColumn(index: number, columns: number = 7) {
  return index % columns === columns - 1;
}


export function getEventColor(event: CalendarEvent) {
  if (event.type === EventType.Booking) {
    return event.details.job.status === JobStatus.CONFIRMED
      ? "#000000"
      : event.details.job.createdBy.color;

  }

  if (event.type === EventType.Block) {
    return "#fc1703"
  }

  return "#000000";
}
