import { Calendar } from "@jimmodel/shared";
import { isLastColumn, isLastRow, padDates } from "../../pages/calendar/utils";
import { cn } from "../../lib/utils";
import dayjs from "dayjs";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import { Events } from "./events";
import utc from "dayjs/plugin/utc";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

dayjs.extend(utc);

export default function CalendarComp({ calendar }: { calendar?: Calendar }) {
  const calendarBoxRef = useRef<HTMLDivElement | null>(null);
  const now = dayjs();

  // Calculate height of each date cell
  useLayoutEffect(() => {
    const updateCellHeight = () => {
      if (calendarBoxRef.current) {
        const cellHeight =
          calendarBoxRef.current.clientHeight / Math.ceil(dates.length / 7);
        const dateCells = calendarBoxRef.current.querySelectorAll<HTMLElement>(
          ".calendar-date-cell"
        );
        dateCells.forEach((cell) => {
          cell.style.height = `${cellHeight}px`;
        });
      }
    };

    updateCellHeight();
    window.addEventListener("resize", updateCellHeight);
    return () => window.removeEventListener("resize", updateCellHeight);
  }, [calendar]);

  const dates = useMemo(() => {
    if (calendar === undefined) return [];
    return padDates(calendar.dates);
  }, [calendar]);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={cn(
              "text-center text-sm font-medium pt-1",
              !isLastColumn(i) ? "border-r" : ""
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div ref={calendarBoxRef} className={cn("grid grid-cols-7 grow")}>
        {calendar === undefined
          ? Array(35)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-full p-1">
                  <Skeleton className="h-full" />
                </div>
              ))
          : dates.map(({ date: d, events }, i) => {
              const date = dayjs(d);
              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "h-full p-1",
                    !isLastRow(i, dates.length) ? "border-b" : "",
                    !isLastColumn(i) ? "border-r" : "",
                    "calendar-date-cell"
                  )}
                >
                  <p
                    className={cn(
                      "text-center text-sm",
                      date.isSame(now, "month") ? "" : "text-muted-foreground",
                      date.isSame(dayjs(), "day") ? "font-bold" : ""
                    )}
                  >
                    {date.format("D")}
                  </p>
                  <div>
                    <Events
                      calendarDate={{ date: d, events: events }}
                      events={calendar.events}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
