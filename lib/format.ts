const TIME_ZONE = "America/La_Paz";

export function boliviaDate(daysFromNow: number, hour: number, minute = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return new Date(Date.UTC(year, month - 1, day + daysFromNow, hour + 4, minute, 0));
}

export function parseBoliviaDatetimeLocal(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00-04:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function toDatetimeLocalValue(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const hour = pick("hour").padStart(2, "0");
  const minute = pick("minute").padStart(2, "0");
  return `${pick("year")}-${pick("month")}-${pick("day")}T${hour}:${minute}`;
}

export function formatSchedule(date: Date) {
  const datePart = new Intl.DateTimeFormat("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
  const timePart = new Intl.DateTimeFormat("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).format(date);
  const prettyDate = datePart.charAt(0).toLocaleUpperCase("es-BO") + datePart.slice(1);
  return {
    date: prettyDate,
    time: timePart,
    label: `${prettyDate} · ${timePart}`,
  };
}

export function formatPrice(priceBs: number) {
  return `${priceBs} Bs`;
}

export function formatNames(names: string[]) {
  if (names.length === 0) return "Sin asignar";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

export function greeting(name: string) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: TIME_ZONE,
    }).format(new Date()),
  );
  const hello = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const first = name.trim().split(/\s+/)[0] ?? name;
  return `${hello}, ${first}`;
}

export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+")) return `tel:+${digits}`;
  return `tel:+591${digits}`;
}

export function mapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Santa Cruz, Bolivia`)}`;
}
