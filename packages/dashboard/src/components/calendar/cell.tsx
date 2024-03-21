import { Events } from "./events";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "../../lib/utils";
import { useCellDialog } from "./cell-dialog";
// import { useCalendar } from "./context";


export default function CalendarCell({
  // events,
  date:  _date,
  now,
}: {
  // events: Calendar["events"];
  now: dayjs.Dayjs;
  date: string | Date | Dayjs;
}) {
  const { setOpen } = useCellDialog()
  // const {dates} = useCalendar()
  const date = dayjs(_date);

  return (
    <div className="h-full" onClick={() => setOpen(date)}>
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
        <Events date={date} />
      </div>
    </div>
  );
}
