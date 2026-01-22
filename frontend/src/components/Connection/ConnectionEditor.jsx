import "./ConnectionEditor.css";

const ConnectionEditor = ({ connection, dispatch }) => {
  if (!connection) return null;

  return (
    <div className="connection-editor">
      <div className="editor-header">
        Edit Connection
        <button
          onClick={() =>
            dispatch({ type: "CLOSE_CONNECTION_EDITOR" })
          }
        >
          ×
        </button>
      </div>

      <label>
        Color
        <input
          type="color"
          value={connection.style?.color ?? "#6ae3ff"}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_CONNECTION_STYLE",
              payload: {
                id: connection.id,
                style: { color: e.target.value },
              },
            })
          }
        />
      </label>
    </div>
  );
};

export default ConnectionEditor;
