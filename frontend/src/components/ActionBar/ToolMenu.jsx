import AddMenu from "./menus/AddMenu";
import AIMenu from "./menus/AIMenu";
import ViewMenu from "./menus/ViewMenu";
import CaseMenu from "./menus/CaseMenu";
import './ToolMenu.css'

const ToolMenu = ({ activeTool, dispatch }) => {
  if (!activeTool) return null;

  return (
    <div className="tool-menu">
      {activeTool === "add" && <AddMenu dispatch={dispatch} />}
      {activeTool === "ai" && <AIMenu dispatch={dispatch} />}
      {activeTool === "view" && <ViewMenu dispatch={dispatch} />}
      {activeTool === "case" && <CaseMenu dispatch={dispatch} />}
    </div>
  );
};

export default ToolMenu;
