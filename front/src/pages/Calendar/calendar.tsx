import { useState, useRef, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import EventForm from "./CalendarEvent";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const calendarLevels = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
    calendar: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
    ]);
  }, []);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedEvent(null);
    setFormData({
      id: "",
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr || selectInfo.startStr,
      calendar: "",
    });
    openModal();
  }, [openModal]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = clickInfo.event as unknown as CalendarEvent;
    setSelectedEvent(event);
    setFormData({
      id: event.id as string,
      title: event.title || "",
      start: event.start?.toString().split("T")[0] || "",
      end: event.end?.toString().split("T")[0] || "",
      calendar: event.extendedProps.calendar,
    });
    openModal();
  }, [openModal]);

  const handleSubmit = () => {
    if (selectedEvent) {
      setEvents(prev =>
        prev.map(ev =>
          ev.id === formData.id
            ? {
                ...ev,
                title: formData.title,
                start: formData.start,
                end: formData.end,
                extendedProps: { calendar: formData.calendar },
              }
            : ev
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.title,
        start: formData.start,
        end: formData.end,
        allDay: true,
        extendedProps: { calendar: formData.calendar },
      };
      setEvents(prev => [...prev, newEvent]);
    }

    closeModal();
    resetForm();
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setFormData({ id: "", title: "", start: "", end: "", calendar: "" });
  };

  const renderEventContent = (eventInfo: any) => {
    const type = eventInfo.event.extendedProps.calendar.toLowerCase();
    return (
      <div className={`px-2 py-1 text-xs rounded bg-${type}-100 text-${type}-800`}>
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Calendar | Admin Dashboard"
        description="Calendar scheduling and management UI"
      />

      <div className="rounded-2xl border bg-white p-6 dark:bg-white/[0.03]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: () => {
                resetForm();
                openModal();
              },
            },
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <EventForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          calendarLevels={calendarLevels}
          isEdit={!!selectedEvent}
        />
      </Modal>
    </>
  );
};

export default Calendar;
