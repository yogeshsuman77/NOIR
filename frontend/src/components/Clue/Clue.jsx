import { useRef } from "react";
import "./Clue.css";
import { screenToWorld } from "../../utils/geometry";

const DRAG_THRESHOLD = 5;

const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;


const Clue = ({
  clue,
  dispatch,
  isSelected,
  isHoverTarget,
  pan,
  zoom,
}) => {

  const resizeRef = useRef({
    active: false,
    startMouse: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
  });


  const { id, type, data, note, position, size } = clue;

  const isMediaClue = clue.type === "image" || "video";

  const resolvedWidth =
    size.width
      ? Math.max(size.width, MIN_WIDTH)
      : MIN_WIDTH;

  const resolvedHeight =
    size.height
      ? Math.max(size.height, MIN_HEIGHT)
      : isMediaClue
      ? 260
      : 160;


  const { x, y } = position;

  const startMouseRef = useRef(null);
  const startPosRef = useRef(null);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e) => {
    e.stopPropagation();

    // SHIFT + DRAG = CONNECTION
    if (e.shiftKey) {
      const worldPos = screenToWorld(
        e.clientX,
        e.clientY,
        pan,
        zoom
      );

      dispatch({
        type: "START_CONNECTION",
        payload: {
          from: id,
          x: worldPos.x,
          y: worldPos.y,
        },
      });
      return;
    }

    startMouseRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    startPosRef.current = { x, y };
    isDraggingRef.current = false;

    const handlePointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startMouseRef.current.x;
      const dy = moveEvent.clientY - startMouseRef.current.y;

      if (!isDraggingRef.current) {
        if (
          Math.abs(dx) < DRAG_THRESHOLD &&
          Math.abs(dy) < DRAG_THRESHOLD
        ) {
          return;
        }

        isDraggingRef.current = true;
        dispatch({ type: "SET_MODE", payload: "dragging" });
      }

      dispatch({
        type: "MOVE_CLUE",
        payload: {
          id,
          x: startPosRef.current.x + dx,
          y: startPosRef.current.y + dy,
        },
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      dispatch({ type: "SET_MODE", payload: "idle" });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  };


  const handleClick = (e) => {
    e.stopPropagation();

    if (e.shiftKey) return;

    dispatch({
      type: "SELECT_CLUE",
      payload: id,
    });
  };



  const handleContextMenu = (e) => {
    e.preventDefault();

    dispatch({
      type: "OPEN_CONTEXT_MENU",
      payload: {
        x: e.clientX,
        y: e.clientY,
        clueId: id,
      },
    });
  };



  const handleResizePointerDown = (e) => {
    e.stopPropagation();

    resizeRef.current = {
      active: true,
      startMouse: { x: e.clientX, y: e.clientY },
      startSize: {
        width: resolvedWidth,
        height: resolvedHeight,
      },
    };

    const handleMove = (moveEvent) => {
      if (!resizeRef.current.active) return;

      const dx =
        moveEvent.clientX -
        resizeRef.current.startMouse.x;
      const dy =
        moveEvent.clientY -
        resizeRef.current.startMouse.y;

      dispatch({
        type: "UPDATE_CLUE_SIZE",
        payload: {
          id,
          width: Math.max(
            MIN_WIDTH,
            resizeRef.current.startSize.width + dx
          ),
          height: Math.max(
            MIN_HEIGHT,
            resizeRef.current.startSize.height + dy
          ),
        },
      });
    };

    const handleUp = () => {
      resizeRef.current.active = false;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, {
      once: true,
    });
  };


  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={`clue-group
        ${isSelected ? "selected" : ""}
        ${isHoverTarget ? "hover-target" : ""}`}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <rect
        width={resolvedWidth}
        height={resolvedHeight}
        rx="10"
        className="clue-rect"
      />

      <foreignObject
        width={resolvedWidth}
        height={resolvedHeight}
      >
        <div className="clue-content">
          {type === "text" && (
            <p className="clue-text">{data.text}</p>
          )}
          {type === "image" && (
            <>
              <img
                src={data.src ? data.src : "/images/Sample-Image.png"}
                className="clue-image"
              />
              {data.caption && (
                <p className="clue-caption">
                  {data.caption}
                </p>
              )}
            </>
          )}

          {type === "video" && (
            <>
              {data?.src ? (
                <video
                  src={data.src}
                  className="clue-video"
                  controls
                  muted
                  poster={data.thumbnail}
                />
              ) : (
                <img
                  src={data.src ? data.src : "/images/Sample-Video.png"}
                  className="clue-image"
                />
              )}

              {data?.caption && (
                <p className="clue-caption">
                  {data.caption}
                </p>
              )}
            </>
          )}


          {note?.text && (
            <div className="clue-note">
              <span>Note:</span> {note.text}
            </div>
          )}
        </div>

      </foreignObject>


      {isSelected && (
        <rect
          x={resolvedWidth - 10}
          y={resolvedHeight - 10}
          width={10}
          height={10}
          rx={2}
          className="resize-handle"
          onPointerDown={handleResizePointerDown}
        />
      )}
      
    </g>
  );
};

export default Clue;