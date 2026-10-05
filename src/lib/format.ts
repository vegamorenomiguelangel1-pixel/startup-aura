export const TIME_ZONE = "America/La_Paz";
const PAZ_OFFSET = "-04:00";

type PazParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

export function pazParts(date: Date): PazParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute: get("minute"),
  };
}

export function dayKey(date: Date) {
  const parts = pazParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function todayKey(from = new Date()) {
  return dayKey(from);
}

export function addDaysToKey(key: string, days: number) {
  const [year, month, day] = key.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  const nextYear = utc.getUTCFullYear();
  const nextMonth = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(utc.getUTCDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function tomorrowKey(from = new Date()) {
  return addDaysToKey(todayKey(from), 1);
}

export function parsePazDateTime(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59) return null;
  const value = new Date(`${date}T${time}:00${PAZ_OFFSET}`);
  if (Number.isNaN(value.getTime())) return null;
  const parts = pazParts(value);
  if (Number(parts.year) !== year || Number(parts.month) !== month || Number(parts.day) !== day) return null;
  if (Number(parts.hour) !== hour || Number(parts.minute) !== minute) return null;
  return value;
}

export function pazDateTime(offsetDays: number, hour: number, minute = 0, from = new Date()) {
  const key = addDaysToKey(todayKey(from), offsetDays);
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return new Date(`${key}T${hh}:${mm}:00${PAZ_OFFSET}`);
}

export function pazDayBounds(offsetDays = 0, from = new Date()) {
  const start = pazDateTime(offsetDays, 0, 0, from);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export function capitalize(text: string) {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase("es-BO") + text.slice(1);
}

export function formatDateTime(date: Date) {
  return capitalize(
    new Intl.DateTimeFormat("es-BO", {
      timeZone: TIME_ZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date),
  );
}

export function formatDay(date: Date) {
  return capitalize(
    new Intl.DateTimeFormat("es-BO", {
      timeZone: TIME_ZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date),
  );
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function formatPrice(amount: number) {
  return `${new Intl.NumberFormat("es-BO").format(amount)} Bs`;
}

export function formatDuration(hours: number) {
  const text = new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: Number.isInteger(hours) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(hours);
  return `${text} h`;
}
