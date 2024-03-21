import { Calendar, CalendarMode } from "@jimmodel/shared";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ReactNode, createContext, useContext, useState } from "react";
import calendarService from "../../services/calendar";
import { padDates } from "../../pages/calendar/utils";

type CalendarContext = {
    dates: Calendar['dates'] | []
    next: () => void
    previous: () => void
    mode: CalendarMode
    now: dayjs.Dayjs
    today: () => void

}
const calendarContext = createContext<CalendarContext>({dates: [], next: () => {}, previous: () => {}, now: dayjs(), mode: CalendarMode.Month, today: () => {}})

export function useCalendar(){
    return useContext(calendarContext)
}

export function CalendarContextProvider({children}: {children: ReactNode}){


    const [mode, setMode] = useState(CalendarMode.Month);
    const [now, setNow] = useState(dayjs.utc().startOf(mode));

    const { data } = useQuery({
        queryKey: ["calendar", { date: now.toISOString(), mode }],
        queryFn: () =>
          calendarService.getCalendar({
            query: { mode: mode, date: now.toDate() },
          }),
      });

      function next(){
        setNow((now) => now.add(1, mode))
      }

      function previous(){
        setNow((now) => now.subtract(1, mode))
      }
      
      function today(){
        setNow(dayjs.utc().startOf(mode))
      }


      const dates = padDates(data?.dates || [])

      const context: CalendarContext = {
        dates,
        next,
        previous,
        now,
        mode,
        today
      }

    return <calendarContext.Provider value={context}>
        {children}
    </calendarContext.Provider>
}