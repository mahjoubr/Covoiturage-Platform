interface Props {
    formData: {
      id: string;
      title: string;
      start: string;
      end: string;
      calendar: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: () => void;
    onCancel: () => void;
    calendarLevels: Record<string, string>;
    isEdit: boolean;
  }
  
  const EventForm: React.FC<Props> = ({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    calendarLevels,
    isEdit,
  }) => (
    <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
      <h5 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        {isEdit ? "Edit Event" : "Add Event"}
      </h5>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {isEdit ? "Update your event details." : "Create a new calendar event."}
      </p>
  
      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Event Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Event Level
          </label>
          <div className="flex flex-wrap gap-4">
            {Object.entries(calendarLevels).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="calendar"
                  checked={formData.calendar === key}
                  onChange={() => setFormData({ ...formData, calendar: key })}
                />
                <span className={`text-${value}-600`}>{key}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Start Date
          </label>
          <input
            type="date"
            value={formData.start}
            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
            className="input"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            End Date
          </label>
          <input
            type="date"
            value={formData.end}
            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            className="input"
          />
        </div>
  
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onCancel} className="btn-outline">
            Cancel
          </button>
          <button onClick={onSubmit} className="btn-primary">
            {isEdit ? "Update Event" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
  
  export default EventForm;
  