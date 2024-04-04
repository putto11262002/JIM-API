import { isLastColumn, isLastRow } from "./utils";
import { cn } from "../../lib/utils";
import dayjs from "dayjs";
import { useLayoutEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import utc from "dayjs/plugin/utc";
import CalendarCell from "./cell";
import { CellDialogProvider } from "./cell-dialog";
import { useCalendar } from "./context";
import { CalendarMode } from "@jimmodel/shared";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

dayjs.extend(utc);

export default function CalendarComp() {

  const { mode } = useCalendar();

  return (
    <CellDialogProvider>
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

        <div className="grow">
          {mode === CalendarMode.Month && <CalendarCellsMonthMode />}
          {mode === CalendarMode.Week && <CalendarCellWeekMode />}
        </div>
      </div>
    </CellDialogProvider>
  );
}

function CalendarCellsMonthMode() {
  const calendarBoxRef = useRef<HTMLDivElement | null>(null);
 

  const { dates, now } = useCalendar()

  const initialContainerHeight = useRef<number | null>(null);

  // Calculate height of each date cell
  useLayoutEffect(() => {
    
    const updateCellHeight = () => {
     
     
      if (calendarBoxRef.current && dates.length >0) {

        if (initialContainerHeight.current === null) {
          initialContainerHeight.current = calendarBoxRef.current.clientHeight;
        }

        const _cellHeight = 
          initialContainerHeight.current / Math.ceil( dates.length / 7);

        const dateCells = calendarBoxRef.current.querySelectorAll<HTMLElement>(
          ".calendar-date-cell"
        );
        dateCells.forEach((cell) => {
          cell.style.height = `${_cellHeight}px`;
        })

        
      }
    };

    updateCellHeight();

    window.addEventListener("resize", updateCellHeight);
    return () => window.removeEventListener("resize", updateCellHeight);
  }, [dates]);




  return (
    <div ref={calendarBoxRef} className={cn("grid grid-cols-7 h-full overflow-hidden")}>
      {dates === undefined || dates.length < 1  
        ? Array(35)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-full p-1">
                <Skeleton className="h-full" />
              </div>
            ))
        : dates.map((calendarDate, index) => (
            <div
              key={index}
              className={cn(
                "h-full p-1",
                !isLastRow(index, dates.length) ? "border-b" : "",
                !isLastColumn(index) ? "border-r" : "",
                "calendar-date-cell",
                "overflow-hidden"
              )}
            >
              <CalendarCell
                date={calendarDate.date}
                now={now}
                // events={calendar.events}
              />
            </div>
          ))}
    </div>
  );
}

function CalendarCellWeekMode() {
  const { dates, now } = useCalendar();

  return (
    <div className={cn("grid grid-cols-7 h-full")}>
      {dates === undefined || dates.length < 1
        ? Array(7)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-full p-1">
                <Skeleton className="h-full" />
              </div>
            ))
        : dates.map((calendarDate, index) => (
            <div
              key={index}
              className={cn(
                "h-full p-1",
                !isLastRow(index, dates.length) ? "border-b" : "",
                !isLastColumn(index) ? "border-r" : "",
                "calendar-date-cell",
                "overflow-hidden"
              )}
            >
              <CalendarCell
                date={calendarDate.date}
                now={now}
                // events={calendar.events}
              />
            </div>
          ))}
    </div>
  );
}
