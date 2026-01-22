import { useState } from "react";
import api from "../../utils/axios";
import "./CreateCaseModal.css";

const CreateCaseModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Case title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/cases", {
        title,
        description,
      });

      onSuccess(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create case"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-case-overlay">
      <div className="create-case-modal">
        <h3>Create New Case</h3>

        {error && (
          <p className="modal-error">{error}</p>
        )}

        <input
          type="text"
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          disabled={loading}
        />

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn-create"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCaseModal;
