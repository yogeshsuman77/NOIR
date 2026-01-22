import "./ActionBar.css";

const ActionBar = ({ dispatch, activeTool }) => {
  return (
    <div className="action-bar">

      <button
        className={activeTool === "add" ? "active" : ""}
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_TOOL", payload: "add" })
        }
      >
        +
      </button>

      <button
        className={activeTool === "ai" ? "active" : ""}
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_TOOL", payload: "ai" })
        }
      >
        AI
      </button>

      <button
        className={activeTool === "view" ? "active" : ""}
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_TOOL", payload: "view" })
        }
      >
        👁
      </button>

      <button
        className={activeTool === "case" ? "active" : ""}
        onClick={() =>
          dispatch({ type: "SET_ACTIVE_TOOL", payload: "case" })
        }
      >
        ☰
      </button>
    </div>
  );
};

export default ActionBar;
