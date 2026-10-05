import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDaysToKey, dayKey, parsePazDateTime, pazDateTime } from "./format";

describe("horario de Santa Cruz", () => {
  it("usa el día civil de Bolivia (UTC-4), no el día UTC", () => {
    const lateUtc = new Date("2026-10-05T02:30:00.000Z");
    assert.equal(dayKey(lateUtc), "2026-10-04");
    const midnightPaz = new Date("2026-10-05T04:00:00.000Z");
    assert.equal(dayKey(midnightPaz), "2026-10-05");
  });

  it("suma días sobre la fecha civil", () => {
    assert.equal(addDaysToKey("2026-10-31", 1), "2026-11-01");
  });

  it("interpreta fecha y hora como America/La_Paz", () => {
    const value = parsePazDateTime("2026-10-05", "08:30");
    assert.ok(value);
    assert.equal(value.toISOString(), "2026-10-05T12:30:00.000Z");
  });

  it("rechaza fechas imposibles", () => {
    assert.equal(parsePazDateTime("2026-02-31", "08:00"), null);
    assert.equal(parsePazDateTime("05-10-2026", "08:00"), null);
  });

  it("arma una cita relativa al día en La Paz", () => {
    const from = new Date("2026-10-05T15:00:00.000Z");
    const tomorrowMorning = pazDateTime(1, 9, 0, from);
    assert.equal(tomorrowMorning.toISOString(), "2026-10-06T13:00:00.000Z");
  });
});
