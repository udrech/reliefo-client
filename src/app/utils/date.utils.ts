export interface DateParts {
  day: string;
  month: string;
  year: string;
}

export interface TimeParts {
  hour: string;
  minute: string;
}

export function toDateParts(date: Date): DateParts {
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
  };
}

export function toTimeParts(date: Date): TimeParts {
  return {
    hour: String(date.getHours()).padStart(2, '0'),
    minute: String(date.getMinutes()).padStart(2, '0'),
  };
}

export function combineDateAndTime(date: DateParts, time: TimeParts): Date {
  return new Date(Number(date.year), Number(date.month) - 1, Number(date.day), Number(time.hour), Number(time.minute));
}

export function combineDateParts(date: DateParts): Date {
  return new Date(Number(date.year), Number(date.month) - 1, Number(date.day));
}

export function toLocalDateString(date: Date): string {
  const { day, month, year } = toDateParts(date);
  return `${year}-${month}-${day}`;
}
