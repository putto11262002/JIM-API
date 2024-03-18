import { Calendar, CalendarEvent, EventType } from "@jimmodel/shared";

export function Events({
  calendarDate,
  events,
}: {
  calendarDate: Calendar["dates"][0];
  events: Calendar["events"];
}) {
  const targetEvents = calendarDate.events.map((id) => events[id]);

  return (
    <div className="space-y-0.5">
      {targetEvents.map((event) => {
        if (event.type === EventType.Booking) {
          return <BookingEvent key={event.id} event={event} />;
        }

        if (event.type === EventType.Reminder) {
          return <ReminderEvent key={event.id} event={event} />;
        }
      })}
    </div>
  );
}

function ReminderEvent({
  event,
}: {
  event: Extract<CalendarEvent, { type: EventType.Reminder }>;
}) {
  return <Event text={event.details.message} />;
}

function BookingEvent({
  event,
}: {
  event: Extract<CalendarEvent, { type: EventType.Booking }>;
}) {
  const text =
    event.details?.job?.models && event.details.job?.models.length > 0
      ? event.details?.job?.models
          .map((model) => `${model.firstName} ${model.lastName}`)
          .join(", ")
      : event.details?.job?.title;
    

  return <Event text={text} />;
}

function Event({ text }: { text: string }) {
  return (
    <div className="border rounded-md px-1 py-0.5">
      <p className="text-xs text-nowrap truncate ...">{text}</p>
    </div>
  );
}
