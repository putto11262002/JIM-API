import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Calendar,
  EventType,
} from "@jimmodel/shared";
import dayjs from "dayjs";
import { createContext, useContext, useState } from "react";
import  { upperFirst } from "lodash";
import { getEventColor } from "@/pages/calendar/utils";

type DialogContext = {
  setOpen: (calendarDate: Calendar["dates"][0]) => void;
  setClose: () => void;
  calendarDate: Calendar["dates"][0] | null;
  isOpen: boolean;
};
const cellDialogContext = createContext<DialogContext>({
  setOpen: () => { },
  setClose: () => { },
  calendarDate: null,
  isOpen: false,
});

export const useCellDialog = () => {
  return useContext(cellDialogContext);
};

export const CellDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [calendarDate, setCalendarDate] = useState<Calendar["dates"][0] | null>(
    null
  );

  function setOpen(calendarDate: Calendar["dates"][0]) {
    setCalendarDate(calendarDate);
  }

  function setClose() {
    setCalendarDate(null);
  }

  const context = {
    setOpen,
    setClose,
    calendarDate,
    isOpen: calendarDate !== null,
  };

  return (
    <cellDialogContext.Provider value={context}>
      <CellDialog />

      {children}
    </cellDialogContext.Provider>
  );
};

export default function CellDialog() {
  const { calendarDate, isOpen, setClose } = useCellDialog();
  const date = dayjs(calendarDate?.date);

  function renderEvents() {

    return <div className="space-y-2">
      {
        (calendarDate?.events === undefined || calendarDate.events.length < 1) ?
          <p>No Events</p> :
          (
            calendarDate.events.map(event => {
              if (event.type === EventType.Booking) {
                const dataText = `${event.details.job.title} - ${event.details.job.models.map(model => `${model.name}`).join(", ")}`
                const metaDataText = `${event.details.job.createdBy.firstName} ${event.details.job.createdBy.lastName}`
                const color = getEventColor(event)
                return <Event metaDataText={metaDataText} color={color} dataText={dataText} />
              }

              if (event.type === EventType.Block) {
                const dataText = `${upperFirst(event.details.type.replace("-", " "))} - ${event.details.models.map(model => model.name).join(", ")}`
                const metaDataText = `meta data`
                const color = getEventColor(event)
                return <Event color={color} metaDataText={metaDataText} dataText={dataText} />
              }
            })
          )
      }
    </div>
  }


  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="max-h-[500px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>
            Events on {date.format("dddd, MMMM D, YYYY")}
          </DialogTitle>
        </DialogHeader>
        {calendarDate === null ? <div>No Event</div> : renderEvents()}
      </DialogContent>
    </Dialog>
  );
}





function Event({  dataText, color }: { metaDataText: string, dataText: string, color: string }) {
  return <div className="py-3 px-4 rounded-md border">
    <div className="flex items-center">
      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
      <p className="text-xs text-slate-600 ">{dayjs(new Date).format("H:mm A")} to {dayjs(new Date()).format("H:mm A")}</p>
    </div>
    {/* <div className="flex items-center"> */}
    {/*   <p className="text-sm font-medium">{metaDataText}</p> */}
    {/* </div> */}
    <p className="font-semibold mt-1">{dataText}</p>
  </div>
}
