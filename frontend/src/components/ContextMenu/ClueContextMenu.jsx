import "./ClueContextMenu.css";

const ClueContextMenu = ({ x, y, clueId, dispatch }) => {
  return (
    <div
      className="clue-context-menu"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          dispatch({
            type: "OPEN_CLUE_EDITOR",
            payload: clueId,
          });
          dispatch({ type: "CLOSE_CONTEXT_MENU" });
        }}
      >
        Edit Clue
      </button>

      <button 
        onClick={() => {
          dispatch({
            type: "DELETE_CLUE",
            payload: clueId,
          });
          dispatch({ type: "CLOSE_CONTEXT_MENU" });
        }}
      >
        Delete
      </button>

      <button disabled>Duplicate (Soon)</button>
    </div>
  );
};

export default ClueContextMenu;
