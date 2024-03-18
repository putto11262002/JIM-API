import { useQuery } from "@tanstack/react-query";
import calendarService from "../../services/calendar";
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
import { useState } from "react";



dayjs.extend(utc);


function CalendarPage() {
  const [mode, setMode] = useState(CalendarMode.Month);

  const [now, setNow] = useState(dayjs.utc().startOf(mode));


  const { data } = useQuery({
    queryKey: ["calendar", { date: now.toISOString(), mode }],
    queryFn: () =>
      calendarService.getCalendar({
        query: { mode: mode, date: now.toDate() },
      }),
  });


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
            onClick={() => setNow((now) => now.add(1, mode))}
            variant={"outline"}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setNow((now) => now.subtract(1, mode))}
            variant={"outline"}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button variant={"outline"} onClick={() => setNow(dayjs())}>
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

      <div className="grow"><CalendarComp calendar={data}/></div>
    </div>
  );
}

export default CalendarPage;
