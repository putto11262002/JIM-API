import { Calendar, CalendarGetQuery } from "@jimmodel/shared";
import axiosClient from "../lib/axios";

async function getCalendar({ query}: {query: CalendarGetQuery}){
    const res = await axiosClient.get("/bookings/calendar", {params: query})
    return res.data as Calendar
}

const calendarService =  {
    getCalendar
}

export default calendarService;