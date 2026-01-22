import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import "./CaseList.css";
import CreateCaseModal from "../../components/CreateCaseModal/CreateCaseModal";

const CaseList = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases");
        setCases(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load cases"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="cases-page">
      
      <header className="cases-header">
        <h1>Your Cases</h1>
        <p>Active investigations and unresolved truths</p>
      </header>

      {loading && <p className="status-text">Loading cases...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!loading && cases.length === 0 && (
        <p className="status-text">
          No cases yet. Begin your first investigation.
        </p>
      )}

      <div className="case-grid">
        {/* create case */}
        <div
          className="case-card create-case"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="create-inner">
            <span className="plus">+</span>
            <span>Create Case</span>
          </div>
        </div>

        {/* existing cases */}
        {cases.map((caseItem) => (
          <div
            key={caseItem._id}
            className="case-card"
            onClick={() => navigate(`/case/${caseItem._id}`)}
          >
            <h3>{caseItem.title}</h3>
            {caseItem.description && (
              <p>{caseItem.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* create case model */}
      {showCreateModal && (
        <CreateCaseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newCase) => {
            setShowCreateModal(false);
            navigate(`/case/${newCase._id}`);
          }}
        />
      )}
    </div>
  );
};

export default CaseList;
