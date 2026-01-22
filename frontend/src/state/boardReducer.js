export const initialBoardState = {
  case: {
    id: "case-1",
    title: "The Missing Hour",
  },

  clues: [],
  connections: [],

  ui: {
    selectedClueId: null,
    mode: "idle",

    zoom: 1,
    pan: { x: 0, y: 0 },

    connectionPreview: null,
    hoverTargetClueId: null,

    activeTool: null,

    placement: {
      active: false,
      type: null,
      tempData: null,
    },

    editor: {
      open: false,
      clueId: null,
    },

    contextMenu: {
      open: false,
      x: 0,
      y: 0,
      clueId: null,
    },

    connectionEditor: {
      open: false,
      connectionId: null,
    },
  },

  isSaved: true
};

export const boardReducer = (state, action) => {
  switch (action.type) {
    
    // =======================================================================================
    // CATEGORY 1 — DOMAIN ACTIONS - BACKEND WORTHY DATA
    // =======================================================================================

    case "LOAD_BOARD":
      return {
        ...state,
        case: action.payload.case,
        clues: action.payload.clues,
        connections: action.payload.connections,
      };
      

    case "ADD_CLUE":
      return {
        ...state,
        clues: [...state.clues, action.payload],
        isSaved: false
      };

    case "ADD_CONNECTION":
      return {
        ...state,
        connections: [...state.connections, action.payload],
        isSaved: false
      };

    case "UPDATE_CLUE": {
      const { id, data, noteText } = action.payload;

      return {
        ...state,
        clues: state.clues.map((c) =>
          c.id === id
            ? {
                ...c,
                data: { ...c.data, ...data },
                note: {
                  ...c.note,
                  text: noteText,
                  lastEditedAt: Date.now(),
                },
                updatedAt: Date.now(),
              }
            : c
        ),
        isSaved: false
      };
    }

    case "DELETE_CONNECTION":
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.payload),
        isSaved: false
      };

    case "DELETE_CLUE":
      return {
        ...state,
        clues: state.clues.filter((c) => c.id !== action.payload),
        connections: state.connections.filter((c) => c.from !== action.payload && c.to !== action.payload ),
        isSaved: false
      };

    case "UPDATE_CLUE_SIZE": {
      const { id, width, height } = action.payload;

      return {
        ...state,
        clues: state.clues.map((clue) =>
          clue.id === id
            ? {
                ...clue,
                size: {
                  ...clue.size,
                  width,
                  height,
                  mode: "manual",
                },
                updatedAt: Date.now(),
              }
            : clue
        ),
        isSaved: false
      };
    }

    case "UPDATE_CONNECTION_STYLE": {
      const { id, style } = action.payload;

      return {
        ...state,
        connections: state.connections.map((c) =>
          c.id === id
            ? {
                ...c,
                style: {
                  color: c.style?.color ?? "#6ae3ff",
                  width: c.style?.width ?? 2,
                  ...style,
                },
              }
            : c
        ),
        isSaved: false
      };
    }

    // =======================================================================================
    // CATEGORY 2 — UI VISIBILITY ACTIONS - UI OPEN / CLOSE
    // =======================================================================================

    case "OPEN_CLUE_EDITOR":
      return {
        ...state,
        ui: {
          ...state.ui,
          editor: {
            open: true,
            clueId: action.payload,
          },
        },
      };

    case "CLOSE_CLUE_EDITOR":
      return {
        ...state,
        ui: {
          ...state.ui,
          editor: {
            open: false,
            clueId: null,
          },
        },
      };

    case "OPEN_CONTEXT_MENU":
      return {
        ...state,
        ui: {
          ...state.ui,
          contextMenu: {
            open: true,
            x: action.payload.x,
            y: action.payload.y,
            clueId: action.payload.clueId,
          },
        },
      };

    case "CLOSE_CONTEXT_MENU":
      return {
        ...state,
        ui: {
          ...state.ui,
          contextMenu: {
            open: false,
            x: 0,
            y: 0,
            clueId: null,
          },
        },
      };

    case "OPEN_CONNECTION_EDITOR":
      return {
        ...state,
        ui: {
          ...state.ui,
          connectionEditor: {
            open: true,
            connectionId: action.payload,
          },
        },
      };

    case "CLOSE_CONNECTION_EDITOR":
      return {
        ...state,
        ui: {
          ...state.ui,
          connectionEditor: {
            open: false,
            connectionId: null,
          },
        },
      };

    // =======================================================================================
    // CATEGORY 3 — INTERACTION ACTIONS - MOUSE BEHAVIOUR CONTROL
    // =======================================================================================

    case "SET_MODE":
      return {
        ...state,
        ui: {
          ...state.ui,
          mode: action.payload,
        },
      };

    // CONNECTION MODE

    case "START_CONNECTION":
      return {
        ...state, 
        ui: {
          ...state.ui,
          mode: "connecting",
          connectionPreview: {
            from: action.payload.from,
            mouseX: action.payload.x,
            mouseY: action.payload.y,
          },
        },
      };

    case "UPDATE_CONNECTION_PREVIEW":
      return {
        ...state,
        ui: {
          ...state.ui,
          connectionPreview: {
            ...state.ui.connectionPreview,
            mouseX: action.payload.x,
            mouseY: action.payload.y,
          },
        },
      };

    case "CANCEL_CONNECTION":
      return {
        ...state,
        ui: {
          ...state.ui,
          mode: "idle",
          connectionPreview: null,
          hoverTargetClueId: null,
        },
      };

    case "SET_HOVER_TARGET":
      return {
        ...state,
        ui: {
          ...state.ui,
          hoverTargetClueId: action.payload,
        },
      };

    // =======================================================================================
    // CATEGORY 4 — VIEWPORT ACTIONS - CAMERA CONTROL
    // =======================================================================================

    case "SET_PAN":
      return {
        ...state,
        ui: {
          ...state.ui,
          pan: action.payload,
        },
      };

    case "SET_ZOOM":
      return {
        ...state,
        ui: {
          ...state.ui,
          zoom: action.payload,
        },
      };

    // =======================================================================================
    // CATEGORY 5 - OTHERS - UNCATEGORIZED YET
    // =======================================================================================

    case "SELECT_CLUE":
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedClueId: action.payload,
        },
      };

    // CLUE MOVE
    case "MOVE_CLUE": {
      const { id, x, y } = action.payload;

      return {
        ...state,
        clues: state.clues.map((clue) =>
          clue.id === id
            ? {
                ...clue,
                position: { x, y },
                updatedAt: Date.now(),
              }
            : clue
        ),
        isSaved: false
      };
      
    }

    // TOOL SYSTEM
    case "SET_ACTIVE_TOOL":
      return {
        ...state,
        ui: {
          ...state.ui,
          activeTool:
            state.ui.activeTool === action.payload ? null : action.payload,
        },
      };

    // PLACEMENT SYSTEM
    case "START_PLACEMENT":
      return {
        ...state,
        ui: {
          ...state.ui,
          placement: {
            active: true,
            type: action.payload,
            tempData: null,
          },
          activeTool: null,
        },
      };

    case "CANCEL_PLACEMENT":
      return {
        ...state,
        ui: {
          ...state.ui,
          placement: {
            active: false,
            type: null,
            tempData: null,
          },
        },
      };

    case "BOARD_SAVED":
      return {
        ...state,
        isSaved: true
      };

    default:
      return state;
  }
};
