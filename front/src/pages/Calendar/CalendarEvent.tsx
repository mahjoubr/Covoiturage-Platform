import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Calendar as CalendarIcon, MapPin, AlignLeft, Trash2 } from "lucide-react";
import { CalendarEvent } from "../../types/calendarEvent";

interface EventFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedEvent: CalendarEvent | null;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventDescription: string;
  setEventDescription: (description: string) => void;
  eventLocation: string;
  setEventLocation: (location: string) => void;
  eventStartDate: string;
  setEventStartDate: (date: string) => void;
  eventEndDate: string;
  setEventEndDate: (date: string) => void;
  eventLevel: string;
  setEventLevel: (level: string) => void;
  handleAddOrUpdateEvent: () => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  calendarsEvents: string[];
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  closeModal,
  selectedEvent,
  eventTitle,
  setEventTitle,
  eventDescription,
  setEventDescription,
  eventLocation,
  setEventLocation,
  eventStartDate,
  setEventStartDate,
  eventEndDate,
  setEventEndDate,
  eventLevel,
  setEventLevel,
  handleAddOrUpdateEvent,
  setIsDeleteModalOpen,
  calendarsEvents,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {selectedEvent ? "Edit Event" : "Add New Event"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
                    onClick={closeModal}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4 space-y-4">
                  {/* Event Title */}
                  <div>
                    <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="eventTitle"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Enter event title"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Event Description */}
                  <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <AlignLeft className="mr-1 h-4 w-4" />
                        Description
                      </div>
                    </label>
                    <textarea
                      id="eventDescription"
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Add event description (optional)"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                  
                  {/* Event Location */}
                  <div>
                    <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        Location
                      </div>
                    </label>
                    <input
                      type="text"
                      id="eventLocation"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Add location (optional)"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                    />
                  </div>
                  
                  {/* Event Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eventStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          Start Date
                        </div>
                      </label>
                      <input
                        type="date"
                        id="eventStartDate"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        value={eventStartDate}
                        onChange={(e) => setEventStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="eventEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          End Date
                        </div>
                      </label>
                      <input
                        type="date"
                        id="eventEndDate"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        value={eventEndDate}
                        onChange={(e) => setEventEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Event Category */}
                  <div>
                    <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Event Category
                    </label>
                    <select
                      id="eventCategory"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      value={eventLevel}
                      onChange={(e) => setEventLevel(e.target.value)}
                    >
                      {calendarsEvents.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between">
                    {selectedEvent && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    )}
                    <div className={`flex gap-2 ${selectedEvent ? '' : 'ml-auto'}`}>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                        onClick={handleAddOrUpdateEvent}
                        disabled={!eventTitle || !eventStartDate}
                      >
                        {selectedEvent ? "Update" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EventFormModal;