export const createClue = ({
  id,
  type,
  data,

  noteText = "",
  tags = [],

  x = 0,
  y = 0,

  source = null,
  createdBy = null,
}) => {
  const now = Date.now();

  return {
  id,

  type,
  data,

  note: {
    text: noteText,
    lastEditedAt: noteText ? now : null,
  },

  tags,

  meta: {
    source,
    confidence: null,
    createdBy,
  },

  position: {
    x,
    y,
  },

  // 🔥 NEW: sizing system
  size: {
    width: null,     // number | null
    height: null,    // number | null
    mode: "auto",    // "auto" | "manual"
  },

  createdAt: now,
  updatedAt: now,
};

};
