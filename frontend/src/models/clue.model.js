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

    // how this clue should be rendered
    type,

    // raw evidence (image, text, link, etc.)
    data,

    // investigator's personal observation
    note: {
      text: noteText,
      lastEditedAt: noteText ? now : null,
    },

    // soft classification
    tags,

    // system-level metadata
    meta: {
      source,
      confidence: null,
      createdBy,
    },

    // spatial meaning on the board
    position: {
      x,
      y,
    },

    createdAt: now,
    updatedAt: now,
  };
};
