import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "@jimmodel/shared";
import dayjs from "dayjs";
import { Button } from "../../ui/button";
import DataTable from "../data-table";
import { ArrowRight } from "lucide-react";
const getColumns = ({
  onRemove,
}: {
  onRemove: (bookingId: string) => void;
}): ColumnDef<Booking>[] => {
  return [
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        return (
          <p className="flex items-center">
            <span className="font-medium">
              {" "}
              {dayjs(row.original.start).format("D MMM YYYY HH:mm A")}
            </span>{" "}
            <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground"/>
            <span className="font-medium">
              {dayjs(row.original.start).format("D MMM YYYY HH:mm A")}
            </span>
          </p>
        );
      },
    },
    {
      id: "type",
      header: "Type",
      cell: ({ row }) => {
        return (
          <div className="flex">
            <div className="border border-slate-300 border-1 py-0.5 px-1.5 text-xs font-medium rounded-md ">
              {row.original.type}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => onRemove(row.original.id)}
            variant={"outline"}
            size={"sm"}
          >
            Remove
          </Button>
        );
      },
    },
  ];
};

function BookingDataTable({
  bookings,
  onRemoveBooking,
}: {
  bookings: Booking[];
  onRemoveBooking: (bookingId: string) => void;
}) {
  return (
    <DataTable
      columns={getColumns({ onRemove: onRemoveBooking })}
      data={bookings}
    />
  );
}


export default BookingDataTable;