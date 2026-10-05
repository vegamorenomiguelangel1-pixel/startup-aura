import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAdminCancel,
  canAssignDuo,
  canClientCancel,
  canEmployeeTransition,
  canUnassignDuo,
  statusChangeMessage,
} from "./status";

describe("transiciones de estado", () => {
  it("el equipo avanza asignado → en camino → en progreso → completado", () => {
    assert.equal(canEmployeeTransition("ASIGNADO", "EN_CAMINO"), true);
    assert.equal(canEmployeeTransition("EN_CAMINO", "EN_PROGRESO"), true);
    assert.equal(canEmployeeTransition("EN_PROGRESO", "COMPLETADO"), true);
  });

  it("el equipo puede cancelar mientras el servicio sigue abierto", () => {
    assert.equal(canEmployeeTransition("ASIGNADO", "CANCELADO"), true);
    assert.equal(canEmployeeTransition("EN_CAMINO", "CANCELADO"), true);
    assert.equal(canEmployeeTransition("EN_PROGRESO", "CANCELADO"), true);
    assert.equal(canEmployeeTransition("COMPLETADO", "CANCELADO"), false);
  });

  it("no permite saltos ni retrocesos", () => {
    assert.equal(canEmployeeTransition("SOLICITADO", "EN_CAMINO"), false);
    assert.equal(canEmployeeTransition("ASIGNADO", "COMPLETADO"), false);
    assert.equal(canEmployeeTransition("EN_PROGRESO", "EN_CAMINO"), false);
    assert.equal(canEmployeeTransition("COMPLETADO", "ASIGNADO"), false);
  });

  it("el cliente solo cancela una solicitud todavía sin dúo", () => {
    assert.equal(canClientCancel("SOLICITADO"), true);
    assert.equal(canClientCancel("ASIGNADO"), false);
  });

  it("administración asigna hasta que el servicio termina y retira el dúo solo si sigue asignado", () => {
    assert.equal(canAssignDuo("SOLICITADO"), true);
    assert.equal(canAssignDuo("EN_PROGRESO"), true);
    assert.equal(canAssignDuo("COMPLETADO"), false);
    assert.equal(canUnassignDuo("ASIGNADO"), true);
    assert.equal(canUnassignDuo("EN_CAMINO"), false);
    assert.equal(canAdminCancel("EN_CAMINO"), true);
    assert.equal(canAdminCancel("COMPLETADO"), false);
  });

  it("describe la cancelación con motivo", () => {
    assert.equal(
      statusChangeMessage("CANCELADO", "El cliente no estará en casa"),
      "Servicio cancelado. Motivo: El cliente no estará en casa",
    );
    assert.equal(statusChangeMessage("EN_CAMINO"), "Estado actualizado a En camino.");
  });
});
