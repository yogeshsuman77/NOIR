const DEFAULT_IMAGE_SRC = "/images/default-image.png";
const DEFAULT_VIDEO_THUMBNAIL = "/images/default-video.png";

const DEFAULT_WIDTH = 240;
const DEFAULT_HEIGHT = 220;

export const adaptBackendClue = (backendClue) => {
  const type = backendClue.type;

  let data = {
    text: null
  };

  if (type === "text") {
    data.text = typeof backendClue.data?.text === "string" ? backendClue.data.text : null;
  }

  if (type === "image") {
    data.src = typeof backendClue.data?.src === "string" ? backendClue.data.src : "/images/Sample-Image.png";

    data.caption = typeof backendClue.data?.caption === "string" ? backendClue.data.caption : null;
  }

  if (type === "video") {
    data.src = typeof backendClue.data?.src === "string" ? backendClue.data.src : null;

    data.thumbnail = typeof backendClue.data?.thumbnail === "string" ? backendClue.data.thumbnail : "/images/Sample-Video.png";

    data.caption = typeof backendClue.data?.caption === "string" ? backendClue.data.caption : null;
  }


  const size = {
    width: backendClue.size?.width ? backendClue.size.width : DEFAULT_WIDTH,

    height: backendClue.size?.height ? backendClue.size.height : DEFAULT_HEIGHT,
  };

  
  return {
    id: backendClue.clientId,

    type,

    data,

    note: {
      text: backendClue.note?.text ? backendClue.note.text : null,
      lastEditedAt: backendClue.note?.lastEditedAt ? backendClue.note.lastEditedAt : null,
    },

    position: {
      x: backendClue.position?.x ? backendClue.position.x : 0,
      y: backendClue.position?.y ? backendClue.position.y : 0,
    },

    size,

    meta: {
      source: backendClue.meta?.source ?? null,
    },

    createdAt: backendClue.createdAt,
    updatedAt: backendClue.updatedAt,
  };
};
