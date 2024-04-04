import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { EventType } from "@jimmodel/shared";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode, createContext, useContext, useState } from "react";
import { upperFirst } from "lodash";
import { getEventColor } from "@/components/calendar/utils";
import { JobDropdownMenu } from "../job/job-dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import BlockDropdownMenu from "../block/block-dorpdown-menu";
import { useCalendar } from "./context";

type DialogContext = {
  setOpen: (date: Dayjs) => void;
  setClose: () => void;
  date: Dayjs | null;
  isOpen: boolean;
};
const cellDialogContext = createContext<DialogContext>({
  setOpen: () => {},
  setClose: () => {},
  date: null,
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
  const [date, setDate] = useState<Dayjs | null>(null);

  function setOpen(date: Dayjs) {
    setDate(date);
  }

  function setClose() {
    setDate(null);
  }

  const context = {
    setOpen,
    setClose,
    date,
    isOpen: date !== null,
  };

  return (
    <cellDialogContext.Provider value={context}>
      <CellDialog />

      {children}
    </cellDialogContext.Provider>
  );
};

export default function CellDialog() {
  const { date, isOpen, setClose } = useCellDialog();
  const { dates } = useCalendar();
  const events = dates.find((d) => dayjs(d.date).isSame(date, "day"))?.events;

  function renderEvents() {
    return (
      <div className="space-y-2">
        {events === undefined || events.length < 1 ? (
          <p>No Events</p>
        ) : (
          events.map((event) => {
            if (event.type === EventType.Booking) {

            const models = event.details.job.models
                .map((model) => `${model.name}`)
                .join(", ")
              const dataText = `${
                event.details.job.title
              } ${models.length > 0 ? "-" : ""} ${models}`;
              const metaDataText = `Booked By ${event.details.job.createdBy.firstName} ${event.details.job.createdBy.lastName}`;
              const color = getEventColor(event);
              return (
                <Event
                  key={event.id}
                  optionBtn={
                    <JobDropdownMenu job={event.details.job}>
                      <Button variant="ghost" className="ml-auto" size={"sm"}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </JobDropdownMenu>
                  }
                  metaDataText={metaDataText}
                  color={color}
                  dataText={dataText}
                />
              );
            }

            if (event.type === EventType.Block) {
              const models = event.details.models
                .map((model) => model.name)
                .join(", ")
              const dataText = `${upperFirst(
                event.details.type.replace("-", " ")
              )} ${models.length > 0 ? "-" : ""} ${models}`;
              const metaDataText = `Booked at ${dayjs(event.details.createdAt).format("h:mm A")}`;
              const color = getEventColor(event);
              return (
                <Event
                  
                  key={event.id}
                  optionBtn={
                    <BlockDropdownMenu block={event.details}>
                      <Button variant="ghost" className="ml-auto" size={"sm"}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </BlockDropdownMenu>
                  }
                  color={color}
                  metaDataText={metaDataText}
                  dataText={dataText}
                />
              );
            }
          })
        )}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="max-h-[500px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>
            Events on {date && date.format("dddd, MMMM D, YYYY")}
          </DialogTitle>
        </DialogHeader>
        {renderEvents()}
      </DialogContent>
    </Dialog>
  );
}

function Event({
  dataText,
  color,
  optionBtn,
  metaDataText,
}: {
  metaDataText: string;
  dataText: string;
  color: string;
  optionBtn: ReactNode;
}) {
  return (
    <div className="py-3 px-4 rounded-md border flex items-center">
      <div className="grow">
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: color }}
          ></div>
          <p className="text-xs text-slate-600 ">{metaDataText}</p>
        </div>
        {/* <div className="flex items-center"> */}
        {/*   <p className="text-sm font-medium">{metaDataText}</p> */}
        {/* </div> */}
        <p className="font-semibold mt-1">{dataText}</p>
      </div>
      <div className="">{optionBtn}</div>
    </div>
  );
}
