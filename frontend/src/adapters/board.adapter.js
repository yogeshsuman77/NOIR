import { adaptBackendCase } from "./case.adapter";
import { adaptBackendClue } from "./clue.adapter";
import { adaptBackendConnection } from "./connection.adapter";

export const adaptBackendBoard = (backendBoard) => {
  return {
    case: adaptBackendCase(backendBoard.case),
    clues: backendBoard.clues.map(adaptBackendClue),
    connections: backendBoard.connections.map(adaptBackendConnection),
  };
};
