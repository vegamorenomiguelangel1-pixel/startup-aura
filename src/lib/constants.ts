export const DEFAULT_PRICE_BS = 250;
export const DEFAULT_DURATION_HOURS = 4.5;

export const ZONES = [
  "Equipetrol",
  "Urubó",
  "Las Palmas",
  "Centro",
  "Norte",
  "Plan 3000",
  "Otro",
] as const;

export type Zone = (typeof ZONES)[number];

export function isZone(value: string): value is Zone {
  return (ZONES as readonly string[]).includes(value);
}
