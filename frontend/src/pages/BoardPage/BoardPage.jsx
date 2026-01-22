import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Board from "../../components/Board/Board";
import ActionBar from "../../components/ActionBar/ActionBar";
import ToolMenu from "../../components/ActionBar/ToolMenu";
import ClueEditorModal from "../../components/ClueEditor/ClueEditorModal";
import ClueContextMenu from "../../components/ContextMenu/ClueContextMenu";
import ConnectionEditor from "../../components/Connection/ConnectionEditor";

import { useBoardState } from "../../state/useBoardState";
import axios from "../../utils/axios";
import { adaptBackendBoard } from "../../adapters/board.adapter";

import "./BoardPage.css";

const BoardPage = () => {
  const { state, dispatch } = useBoardState();

  const { id } = useParams();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  // Loading board on component mount
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const res = await axios.get(`/cases/${id}/board`);
        const adapted = adaptBackendBoard(res.data);

        dispatch({
          type: "LOAD_BOARD",
          payload: adapted,
        });

      } catch (err) {
        console.error("Failed to load board", err);
      }
    };

    loadBoard();
  }, [id, dispatch]);

  // Save board handler
  const handleSaveBoard = async () => {
    setSaving(true);
    setSaveError("");
    setSaved(false);
    dispatch({ type: "BOARD_SAVED" });

    try {

      await axios.post(`/cases/${id}/save`, { clues: state.clues, connections: state.connections });

      setSaved(true);
    } catch (err) {
      console.error("Save failed", err);
      setSaveError("Failed to save board");
    } finally {
      setSaving(false);
    }
  };


  // Save Board warning 
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (state.isSaved) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [state.isSaved]);

  return (
    <div
      className="board-page"
      onClick={() => {
        if (state.ui.contextMenu.open) {
          dispatch({ type: "CLOSE_CONTEXT_MENU" });
        }
      }}
    >
      {/* SAVE BUTTON */}
      <div className="board-save-bar">
        <button
          className="save-board-btn"
          onClick={handleSaveBoard}
          disabled={saving || state.isSaved}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {saved && (
          <span className="save-success">
            Saved ✓
          </span>
        )}

        {saveError && (
          <span className="save-error">
            {saveError}
          </span>
        )}
      </div>

      {/* Editors & Menus */}
      {state.ui.connectionEditor.open && (
        <ConnectionEditor
          connection={state.connections.find(
            (c) => c.id === state.ui.connectionEditor.connectionId
          )}
          dispatch={dispatch}
        />
      )}

      {state.ui.editor.open && (
        <ClueEditorModal
          clue={state.clues.find(
            (c) => c.id === state.ui.editor.clueId
          )}
          dispatch={dispatch}
          onClose={() =>
            dispatch({ type: "CLOSE_CLUE_EDITOR" })
          }
        />
      )}

      {state.ui.contextMenu.open && (
        <ClueContextMenu
          x={state.ui.contextMenu.x}
          y={state.ui.contextMenu.y}
          clueId={state.ui.contextMenu.clueId}
          dispatch={dispatch}
        />
      )}

      {/* Board */}
      <Board state={state} dispatch={dispatch} />

      {/* Action Bars */}
      <ActionBar
        dispatch={dispatch}
        activeTool={state.ui.activeTool}
      />

      <ToolMenu
        dispatch={dispatch}
        activeTool={state.ui.activeTool}
      />
    </div>
  );
};

export default BoardPage;
