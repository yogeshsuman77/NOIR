import { useNavigate } from "react-router-dom";
import "./ModeSelect.css";

const ModeSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="mode-page">
      <div className="mode-header">
        <h1>Choose Your Investigation Mode</h1>
        <p>
          Decide how you want to analyze clues, build connections,
          and uncover the truth.
        </p>
      </div>

      <div className="mode-grid">
        <div
          className="mode-card active"
          onClick={() => navigate("/cases")}
        >
          <h2>Normal Investigation</h2>
          <p>
            Free-form investigation. Place clues, connect evidence,
            and reason at your own pace.
          </p>
          <span className="mode-tag">Available</span>
        </div>

        <div className="mode-card disabled">
          <h2>Game Mode</h2>
          <p>
            Structured cases, limited actions, scoring system,
            and narrative challenges.
          </p>
          <span className="mode-tag locked">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
