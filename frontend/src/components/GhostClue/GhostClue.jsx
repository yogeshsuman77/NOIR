import "./GhostClue.css";

const GhostClue = ({ x, y, type, tempData }) => {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="ghost-clue"
      pointerEvents="none"
    >
      <rect width="240" height="220" rx="10" />

      <foreignObject width="240" height="220">
        <div className="ghost-content">
          {type && (
            <p>New {type} clue</p>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

export default GhostClue;
