interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <label className="text-sm font-medium text-ink-900">Select a date</label>
      <input
        type="date"
        min={today}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block rounded-md border border-ink-900/15 px-4 py-2.5 text-ink-900 outline-none focus:border-pitch-500"
      />
    </div>
  );
}