import { getClueCenter } from "../../utils/geometry";
import "./Connection.css";
import ConnectionControls from "./ConnectionControls";

const Connection = ({ connection, clues, dispatch }) => {
  const { from, to, style } = connection;

  const fromClue = clues.find((c) => c.id == from);
  const toClue = clues.find((c) => c.id == to);

  if (!fromClue || !toClue) return null;

  const fromPos = getClueCenter(fromClue);
  const toPos = getClueCenter(toClue);


  const centerX = (fromPos.x + toPos.x) / 2;
  const centerY = (fromPos.y + toPos.y) / 2;


  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);


  return (
    <g className="connection-group">
      <line
        x1={fromPos.x}
        y1={fromPos.y}
        x2={toPos.x}
        y2={toPos.y}
        stroke={style?.color ?? "#6ae3ff"}
        strokeWidth={style?.width ?? 2}
      />

      <line
        x1={fromPos.x}
        y1={fromPos.y}
        x2={toPos.x}
        y2={toPos.y}
        stroke="transparent"
        strokeWidth={20}
        className="connection-hit"
      />

      <g
        className="connection-arrow"
        transform={`
          translate(${centerX}, ${centerY})
          rotate(${angle})
        `}
      >
        <path
          d="M -6 -4 L 0 0 L -6 4"
          fill="none"
          stroke={style?.color ?? "#6ae3ff"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>


      <ConnectionControls
        x={(fromPos.x + toPos.x) / 2}
        y={(fromPos.y + toPos.y) / 2}
        connection={connection}
        dispatch={dispatch}
      />
    </g>
  );
};

export default Connection;
