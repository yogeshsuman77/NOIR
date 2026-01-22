const ConnectionControls = ({ x, y, connection, dispatch }) => {
  return (
    <g
      className="connection-controls"
      transform={`translate(${x}, ${y})`}
    >
      <rect
        x={-24}
        y={-12}
        width={48}
        height={24}
        rx={12}
        fill="#111"
      />

      {/* EDIT */}
      <text
        x={-8}
        y={1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="#6ae3ff"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          dispatch({
            type: "OPEN_CONNECTION_EDITOR",
            payload: connection.id,
          });
        }}
      >
        ✎
      </text>

      {/* DELETE */}
      <text
        x={8}
        y={1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="#ff6b6b"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          dispatch({
            type: "DELETE_CONNECTION",
            payload: connection.id,
          });
        }}
      >
        ×
      </text>
    </g>
  );
};

export default ConnectionControls;
