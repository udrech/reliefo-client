export interface DateParts {
  day: number;
  month: number;
  year: number;
}

export interface TimeParts {
  hour: number;
  minute: number;
}

export function toDateParts(date: Date): DateParts {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export function toTimeParts(date: Date): TimeParts {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

export function combineDateAndTime(date: any, time: any): Date {
  return new Date(date.year, date.month - 1, date.day, time.hour, time.minute);
}
