import { useEffect, useRef, useState } from "react";
import "./Board.css";
import Clue from "../Clue/Clue";
import Connection from "../Connection/Connection";
import { createClue } from "../../models/clue.model";
import { getClueCenter, isPointNearClue, screenToWorld } from "../../utils/geometry";
import GhostClue from "../GhostClue/GhostClue";

const Board = ({ state, dispatch }) => {

  const [ghostPos, setGhostPos] = useState(null);
  
  // ===============================
  // PAN STATE (VIEW DRAG)
  // ===============================
  const panStartMouse = useRef({ x: 0, y: 0 });
  const panStartOffset = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);

  // ===============================
  // INITIAL DATA
  // ===============================
  // useEffect(() => {
  //   const textClue = createClue({
  //     id: "clue-1",
  //     type: "text",
  //     data: { text: "Victim last seen at 9:30 PM" },
  //     x: 120,
  //     y: 140,
  //   });

  //   const textClue2 = createClue({
  //     id: "clue-3",
  //     type: "text",
  //     data: { text: "Victim again seen at 9:30 PM" },
  //     x: 100,
  //     y: 450,
  //   });

  //   const imageClue = createClue({
  //     id: "clue-2",
  //     type: "image",
  //     data: {
  //       src: "https://media.istockphoto.com/id/503523168/video/cctv-roads-splitscreen.jpg?s=640x640&k=20&c=qpPWlFp3_IMrSOJKenQjaXtz1f-hFAPnCMqFAiqECso=",
  //       caption: "CCTV frame near the parking lot",
  //     },
  //     noteText: "Person appears injured in left hand",
  //     x: 420,
  //     y: 220,
  //   });

  //   dispatch({ type: "ADD_CLUE", payload: textClue });
  //   dispatch({ type: "ADD_CLUE", payload: textClue2 });
  //   dispatch({ type: "ADD_CLUE", payload: imageClue });
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch({
  //     type: "ADD_CONNECTION",
  //     payload: createConnection({
  //       id: "conn-1",
  //       from: "clue-1",
  //       to: "clue-2",
  //     }),
  //   });
  // }, [dispatch]);


  // ===============================
  // CONNECTION PREVIEW MOVE
  // ===============================
  const handlePointerMove = (e) => {
    // PLACEMENT MODE = ghost follow
    if (state.ui.placement.active) {
      const worldPos = screenToWorld(
        e.clientX,
        e.clientY,
        state.ui.pan,
        state.ui.zoom
      );
      setGhostPos(worldPos);
      return;
    }

    // CONNECTION PREVIEW
    if (state.ui.mode !== "connecting") return;

    const worldPos = screenToWorld(
      e.clientX,
      e.clientY,
      state.ui.pan,
      state.ui.zoom
    );

    let hoverId = null;

    for (const clue of state.clues) {
      if (clue.id === state.ui.connectionPreview.from) continue;
      if (isPointNearClue(worldPos, clue)) {
        hoverId = clue.id;
        break;
      }
    }

    dispatch({ type: "SET_HOVER_TARGET", payload: hoverId });
    
    dispatch({
      type: "UPDATE_CONNECTION_PREVIEW",
      payload: worldPos,
    });
  };


  // ===============================
  // FINALIZE CONNECTION
  // ===============================
  const handlePointerUp = () => {
    if (state.ui.mode !== "connecting") return;

    const from = state.ui.connectionPreview?.from;
    const to = state.ui.hoverTargetClueId;

    if (from && to) {
      dispatch({
        type: "ADD_CONNECTION",
        payload: {
          id: `conn-${Date.now()}`,
          from,
          to,
        },
      });
    }

    dispatch({ type: "CANCEL_CONNECTION" });
    dispatch({ type: "SET_HOVER_TARGET", payload: null });
  };

  // ===============================
  // PAN VIA EMPTY DRAG
  // ===============================
  const handleBoardPointerDown = (e) => {
    // PLACEMENT MODE
    if (state.ui.placement.active) {

      if (e.target.closest(".clue-group")) return;

      const worldPos = screenToWorld(
        e.clientX,
        e.clientY,
        state.ui.pan,
        state.ui.zoom
      );

      const newClue = createClue({
        id: `clue-${Date.now()}`,
        type: state.ui.placement.type,
        data:
          state.ui.placement.type === "text"
            ? { text: "" }
            : {},
        x: worldPos.x,
        y: worldPos.y,
      });

      dispatch({ type: "ADD_CLUE", payload: newClue });
      dispatch({ type: "SELECT_CLUE", payload: newClue.id });

      dispatch({
        type: "OPEN_CLUE_EDITOR",
        payload: newClue.id,
      });

      dispatch({ type: "CANCEL_PLACEMENT" });

      setGhostPos(null);
      return;
    }

    if (e.target.closest(".clue-group")) return;

    // NORMAL PAN
    isPanning.current = true;

    panStartMouse.current = { x: e.clientX, y: e.clientY };
    panStartOffset.current = {
      x: state.ui.pan.x,
      y: state.ui.pan.y,
    };

    document.body.classList.add("no-select");
  };

  const handleBoardPointerMove = (e) => {
    if (!isPanning.current) return;

    const dx = e.clientX - panStartMouse.current.x;
    const dy = e.clientY - panStartMouse.current.y;

    dispatch({
      type: "SET_PAN",
      payload: {
        x: panStartOffset.current.x + dx,
        y: panStartOffset.current.y + dy,
      },
    });
  };

  const handleBoardPointerRelease = () => {
    if (!isPanning.current) return;
    isPanning.current = false;
    document.body.classList.remove("no-select");
  };

  // ===============================
  // WHEEL BEHAVIOUR
  // ===============================
  const handleWheel = (e) => {
    // e.preventDefault();

    // CTRL + WHEEL = ZOOM
    if (e.ctrlKey) {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(2.5, Math.max(0.4, state.ui.zoom * zoomFactor));

      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX =
        (mouseX - state.ui.pan.x) / state.ui.zoom;
      const worldY =
        (mouseY - state.ui.pan.y) / state.ui.zoom;

      dispatch({
        type: "SET_PAN",
        payload: {
          x: mouseX - worldX * newZoom,
          y: mouseY - worldY * newZoom,
        },
      });

      dispatch({ type: "SET_ZOOM", payload: newZoom });
      return;
    }

    // SHIFT + WHEEL = HORIZONTAL PAN
    if (e.shiftKey) {
      dispatch({
        type: "SET_PAN",
        payload: {
          x: state.ui.pan.x - e.deltaY,
          y: state.ui.pan.y,
        },
      });
      return;
    }

    // NORMAL WHEEL = VERTICAL PAN
    dispatch({
      type: "SET_PAN",
      payload: {
        x: state.ui.pan.x,
        y: state.ui.pan.y - e.deltaY,
      },
    });
  };



  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && state.ui.placement.active) {
        dispatch({ type: "CANCEL_PLACEMENT" });
        setGhostPos(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.ui.placement.active]);

  return (
    <svg
      className="board"
      onClick={() => dispatch({ type: "SELECT_CLUE", payload: null })}
      onPointerDown={handleBoardPointerDown}
      onPointerMove={(e) => {
        handleBoardPointerMove(e);
        handlePointerMove(e);
      }}
      onPointerUp={() => {
        handleBoardPointerRelease();
        handlePointerUp();
      }}
      onPointerLeave={handleBoardPointerRelease}
      onWheel={handleWheel}
    >

      <g
        className="canvas"
        transform={`translate(${state.ui.pan.x}, ${state.ui.pan.y}) scale(${state.ui.zoom})`}
      >

        {/* GHOST CLUE */}
        {state.ui.placement.active && ghostPos && (
          <GhostClue
            x={ghostPos.x}
            y={ghostPos.y}
            type={state.ui.placement.type}
            tempData={state.ui.placement.tempData}
          />
        )}


        {/* CONNECTION PREVIEW */}
        {state.ui.connectionPreview && (() => {
          const fromClue = state.clues.find(
            (c) => c.id === state.ui.connectionPreview.from
          );
          if (!fromClue) return null;

          const start = getClueCenter(fromClue);
          let end = {
            x: state.ui.connectionPreview.mouseX,
            y: state.ui.connectionPreview.mouseY,
          };

          if (state.ui.hoverTargetClueId) {
            const target = state.clues.find(
              (c) => c.id === state.ui.hoverTargetClueId
            );
            if (target) end = getClueCenter(target);
          }

          return (
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="connection-preview"
            />
          );
        })()}

        {/* CONNECTIONS */}
        {state.connections.map((conn) => (
          <Connection
            key={conn.id}
            connection={conn}
            clues={state.clues}
            dispatch={dispatch}
          />
        ))}

        {/* CLUES */}
        {state.clues.map((clue) => (
          <Clue
            key={clue.id}
            clue={clue}
            dispatch={dispatch}
            isSelected={state.ui.selectedClueId === clue.id}
            isHoverTarget={state.ui.hoverTargetClueId === clue.id}
            pan={state.ui.pan}
            zoom={state.ui.zoom}
          />
        ))}

      </g>

    </svg>
  );
};

export default Board;