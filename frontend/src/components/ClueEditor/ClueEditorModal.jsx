import { useRef, useState } from "react";
import "./ClueEditorModal.css";
import { uploadToImageKit } from "../../utils/imagekitUpload";

const ClueEditorModal = ({ clue, dispatch, onClose }) => {
  if (!clue) return null;

  const { id, type } = clue;

  // ==============================
  // LOCAL EDITABLE STATE
  // ==============================
  const [text, setText] = useState(clue?.data?.text || "");
  const [caption, setCaption] = useState(clue?.data?.caption || "");
  const [mediaSrc, setMediaSrc] = useState(clue?.data?.src || null);
  const [note, setNote] = useState(clue?.note?.text || "");

  // NEW STATES
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ==============================
  // SAVE HANDLER
  // ==============================
  const handleSave = async () => {
    try {
      setError("");
      let finalSrc = mediaSrc;

      // Uploading only if a new file is selected
      if ((type === "image" || type === "video") && selectedFile) {
        setUploading(true);

        const uploadedUrl = await uploadToImageKit(selectedFile);
        finalSrc = uploadedUrl;
      }

      const updatedData = {};

      if (type === "text") {
        updatedData.text = text;
      }

      if (type === "image" || type === "video") {
        updatedData.src = finalSrc;
        updatedData.caption = caption;
        if(type === "video"){
          updatedData.thumbnail = `${finalSrc}/ik-thumbnail.jpg?tr=so-5`
        }
      }

      dispatch({
        type: "UPDATE_CLUE",
        payload: {
          id,
          data: updatedData,
          noteText: note,
        },
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to upload media. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ==============================
  // FILE SELECTION PREVIEW
  // ==============================
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file); // MARKING AS NEW FILE
    setMediaSrc(URL.createObjectURL(file)); // PREVIEW ONLY
  };

  // ==============================
  // MEDIA EDITOR RENDER
  // ==============================
  const renderMediaEditor = () => {
    const accept =
      type === "image"
        ? "image/*"
        : type === "video"
        ? "video/*"
        : "";

    return (
      <div className="media-editor">
        <div className="media-preview">
          {!mediaSrc && (
            <div className="media-placeholder">
              Add {type}
            </div>
          )}

          {mediaSrc && type === "image" && (
            <img src={mediaSrc} alt="preview" />
          )}

          {mediaSrc && type === "video" && (
            <video src={mediaSrc} controls />
          )}

          <button
            className="media-edit-btn"
            onClick={() => fileInputRef.current.click()}
          >
            ✎
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          hidden
          onChange={handleFileSelect}
        />

        <label>
          Caption
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>
      </div>
    );
  };

  
  
  return (
    <div className="clue-editor-backdrop" onClick={onClose}>
      <div
        className="clue-editor"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <h3>Edit {type} clue</h3>
          <button onClick={onClose}>×</button>
        </header>

        <div className="editor-body">
          {type === "text" && (
            <label>
              Text
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
          )}

          {(type === "image" || type === "video") &&
            renderMediaEditor()}

          <label>
            Notes
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {error && <p className="error-text">{error}</p>}
        </div>

        <footer>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={uploading}
          >
            {uploading ? "Uploading media..." : "Save"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ClueEditorModal;