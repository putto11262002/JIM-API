import { Calendar } from "@jimmodel/shared";
import { Events } from "./events";
import dayjs from "dayjs";
import { cn } from "../../lib/utils";


export default function CalendarCell({
  // events,
  calendarDate,
  now,
}: {
  // events: Calendar["events"];
  now: dayjs.Dayjs;
  calendarDate: Calendar["dates"][0];
}) {
  const date = dayjs(calendarDate.date);
  console.log(calendarDate)
  return (
    <>
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
        <Events calendarDate={calendarDate} />
      </div>
    </>
  );
}
