import {
  CalendarMode,
} from "@jimmodel/shared";
import dayjs from "dayjs";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../../components/ui/select";
import _ from "lodash";
import utc from "dayjs/plugin/utc";
import CalendarComp from "../../components/calendar";
import { useCalendar } from "../../components/calendar/context";



dayjs.extend(utc);


function CalendarPage() {
  const {next, previous, mode, now, today} = useCalendar()

  function getCurrent() {
    if (mode === CalendarMode.Month) {
      return now.format("MMMM YYYY");
    }
    if (mode === CalendarMode.Week) {
      return `${now.startOf("week").format("D MMM")} - ${now
        .endOf("week")
        .format("D MMM")}`;
    }
    if (mode === CalendarMode.Day) {
      return now.format("D MMMM YYYY");
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 py-3 space-x-4 border-b justify-between">
        <div className="flex space-x-4 items-center">
          <p className="text-xl font-medium">{getCurrent()}</p>

          <Button
            className=""
            onClick={() => next()}
            variant={"outline"}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => previous()}
            variant={"outline"}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button variant={"outline"} onClick={() => today()}>
            Today
          </Button>
        </div>

        <div className="">
          <Select defaultValue={mode}>
            <SelectTrigger className="w-40">
              <SelectValue className="" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CalendarMode).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {_.upperFirst(mode)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grow"><CalendarComp/></div>
    </div>
  );
}

export default CalendarPage;
